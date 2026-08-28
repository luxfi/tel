import {
  Antenna,
  AudioLines,
  BadgeCheck,
  Bot,
  Boxes,
  Brain,
  Cable,
  Captions,
  Cpu,
  CreditCard,
  Database,
  Earth,
  Fingerprint,
  Hash,
  KeyRound,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MessageSquare,
  MessagesSquare,
  Network,
  Nfc,
  Phone,
  PhoneCall,
  RadioTower,
  Router,
  SatelliteDish,
  ScanFace,
  Search,
  Server,
  ShieldCheck,
  Ship,
  Shuffle,
  Signal,
  Smartphone,
  SquareFunction,
  Video,
  Waypoints,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import { css } from '@hanzo/ui'

import { PRIMITIVES } from '@/content/catalog'

/**
 * The mark for a product, by slug.
 *
 * Every card used to carry the same round dot, which is a bullet list wearing a
 * grid: forty identical markers say only "this is an item". A dish, a ship, a key
 * and a router say what the thing IS before the name is read.
 *
 * The map lives here rather than in `content/catalog`, because which glyph a
 * product wears is a rendering decision and the catalogue should not import an
 * icon library to hold one.
 */
const MARKS: Record<string, LucideIcon> = {
  'orbital-broadband': SatelliteDish,
  'maritime-aviation': Ship,
  'cell-backhaul': RadioTower,
  failover: Shuffle,
  'private-wireless': Wifi,

  esim: Nfc,
  'iot-sim': Cpu,
  'mobile-voice': PhoneCall,
  'direct-to-cell': Signal,

  numbers: Hash,
  'branded-calling': BadgeCheck,
  lookup: Search,

  voice: Phone,
  sip: Network,
  webrtc: Video,

  sms: MessageSquare,
  email: Mail,
  verify: ShieldCheck,
  'silent-verification': Fingerprint,

  chat: MessagesSquare,
  'voice-agents': Bot,
  transcription: Captions,
  speech: AudioLines,
  inference: Brain,
  embeddings: Boxes,
  'deepfake-detection': ScanFace,

  mesh: Waypoints,
  'post-quantum': KeyRound,
  'global-ip': Earth,
  'cloud-vpn': Lock,
  'cross-connects': Cable,

  terminals: Antenna,
  routers: Router,
  gateways: Server,

  sim: CreditCard,
  phone: Smartphone,
  os: LayoutGrid,

  functions: SquareFunction,
  storage: Database,
  state: Layers,
}

// Loud rather than approximate, the way console/suites refuses a nav entry it
// cannot find. A product with no mark would otherwise wear a generic box and
// read as finished, which is how forty pages can look right and be wrong. The
// catalog is the source of truth, so the gap fails the build instead.
const gaps = PRIMITIVES.filter((p) => !MARKS[p.slug]).map((p) => p.slug)
if (gaps.length) throw new Error(`Mark: no icon for ${gaps.join(', ')} — add one to MARKS`)

export function Mark({ slug, className = 'h-4 w-4 shrink-0 text-white/45' }: { slug: string; className?: string }) {
  // Boxes is the fallback rather than a blank: a product with no mark yet should
  // still line up with the ones that have one.
  const Icon = MARKS[slug] ?? Boxes
  return <Icon className={className} style={css(className)} aria-hidden='true' />
}
