'use client'

import { useEffect, useRef } from 'react'

import { isLand } from '@/content/land'

/**
 * The constellation over the Earth, propagated from the wall clock.
 *
 * Real coastlines (content/land), real sidereal orientation, Keplerian periods from
 * the altitudes, and two shells — an inclined bulk that leaves the poles thin, and
 * a polar shell that fills them. Coverage is counted, not tinted, so where it is
 * deep and where it is thin is a result rather than a decision.
 */

const RAD = Math.PI / 180
const EARTH_KM = 6371
const MU = 398600.4418 // km^3/s^2

/**
 * Two shells, because one cannot do both jobs. An inclined shell carries the
 * capacity and leaves the poles thin; a polar shell is sparse but reaches them.
 * Every real system that sells both maritime and mid-latitude broadband flies this
 * pair, and the picture shows why: the count falls away past the inclination, and
 * the polar planes are what remain there.
 */
const SHELLS = [
  { planes: 72, per: 22, inc: 53, altKm: 550, mask: 25 },
  { planes: 6, per: 11, inc: 86.4, altKm: 780, mask: 8.2 },
] as const

interface Site {
  readonly lat: number
  readonly lon: number
  readonly name: string
}

const SITES: readonly Site[] = [
  { lat: 37.77, lon: -122.42, name: 'SFO' },
  { lat: 40.71, lon: -74.0, name: 'NYC' },
  { lat: 51.5, lon: -0.13, name: 'LON' },
  { lat: 50.11, lon: 8.68, name: 'FRA' },
  { lat: 1.35, lon: 103.82, name: 'SIN' },
  { lat: 35.68, lon: 139.69, name: 'TYO' },
  { lat: -33.87, lon: 151.21, name: 'SYD' },
  { lat: -23.55, lon: -46.63, name: 'GRU' },
  { lat: 25.2, lon: 55.27, name: 'DXB' },
  { lat: -1.29, lon: 36.82, name: 'NBO' },
]

type Vec = { x: number; y: number; z: number }

/** Earth-fixed unit vector for a geodetic point. */
function fromGeo(lat: number, lon: number): Vec {
  const la = lat * RAD
  const lo = lon * RAD
  return { x: Math.cos(la) * Math.cos(lo), y: Math.sin(la), z: Math.cos(la) * Math.sin(lo) }
}

/**
 * Greenwich mean sidereal time, radians. IAU 1982.
 *
 * A phase turns at the right rate from an arbitrary start, so it shows the wrong
 * face by a fixed angle forever. This shows the right one.
 */
function gmst(nowMs: number): number {
  const jd = nowMs / 86400000 + 2440587.5
  const d = jd - 2451545.0
  const T = d / 36525
  const deg = 280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38710000
  return (((deg % 360) + 360) % 360) * RAD
}

/**
 * Angular radius of the ground area a satellite can serve, from its altitude and
 * the elevation a terminal needs. Raise the mask and the footprints shrink, exactly
 * as coverage does.
 */
function footprint(altKm: number, maskDeg: number): number {
  const ratio = EARTH_KM / (EARTH_KM + altKm)
  const e = maskDeg * RAD
  return Math.acos(ratio * Math.cos(e)) - e
}

/** Elevation in degrees of `sat` seen from ground point `g`, both Earth-fixed. */
function elevation(g: Vec, sat: Vec): number {
  const dx = sat.x - g.x
  const dy = sat.y - g.y
  const dz = sat.z - g.z
  const range = Math.hypot(dx, dy, dz)
  if (range === 0) return 90
  const up = (g.x * dx + g.y * dy + g.z * dz) / range
  return Math.asin(Math.max(-1, Math.min(1, up))) / RAD
}

/** One satellite, with everything constant about it resolved once. */
interface Sat {
  readonly n: number // mean motion, rad/s
  readonly u0: number // argument of latitude at t=0
  readonly r: number // orbit radius, Earth radii
  readonly capR: number // footprint radius, radians
  // The plane's rotation, folded to three numbers so the hot loop is two sin/cos.
  readonly cr: number
  readonly sr: number
  readonly ci: number
  readonly si: number
}

