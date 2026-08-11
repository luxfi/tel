'use client'

import { useEffect, useRef } from 'react'

import { isLand } from '@/content/land'

/**
 * The constellation over the Earth, propagated from the wall clock.
 *
 * Real coastlines (content/land), real sidereal orientation, Keplerian period from
 * the altitude, and a Walker star — nodes spanning 180°, so one seam counter-rotates
 * and carries no cross-links.
 */

const RAD = Math.PI / 180
const EARTH_KM = 6371
const MU = 398600.4418 // km^3/s^2

// Near-polar: pole-to-pole coverage from the fewest satellites.
const ALT_KM = 780
const INCLINATION = 86.4
const PLANES = 6
const PER_PLANE = 11

const A_KM = EARTH_KM + ALT_KM
const ORBIT_R = A_KM / EARTH_KM
const PERIOD_S = 2 * Math.PI * Math.sqrt((A_KM * A_KM * A_KM) / MU)

/** Elevation a terminal needs before a satellite counts as usable. */
const MASK_DEG = 8.2
/** Above this latitude the planes converge fast enough that cross-links drop. */
const CROSSLINK_LAT = 68

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
 * One satellite in inertial space. `u` is the argument of latitude — the angle
 * travelled from the ascending node — and `raan` is where that node sits.
 */
function orbital(u: number, raan: number, inc: number): Vec {
  const cu = Math.cos(u)
  const su = Math.sin(u)
  const ci = Math.cos(inc)
  const si = Math.sin(inc)
  const cr = Math.cos(raan)
  const sr = Math.sin(raan)
  return {
    x: (cu * cr - su * ci * sr) * ORBIT_R,
    y: su * si * ORBIT_R,
    z: (cu * sr + su * ci * cr) * ORBIT_R,
  }
}

