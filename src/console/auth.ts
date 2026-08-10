/**
 * Sign-in for the console, through lux.id.
 *
 * Lux IAM is the one identity system. This holds no password field and no user
 * record — it starts an OIDC authorization-code flow with PKCE at lux.id and
 * exchanges the code for a token. Everything about who someone is comes back from
 * there.
 *
 * Paths are the ones IAM actually serves, under `/v1/iam/oauth/*`. A bare
 * `/oauth/authorize` answers 200 with the portal's own SPA shell rather than 404,
 * so getting this wrong looks like a broken page instead of a wrong address.
 *
 * PKCE is not optional: the console is a static export with no server, so it is a
 * public client and holds no secret. The verifier lives in localStorage rather
 * than sessionStorage because the flow is a full-page redirect away and back.
 */

export const ISSUER = 'https://lux.id'
export const CLIENT_ID = 'lux-tel'

const VERIFIER = 'lux_tel_pkce_verifier'
const STATE = 'lux_tel_state'
const TOKEN = 'lux_tel_token'

/**
 * Where lux.id returns to. Derived from the ORIGIN the browser is on, never a
 * constant, because this bundle serves two hosts: lux.tel/console for someone who
 * walked in from the marketing site, and console.lux.tel for someone who came
 * straight to the console. A hardcoded callback would send half of them to the
 * other host mid-flow, and IAM validates the redirect_uri EXACTLY — a mismatch is
 * an error page, not a redirect.
 *
 * Both spellings are registered on the `lux-tel` application. An unregistered one
 * fails at authorize, before anybody types anything.
 */
function redirectUri(): string {
  return onConsoleHost() ? `${window.location.origin}/callback` : `${window.location.origin}/console/callback`
}

/** True on console.lux.tel, where the console IS the site rather than a section. */
export function onConsoleHost(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.startsWith('console.')
}

function random(bytes = 32): string {
  const a = new Uint8Array(bytes)
  crypto.getRandomValues(a)
  return btoa(String.fromCharCode(...a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function challenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/** Send the browser to lux.id. Returns nothing — the page navigates away. */
export async function signIn(): Promise<void> {
  const verifier = random()
  const state = random(16)
  localStorage.setItem(VERIFIER, verifier)
  localStorage.setItem(STATE, state)

  const q = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: redirectUri(),
    scope: 'openid profile email',
    state,
    code_challenge: await challenge(verifier),
    code_challenge_method: 'S256',
  })
  window.location.href = `${ISSUER}/v1/iam/oauth/authorize?${q}`
}

export interface Session {
  readonly token: string
  readonly name?: string
  readonly email?: string
}

/**
 * Finish the flow. The state must match the one we stored — an authorization code
 * arriving with a state we never issued is not our flow, and spending it would be
 * the standard way to have a session fixed on you.
 */
export async function complete(search: string): Promise<Session> {
  const p = new URLSearchParams(search)
  const error = p.get('error')
  if (error) throw new Error(p.get('error_description') || error)

  const code = p.get('code')
  const state = p.get('state')
  const expected = localStorage.getItem(STATE)
  const verifier = localStorage.getItem(VERIFIER)
  if (!code) throw new Error('No authorization code came back.')
  if (!state || state !== expected) throw new Error('The sign-in state did not match. Start again.')
  if (!verifier) throw new Error('This browser did not start the sign-in. Start again.')

  const res = await fetch(`${ISSUER}/v1/iam/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  })
  if (!res.ok) throw new Error(`The token exchange failed (${res.status}).`)
  const body = (await res.json()) as { access_token?: string; error_description?: string }
  if (!body.access_token) throw new Error(body.error_description || 'No token came back.')

  localStorage.removeItem(VERIFIER)
  localStorage.removeItem(STATE)
  localStorage.setItem(TOKEN, body.access_token)
  return { token: body.access_token, ...(await who(body.access_token)) }
}

/** Ask IAM who the token belongs to, rather than decoding it here and trusting it. */
async function who(token: string): Promise<{ name?: string; email?: string }> {
  try {
    const res = await fetch(`${ISSUER}/v1/iam/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return {}
    const u = (await res.json()) as { name?: string; preferred_username?: string; email?: string }
    return { name: u.name || u.preferred_username, email: u.email }
  } catch {
    return {}
  }
}

export function stored(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN)
}

export function signOut(): void {
  localStorage.removeItem(TOKEN)
  window.location.href = onConsoleHost() ? '/' : '/console'
}
