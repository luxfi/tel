/**
 * The people, as Lux Industries publishes them elsewhere. One roster, so the
 * telecom site and the industries site cannot disagree about who runs the company.
 */

export interface Person {
  readonly name: string
  readonly title: string
}

export const LEADERSHIP: readonly Person[] = [
  { name: 'Zach Kelling', title: 'Chief Executive Officer' },
  { name: 'Ari Lerner', title: 'Chief Technology Officer' },
  { name: 'Cyrus Pahlavi', title: 'Executive President' },
  { name: 'Vincent Butta', title: 'Chief Operations Officer' },
  { name: 'Joe Reiben', title: 'Chief Financial Officer' },
  { name: 'Christopher Dinelli', title: 'Chief Information Officer' },
  { name: 'Ryan Stobie', title: 'Chief Business Officer' },
  { name: 'Justin Gawn', title: 'Chief Strategy Officer' },
  { name: 'Skyler Trotter', title: 'Chief Innovation Officer' },
  { name: 'Antje Worring', title: 'Chief Design Officer' },
  { name: 'Jack Kochen', title: 'Chief Marketing Officer' },
  { name: 'Lori Luttrell', title: 'Chief Data Scientist' },
  { name: 'Ashley Christie', title: 'Chief of Staff' },
]

export const ENGINEERING: readonly Person[] = [
  { name: 'Ole Brereton', title: 'Executive Vice President' },
  { name: 'Jackson Mori', title: 'VP Engineering' },
  { name: 'Woo Bin', title: 'VP Engineering' },
  { name: 'Artem Ash', title: 'Lead Architect' },
  { name: 'Michael Filteau', title: 'Operations Lead' },
  { name: 'Jason Xu', title: 'Lead Mobile Engineer' },
  { name: 'Yuri Galasevich', title: 'Lead Applications Engineer' },
  { name: 'Christopher Duong', title: 'Lead Systems Engineer' },
  { name: 'Kaori Fujio', title: 'Lead Client Engineer' },
  { name: 'John Hanks', title: 'Engineering' },
]

export const ADVISORS: readonly Person[] = [
  { name: 'Lisa Gansky', title: 'Networks and market design' },
  { name: 'Dr. Marcus Weller, PhD', title: 'Finance and behavioural science' },
  { name: 'William Hadala', title: 'Infrastructure security' },
  { name: 'Cale Gibson', title: 'Finance and public policy' },
  { name: 'Giovanna Mingarelli', title: 'Technology and civic engagement' },
  { name: 'Chris Connor', title: 'Regulated operations' },
  { name: 'Grant Cairney', title: 'Compliance' },
  { name: 'Christian Cowley', title: 'Finance' },
  { name: 'Lisa Goodman', title: 'Board Director' },
  { name: 'Major Williams', title: 'Sustainability and technology' },
]
