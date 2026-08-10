'use client'

import { useEffect, useRef } from 'react'

/**
 * The constellation over the ground network, drawn rather than illustrated.
 *
 * Canvas because the geometry is computed — orbital planes at real inclinations,
 * satellites advancing along them, and a link drawn only where one is actually
 * above a ground site's horizon. Hand-authored SVG paths could imitate the picture
 * but not the relationship, and the relationship is the whole point: coverage is
 * a function of where the satellites are, not a decorative arc.
 *
 * Everything is deterministic. No random seeding, so the frame a screenshot
 * catches is the frame anyone else catches at the same phase.
 */

interface Site {
  readonly lat: number
  readonly lon: number
  readonly name: string
}

/** Ground points, spread so the picture is not all one hemisphere. */
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

const PLANES = [
  { inclination: 53, ascending: 0, count: 7 },
  { inclination: 53, ascending: 72, count: 7 },
  { inclination: 70, ascending: 144, count: 5 },
  { inclination: 97, ascending: 216, count: 5 },
]

const RAD = Math.PI / 180

/** Rotate a unit vector about Y (the spin) then tilt about X (the view). */
function project(x: number, y: number, z: number, spin: number, tilt: number) {
  const cs = Math.cos(spin)
  const sn = Math.sin(spin)
  const xr = x * cs - z * sn
  const zr = x * sn + z * cs
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  const yr = y * ct - zr * st
  const zt = y * st + zr * ct
  return { x: xr, y: yr, z: zt }
}

function geo(lat: number, lon: number) {
  const la = lat * RAD
  const lo = lon * RAD
  return { x: Math.cos(la) * Math.cos(lo), y: Math.sin(la), z: Math.cos(la) * Math.sin(lo) }
}

export function Orbit({ height = 460 }: { height?: number }) {
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

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(t: number) {
      const cx = width / 2
      const cy = h / 2
      const r = Math.min(width, h) * 0.36
      const spin = t * 0.00006
      const tilt = -20 * RAD

      ctx!.clearRect(0, 0, width, h)

      // Graticule — the globe is implied by its grid, not by a filled sphere.
      ctx!.lineWidth = 1
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx!.beginPath()
        for (let lon = 0; lon <= 360; lon += 4) {
          const p = geo(lat, lon)
          const q = project(p.x, p.y, p.z, spin, tilt)
          const sx = cx + q.x * r
          const sy = cy - q.y * r
          if (lon === 0) ctx!.moveTo(sx, sy)
          else ctx!.lineTo(sx, sy)
        }
        ctx!.strokeStyle = `rgba(255,255,255,${lat === 0 ? 0.16 : 0.07})`
        ctx!.stroke()
      }
      for (let lon = 0; lon < 360; lon += 30) {
        ctx!.beginPath()
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = geo(lat, lon)
          const q = project(p.x, p.y, p.z, spin, tilt)
          ctx!.lineTo(cx + q.x * r, cy - q.y * r)
        }
        ctx!.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx!.stroke()
      }

      // Ground sites. Only the ones on the near face are drawn — a site on the far
      // side of the planet is not visible, and drawing it anyway is the tell that a
      // globe is a picture rather than a model.
      const ground: { x: number; y: number; z: number; name: string }[] = []
      for (const s of SITES) {
        const p = geo(s.lat, s.lon)
        const q = project(p.x, p.y, p.z, spin, tilt)
        ground.push({ x: cx + q.x * r, y: cy - q.y * r, z: q.z, name: s.name })
        if (q.z < 0) continue
        ctx!.beginPath()
        ctx!.arc(cx + q.x * r, cy - q.y * r, 2.2, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(255,255,255,0.85)'
        ctx!.fill()
      }

      // Satellites on inclined planes, and the link to the nearest visible site.
      const alt = 1.28
      for (const plane of PLANES) {
        const inc = plane.inclination * RAD
        const asc = plane.ascending * RAD

        ctx!.beginPath()
        for (let a = 0; a <= 360; a += 3) {
          const th = a * RAD
          const ox = Math.cos(th)
          const oy = Math.sin(th) * Math.cos(inc)
          const oz = Math.sin(th) * Math.sin(inc)
          const rx = ox * Math.cos(asc) - oz * Math.sin(asc)
          const rz = ox * Math.sin(asc) + oz * Math.cos(asc)
          const q = project(rx * alt, oy * alt, rz * alt, spin, tilt)
          if (a === 0) ctx!.moveTo(cx + q.x * r, cy - q.y * r)
          else ctx!.lineTo(cx + q.x * r, cy - q.y * r)
        }
        ctx!.strokeStyle = 'rgba(255,255,255,0.09)'
        ctx!.stroke()

        for (let i = 0; i < plane.count; i++) {
          const th = (i / plane.count) * Math.PI * 2 + t * 0.00021 + asc
          const ox = Math.cos(th)
          const oy = Math.sin(th) * Math.cos(inc)
          const oz = Math.sin(th) * Math.sin(inc)
          const rx = ox * Math.cos(asc) - oz * Math.sin(asc)
          const rz = ox * Math.sin(asc) + oz * Math.cos(asc)
          const q = project(rx * alt, oy * alt, rz * alt, spin, tilt)
          const sx = cx + q.x * r
          const sy = cy - q.y * r
          const near = q.z > -0.2

          // A link is drawn when the satellite is on the near face and a site is
          // close enough on screen to be under it — the geometry decides, not a
          // decorative rule.
          if (near) {
            for (const g of ground) {
              if (g.z < 0.1) continue
              const d = Math.hypot(g.x - sx, g.y - sy)
              if (d > r * 0.5) continue
              ctx!.beginPath()
              ctx!.moveTo(sx, sy)
              ctx!.lineTo(g.x, g.y)
              ctx!.strokeStyle = `rgba(255,255,255,${0.28 * (1 - d / (r * 0.5))})`
              ctx!.stroke()
            }
          }

          ctx!.beginPath()
          ctx!.arc(sx, sy, near ? 1.9 : 1.2, 0, Math.PI * 2)
          ctx!.fillStyle = near ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)'
          ctx!.fill()
        }
      }
    }

    function frame(t: number) {
      draw(t)
      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    if (still) draw(0)
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
      aria-label="Orbital constellation over the Lux ground network"
    />
  )
}