/** Spin about the polar axis, then tilt the view. Screen y grows downward. */
function view(p: Vec, spin: number, tilt: number): Vec {
  const cs = Math.cos(spin)
  const sn = Math.sin(spin)
  const x = p.x * cs - p.z * sn
  const z = p.x * sn + p.z * cs
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  return { x, y: p.y * ct - z * st, z: p.y * st + z * ct }
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

/** Elevation in degrees of `sat` seen from the ground point `g` (both Earth-fixed). */
function elevation(g: Vec, sat: Vec): number {
  const dx = sat.x - g.x
  const dy = sat.y - g.y
  const dz = sat.z - g.z
  const range = Math.hypot(dx, dy, dz)
  if (range === 0) return 90
  const up = (g.x * dx + g.y * dy + g.z * dz) / range
  return Math.asin(Math.max(-1, Math.min(1, up))) / RAD
}

export function Globe({ height = 560 }: { height?: number }) {
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
      const r = Math.min(width, h * 1.7) * 0.42
      const tilt = -22 * RAD
      const t = nowMs / 1000

      // The orbits are inertial; rotating the ground by GMST is the same relative
      // motion in one transform.
      const spin = gmst(nowMs)
      const px = (p: Vec) => cx + p.x * r
      const py = (p: Vec) => cy - p.y * r

      c.clearRect(0, 0, width, h)

      // Limb and a faint wash: enough to read solid.
      c.beginPath()
      c.arc(cx, cy, r, 0, Math.PI * 2)
      c.fillStyle = 'rgba(255,255,255,0.035)'
      c.fill()
      c.strokeStyle = 'rgba(255,255,255,0.14)'
      c.lineWidth = 1
      c.stroke()

      // Far-side dots are dropped, not dimmed — the planet is opaque.
      for (const d of dots) {
        const q = view(d, spin, tilt)
        if (q.z < 0) continue
        // Fade toward the limb, where the surface is edge-on.
        const a = 0.34 + 0.56 * q.z
        c.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
        c.fillRect(px(q) - 0.9, py(q) - 0.9, 1.8, 1.8)
      }

      // Ground sites, and their horizon.
      const ground = sites.map((s) => ({ ...s, q: view(s.v, spin, tilt) }))
      for (const g of ground) {
        if (g.q.z < 0) continue
        c.beginPath()
        c.arc(px(g.q), py(g.q), 2.4, 0, Math.PI * 2)
        c.fillStyle = 'rgba(255,255,255,0.9)'
        c.fill()
      }

      // Mean motion is exact for the altitude.
      const n = (Math.PI * 2) / PERIOD_S
      const inc = INCLINATION * RAD
      const sats: { p: Vec; q: Vec; plane: number; slot: number; lat: number }[] = []
      for (let plane = 0; plane < PLANES; plane++) {
        const raan = (plane / PLANES) * Math.PI // 180°, not 360° — Walker star
        for (let slot = 0; slot < PER_PLANE; slot++) {
          // Half-slot offset so planes interleave instead of flying in rows.
          const u = n * t + (slot / PER_PLANE) * Math.PI * 2 + (plane % 2) * (Math.PI / PER_PLANE)
          const p = orbital(u, raan, inc)
          const q = view(p, 0, tilt)
          sats.push({ p, q, plane, slot, lat: Math.asin(p.y / ORBIT_R) / RAD })
        }
      }

      // Mesh, drawn under the satellites.
      c.lineWidth = 1
      for (const s of sats) {
        const fore = sats[s.plane * PER_PLANE + ((s.slot + 1) % PER_PLANE)]
        link(s, fore, 0.17)

        // One direction only. The last plane's neighbour is the counter-rotating
        // seam — those two pass at twice orbital speed and are never linked.
        if (s.plane === PLANES - 1) continue
        if (Math.abs(s.lat) > CROSSLINK_LAT) continue
        let best: (typeof sats)[number] | null = null
        let bestD = Infinity
        for (let k = 0; k < PER_PLANE; k++) {
          const o = sats[(s.plane + 1) * PER_PLANE + k]
          if (Math.abs(o.lat) > CROSSLINK_LAT) continue
          const d = Math.hypot(o.p.x - s.p.x, o.p.y - s.p.y, o.p.z - s.p.z)
          if (d < bestD) {
            bestD = d
            best = o
          }
        }
        if (best) link(s, best, 0.1)
      }

      function link(a: { p: Vec; q: Vec }, b: { p: Vec; q: Vec }, alpha: number) {
        if (a.q.z < 0 && b.q.z < 0) return
        // A chord whose midpoint is inside the disc and behind it is occluded.
        const mx = (a.p.x + b.p.x) / 2
        const my = (a.p.y + b.p.y) / 2
        const mz = (a.p.z + b.p.z) / 2
        const m = view({ x: mx, y: my, z: mz }, 0, tilt)
        if (m.z < 0 && Math.hypot(m.x, m.y) < 1) return
        c.beginPath()
        c.moveTo(px(a.q), py(a.q))
        c.lineTo(px(b.q), py(b.q))
        c.strokeStyle = `rgba(255,255,255,${alpha})`
        c.stroke()
      }

      // A terminal tracks ONE satellite plus the next during handover. Drawing every
      // one above the mask angle put a dozen chords across the planet.
      for (const g of ground) {
        if (g.q.z < -0.1) continue
        let best: (typeof sats)[number] | null = null
        let next: (typeof sats)[number] | null = null
        let bestEl = MASK_DEG
        let nextEl = MASK_DEG
        for (const s of sats) {
          const el = elevation(g.v, s.p)
          if (el > bestEl) {
            next = best
            nextEl = bestEl
            best = s
            bestEl = el
          } else if (el > nextEl) {
            next = s
            nextEl = el
          }
        }
        // Brightest overhead, as the link budget is.
        if (best) feeder(g.q, best.q, 0.14 + 0.5 * (bestEl / 90))
        if (next) feeder(g.q, next.q, 0.06 + 0.16 * (nextEl / 90))
      }

      function feeder(a: Vec, b: Vec, alpha: number) {
        c.beginPath()
        c.moveTo(px(a), py(a))
        c.lineTo(px(b), py(b))
        c.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
        c.stroke()
      }

      for (const s of sats) {
        const near = s.q.z >= 0
        // Far-side satellites stay, faint: the shell is the subject.
        c.beginPath()
        c.arc(px(s.q), py(s.q), near ? 1.9 : 1.3, 0, Math.PI * 2)
        c.fillStyle = near ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)'
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

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height }}
      role="img"
      aria-label={`${PLANES * PER_PLANE} satellites in ${PLANES} near-polar planes, with inter-satellite links and the ground sites currently in view`}
    />
  )
}
