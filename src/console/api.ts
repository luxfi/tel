'use client'

import { stored } from './auth'

/**
 * The tel API, read from the console.
 *
 * Same-origin is not an option — the console is a static export on lux.tel and the
 * API is api.hanzo.ai — so this is a cross-origin call with the Lux ID token the
 * console already holds. api.hanzo.ai answers the preflight for console.lux.tel
 * with `allow-origin: https://console.lux.tel`, so the browser permits it.
 *
 * The token is the whole request. The API takes the org from the validated token,
 * the same as every other route, so the console sends no X-Org-Id.
 */
export const API = 'https://api.hanzo.ai'

export interface Number {
  id: string
  e164: string
  country: string
  type: string
  capable?: string[]
  monthly?: number
  currency?: string
}

export interface Call {
  id: string
  from: string
  to: string
  status?: string
  startedAt?: string
  seconds?: number
}

export interface Message {
  id: string
  from: string
  to: string
  body?: string
  status?: string
  sentAt?: string
}

export interface Summary {
  numbers: number
  calls: number
  messages: number
}

/** Every read goes through here, so one place knows the token and the shape. */
export async function get<T>(path: string): Promise<T> {
  const token = stored()
  if (!token) throw new Error('signed out')
  const res = await fetch(`${API}/v1/tel${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401 || res.status === 403) throw new Error('signed out')
  if (!res.ok) throw new Error(`${path} answered ${res.status}`)
  return (await res.json()) as T
}

/** The list routes answer `{data: [...]}`; an empty account answers `{data: []}`. */
export const list = <T>(path: string) => get<{ data: T[] }>(path).then((r) => r.data ?? [])