function build(): Sat[] {
  const out: Sat[] = []
  for (const s of SHELLS) {
    const a = EARTH_KM + s.altKm
    const n = Math.sqrt(MU / (a * a * a))
    const r = a / EARTH_KM
    const capR = footprint(s.altKm, s.mask)
    const inc = s.inc * RAD
    const ci = Math.cos(inc)
    const si = Math.sin(inc)
    // A polar shell's nodes span 180°: at Ω and Ω+180° it is one ring travelled
    // opposite ways. An inclined shell's span the full 360°.
    const span = s.inc > 80 ? Math.PI : Math.PI * 2
    for (let p = 0; p < s.planes; p++) {
      const raan = (p / s.planes) * span
      const cr = Math.cos(raan)
      const sr = Math.sin(raan)
      for (let k = 0; k < s.per; k++) {
        // Half-slot offset between adjacent planes so they interleave.
        const u0 = (k / s.per) * Math.PI * 2 + (p % 2) * (Math.PI / s.per)
        out.push({ n, u0, r, capR, cr, sr, ci, si })
      }
    }
  }
  return out
}

export function Globe({ height }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let width = 0
    let h = 0

    const sats = build()

    // Longitude step widens by 1/cos(lat): a fixed step in degrees packs the poles
    // solid and reads as a bullseye.
    const dots: Vec[] = []
    for (let lat = -84; lat <= 84; lat += 2) {
      const step = 2 / Math.max(0.12, Math.cos(lat * RAD))
      for (let lon = -180; lon < 180; lon += step) {
        if (isLand(lat, lon)) dots.push(fromGeo(lat, lon))
      }
    }
    const sites = SITES.map((s) => ({ ...s, v: fromGeo(s.lat, s.lon) }))

    // Coverage count, one cell per 2.5 degrees, EARTH-FIXED.
    const CELL = 2.5
    const CW = Math.round(360 / CELL)
    const CH = Math.round(180 / CELL)
    const cover = new Uint8Array(CW * CH)

    /** Add one satellite's footprint, centred on its sub-satellite point. */
    function stamp(lat: number, lon: number, capDeg: number) {
      const r0 = Math.max(0, Math.floor((lat + 90 - capDeg) / CELL))
      const r1 = Math.min(CH - 1, Math.ceil((lat + 90 + capDeg) / CELL))
      for (let row = r0; row <= r1; row++) {
        const cellLat = -90 + (row + 0.5) * CELL
        // Longitude half-width of the cap at this latitude. Wider toward the poles,
        // and the whole row once the cap reaches over one.
        const cosd = Math.cos(capDeg * RAD) - Math.sin(lat * RAD) * Math.sin(cellLat * RAD)
        const den = Math.cos(lat * RAD) * Math.cos(cellLat * RAD)
        if (den <= 1e-9) continue
        const q = cosd / den
        if (q > 1) continue
        const half = q < -1 ? 180 : Math.acos(q) / RAD
        const c0 = Math.floor((lon + 180 - half) / CELL)
        const c1 = Math.ceil((lon + 180 + half) / CELL)
        for (let col = c0; col <= c1; col++) {
          const i = row * CW + ((col % CW) + CW) % CW
          if (cover[i] < 255) cover[i]++
        }
      }
    }

    /** How many satellites can see this Earth-fixed point, right now. */
    function look(v: Vec): number {
      const lat = Math.asin(v.y) / RAD
      const lon = Math.atan2(v.z, v.x) / RAD
      const row = Math.min(CH - 1, Math.max(0, Math.floor((lat + 90) / CELL)))
      const col = ((Math.floor((lon + 180) / CELL) % CW) + CW) % CW
      return cover[row * CW + col]
    }

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(nowMs: number) {
      const c = ctx!
      const cx = width / 2
      const cy = h / 2
      const r = Math.min(width, h) * 0.42
      const tilt = -22 * RAD
      const t = nowMs / 1000

      // The orbits are inertial; rotating the ground by GMST is the same relative
      // motion in one transform.
      const spin = gmst(nowMs)
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)

      c.clearRect(0, 0, width, h)

      c.beginPath()
      c.arc(cx, cy, r, 0, Math.PI * 2)
      c.fillStyle = 'rgba(255,255,255,0.04)'
      c.fill()

      const cs = Math.cos(spin)
      const sn = Math.sin(spin)
      const spinDeg = spin / RAD

      // COVERAGE, as DEPTH rather than as a wash. Every point under the inclined
      // shell has eight or nine satellites in view at once, so a plain "is it
      // covered" tint is uniformly on and says nothing. Counting them says the
      // thing that matters: the count falls away past the shell's inclination, and
      // what remains there is the polar shell. That gradient is the argument for
      // flying two.
      //
      // Stamped into a coarse grid rather than tested per dot: per-dot would be
      // 4,000 x 1,650 comparisons a frame, and this is ~34,000.
      cover.fill(0)
      for (const s of sats) {
        const u = s.n * t + s.u0
        const cu = Math.cos(u)
        const su = Math.sin(u)
        const x = (cu * s.cr - su * s.ci * s.sr) * s.r
        const y = su * s.si * s.r
        const z = (cu * s.sr + su * s.ci * s.cr) * s.r
        // Inertial longitude minus GMST is the Earth-fixed one — the grid is read
        // by ground points, so the stamp has to land in their frame.
        stamp(Math.asin(y / s.r) / RAD, Math.atan2(z, x) / RAD - spinDeg, s.capR / RAD)
      }

      // Land, lit by how many satellites can see it. Far-side dots are dropped, not
      // dimmed — the planet is opaque.
      for (const d of dots) {
        const zr = d.x * sn + d.z * cs
        const vz = d.y * st + zr * ct
        if (vz < 0) continue
        const n = look(d)
        // Coverage modulates only the top quarter of the range. Land legibility is
        // the floor: most land sits under the inclined shell, so a wide modulation
        // would spend most of its range on a signal that barely varies there.
        const a = (0.42 + 0.5 * vz) * (0.78 + 0.22 * Math.min(1, n / 6))
        c.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
        c.fillRect(cx + (d.x * cs - d.z * sn) * r - 1, cy - (d.y * ct - zr * st) * r - 1, 2, 2)
      }

      c.strokeStyle = 'rgba(255,255,255,0.16)'
      c.lineWidth = 1
      c.beginPath()
      c.arc(cx, cy, r, 0, Math.PI * 2)
      c.stroke()

      // The satellites themselves, one pixel each. At this density the shell reads
      // as a texture, and anything larger becomes a solid ring at the limb.
      c.fillStyle = 'rgba(255,255,255,0.4)'
      const near: { x: number; y: number; p: Vec }[] = []
      for (const s of sats) {
        const u = s.n * t + s.u0
        const cu = Math.cos(u)
        const su = Math.sin(u)
        const x = (cu * s.cr - su * s.ci * s.sr) * s.r
        const y = su * s.si * s.r
        const z = (cu * s.sr + su * s.ci * s.cr) * s.r
        const zr = x * sn + z * cs
        const vz = y * st + zr * ct
        if (vz < 0) continue
        const sx = cx + (x * cs - z * sn) * r
        const sy = cy - (y * ct - zr * st) * r
        c.fillRect(sx, sy, 1, 1)
        near.push({ x: sx, y: sy, p: { x, y, z } })
      }

      // The ground sites, and the ONE satellite each is working through. A terminal
      // tracks one; drawing every satellite in view would put a thousand chords
      // across the planet and say nothing.
      for (const g of sites) {
        const zr = g.v.x * sn + g.v.z * cs
        const gz = g.v.y * st + zr * ct
        if (gz < 0) continue
        const gx = cx + (g.v.x * cs - g.v.z * sn) * r
        const gy = cy - (g.v.y * ct - zr * st) * r

        let best: (typeof near)[number] | null = null
        let bestEl = 0
        for (const s of near) {
          const el = elevation(g.v, s.p)
          if (el > bestEl) {
            bestEl = el
            best = s
          }
        }
        if (best) {
          c.beginPath()
          c.moveTo(gx, gy)
          c.lineTo(best.x, best.y)
          c.strokeStyle = `rgba(255,255,255,${(0.15 + 0.45 * (bestEl / 90)).toFixed(3)})`
          c.stroke()
          c.beginPath()
          c.arc(best.x, best.y, 2, 0, Math.PI * 2)
          c.fillStyle = 'rgba(255,255,255,0.95)'
          c.fill()
        }

        c.beginPath()
        c.arc(gx, gy, 2.6, 0, Math.PI * 2)
        c.fillStyle = 'rgba(255,255,255,0.95)'
        c.fill()
      }
    }

    function frame() {
      draw(Date.now())
      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    if (still) draw(Date.now())
    else raf = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  const total = SHELLS.reduce((n, s) => n + s.planes * s.per, 0)
  return (
    <canvas
      ref={ref}
      style={height ? { width: '100%', height } : { width: '100%', height: '100%' }}
      role="img"
      aria-label={`${total} satellites in two shells, their coverage footprints, and the ground sites currently in view`}
    />
  )
}
