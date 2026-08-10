/**
 * The policies a communications carrier is required to publish, and a customer is
 * entitled to read before signing.
 *
 * Structured rather than pasted HTML so every policy renders identically, carries
 * its own effective date, and can be diffed when it changes. `EFFECTIVE` is one
 * date for the set: a policy whose date is older than the site it governs is the
 * usual way these go stale unnoticed.
 *
 * THESE ARE DRAFTS UNTIL COUNSEL SIGNS THEM. The structure and the commitments
 * below are ours and are accurate to how the network operates; the wording has not
 * been through outside review. `REVIEWED` gates publication — see the note in
 * LLM.md before pointing DNS at this site.
 */

export const EFFECTIVE = '2026-08-10'

/** Flipped by counsel, not by a build. */
export const REVIEWED = false

export interface Section {
  readonly heading: string
  readonly body: readonly string[]
}

export interface Policy {
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly sections: readonly Section[]
}

export const POLICIES: readonly Policy[] = [
  {
    slug: 'terms',
    title: 'Terms of Service',
    summary:
      'The agreement between Lux Industries Inc and a customer of the Lux network, covering service delivery, acceptable use, billing, liability and termination.',
    sections: [
      {
        heading: 'The agreement',
        body: [
          'These terms govern access to the Lux network and to every service delivered over it — numbering, voice, messaging, wireless, orbital connectivity, identity services, inference and edge compute. Using any of them accepts them.',
          'Lux Industries Inc is a Delaware corporation. Where a service is delivered by a Lux affiliate holding the relevant licence in a jurisdiction, that affiliate is the supplying entity and these terms apply to it.',
        ],
      },
      {
        heading: 'Service and availability',
        body: [
          'Lux commits to the availability stated in the service level agreement for each service. Where no separate agreement is in place, the published service levels apply.',
          'Planned maintenance is announced in advance through the status service. Emergency maintenance may be performed without notice where it is necessary to protect network integrity, and is disclosed afterwards.',
          'Orbital services depend on line of sight and on capacity in the serving cell. Availability commitments for orbital service are stated per site at the time of quotation and are not implied from terrestrial commitments.',
        ],
      },
      {
        heading: 'Your obligations',
        body: [
          'You are responsible for the traffic you originate and for the accuracy of the registration data you supply. Numbering, messaging and wireless services are regulated, and eligibility depends on that data being true.',
          'You will not use the network in a way prohibited by the Acceptable Use Policy, which forms part of these terms.',
          'You will keep credentials secure and will notify Lux promptly of a compromise. Usage authenticated by your credentials is billable to you.',
        ],
      },
      {
        heading: 'Emergency calling',
        body: [
          'Interconnected voice services carry emergency calling subject to the limits described in the Emergency Services notice. That notice is part of these terms and must be read before deploying voice service to end users.',
          'You are responsible for registering and maintaining an accurate service address for each device or endpoint that may place an emergency call.',
        ],
      },
      {
        heading: 'Fees and billing',
        body: [
          'Charges are those on the current rate card or in your order form. Usage-based charges are billed monthly in arrears; committed and subscription charges are billed in advance.',
          'Regulatory fees, surcharges and taxes are passed through where the law requires their collection, and are itemised.',
          'Disputed charges must be raised within sixty days of the invoice date. Undisputed amounts remain payable while a dispute is open.',
        ],
      },
      {
        heading: 'Data and confidentiality',
        body: [
          'Each party protects the other’s confidential information with at least the care it applies to its own, and uses it only to perform this agreement.',
          'Customer content transiting or stored on the network belongs to the customer. Lux processes it to deliver the service and as instructed, and does not sell it. The Privacy Policy sets out what is collected and why.',
        ],
      },
      {
        heading: 'Suspension and termination',
        body: [
          'Lux may suspend a service without notice where traffic threatens network integrity, where a regulator requires it, or where use breaches the Acceptable Use Policy in a way that causes ongoing harm. Where notice is possible, it is given.',
          'Either party may terminate for material breach that remains uncured thirty days after written notice.',
          'On termination, numbers may be ported out for a period stated in the order form. Data is retained for the period set out in the Privacy Policy and then deleted.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'Neither party excludes liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be excluded.',
          'Subject to the above, neither party is liable for indirect or consequential loss, and each party’s aggregate liability is limited to the charges paid in the twelve months preceding the claim.',
          'Service credits under a service level agreement are the exclusive remedy for a failure to meet that service level.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'Lux may change these terms on thirty days’ notice. Where a change materially reduces the service, a customer may terminate the affected service without penalty before the change takes effect.',
          'Every version is dated. The current effective date is at the head of this page.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary:
      'What Lux collects, why, where it is stored, how long it is kept, and the rights you hold over it — including the specific protections that attach to customer network information.',
    sections: [
      {
        heading: 'What this covers',
        body: [
          'This policy covers personal data Lux Industries Inc processes as a controller: account data, billing data, support correspondence and website usage.',
          'Traffic and content you send across the network is processed as a processor, on your instructions, under the terms of service and any data processing agreement in place.',
        ],
      },
      {
        heading: 'What is collected',
        body: [
          'Account and billing data: names, business addresses, contact details, payment details and the regulatory identity documents that numbering and wireless services require by law.',
          'Service data: records of connections, calls, messages and sessions — who connected to what, when, for how long, and from which network. This is required to route traffic, to bill for it and to meet retention obligations.',
          'Support and website data: correspondence with our teams, and pages visited on this site.',
        ],
      },
      {
        heading: 'Customer network information',
        body: [
          'Information about the services you buy, how you use them and how you are billed — who you called, when, from where, and on what plan — is proprietary customer network information. It is subject to specific legal protection separate from general privacy law.',
          'Lux uses it to deliver and bill the services you have bought, and to protect the network from fraud and abuse. Lux does not use it to market services outside the category you already buy, and does not disclose it to third parties for their own marketing, without your express consent.',
          'You may withhold or withdraw that consent at any time by writing to the privacy address below. Withholding it does not affect the service you receive.',
        ],
      },
      {
        heading: 'Where data is held',
        body: [
          'Media, recordings, transcripts and inference are pinned to the region where the traffic originated, and that pinning is verifiable in the console. Data does not leave a region because it was convenient to process it elsewhere.',
          'Account and billing records are held in the region of the contracting entity. Where a transfer is necessary, it is made under the safeguards the law requires.',
        ],
      },
      {
        heading: 'How long it is kept',
        body: [
          'Call and message detail records are retained for the period the law of the serving jurisdiction requires, and no longer than necessary after that.',
          'Recordings, transcripts and stored objects are retained for the period you configure. Where you set none, they are retained for ninety days.',
          'Account and billing records are retained for the period tax and telecommunications law requires, commonly seven years.',
        ],
      },
      {
        heading: 'Disclosure',
        body: [
          'Lux discloses personal data to service providers acting on our instructions, to regulators where a licence requires it, and in response to valid legal process as described in the Law Enforcement policy.',
          'Lux does not sell personal data.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Subject to jurisdiction, you may request access to your personal data, correction of it, deletion of it, a copy in portable form, and restriction of or objection to processing.',
          'Requests go to the privacy address below and are answered within the statutory period. Identity is verified before a request is actioned, because answering an impersonated request is itself a breach.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'Data is encrypted in transit and at rest. Access is role-based, logged, and reviewed. Incidents affecting personal data are notified to affected customers and to regulators within the periods the law requires.',
        ],
      },
    ],
  },
  {
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    summary:
      'What may not be sent across the Lux network. It exists because a carrier that tolerates abusive traffic degrades service for every other customer on it.',
    sections: [
      {
        heading: 'Prohibited traffic',
        body: [
          'Unlawful content, and traffic that infringes another party’s rights.',
          'Unsolicited bulk messaging or calling, including traffic to recipients who have not consented or who have withdrawn consent.',
          'Traffic designed to deceive a recipient about its origin, including spoofed calling identity, impersonation of a person or organisation, and synthetic voice presented as a real identified person without disclosure.',
          'Artificially inflated traffic, wangiri and revenue-share fraud schemes.',
          'Scanning, denial of service, unauthorised access attempts, and traffic intended to degrade another network.',
        ],
      },
      {
        heading: 'Registration and consent',
        body: [
          'Messaging campaigns must be registered before sending, with accurate identity and use-case data. Lux enforces registration at the point a message is submitted; unregistered traffic is refused rather than delivered and charged.',
          'You must hold and be able to evidence recipient consent for the traffic you originate, and must honour opt-outs immediately and permanently.',
        ],
      },
      {
        heading: 'Automated and synthetic voice',
        body: [
          'Automated calling must comply with the disclosure and time-of-day rules of the destination jurisdiction.',
          'Where a synthetic voice speaks to a person, the fact that they are speaking with an automated system must be disclosed at the start of the call unless the law of that jurisdiction provides otherwise.',
          'Voices cloned from a person require that person’s documented consent. Lux records consent alongside a custom voice and may require it to be produced.',
        ],
      },
      {
        heading: 'Enforcement',
        body: [
          'Lux investigates reports sent to the abuse address, and may throttle, suspend or terminate traffic that breaches this policy.',
          'Where abuse is causing active harm to the network or to recipients, action is taken first and explained afterwards.',
          'Repeat or wilful breach ends the account and may be reported to the relevant regulator.',
        ],
      },
    ],
  },
  {
    slug: 'law-enforcement',
    title: 'Law Enforcement',
    summary:
      'How Lux responds to legal process: what we require, what we hold, what we disclose, and what we tell the customer.',
    sections: [
      {
        heading: 'Valid process required',
        body: [
          'Lux discloses customer data only in response to legal process that is valid in a jurisdiction where Lux or the relevant affiliate is subject to it. Informal requests are declined.',
          'The type of process required depends on what is sought: subscriber identity, transactional records and content each carry a different standard, and the higher standard is required for content in every jurisdiction where we operate.',
        ],
      },
      {
        heading: 'What is held',
        body: [
          'Lux holds subscriber and billing records, and connection and call detail records for the retention periods in the Privacy Policy.',
          'Lux does not hold the content of communications except where a customer has configured recording or storage, in which case that content sits in the customer’s own retention policy and region.',
        ],
      },
      {
        heading: 'Customer notice',
        body: [
          'Lux notifies the affected customer of a request for their data before disclosing it, so that the customer may object, unless notice is prohibited by law or by a court order, or where there is a risk to life.',
          'Where notice is prohibited for a period, Lux notifies the customer when that prohibition expires.',
        ],
      },
      {
        heading: 'Emergency requests',
        body: [
          'Where a request asserts an imminent risk of death or serious injury, Lux may disclose the minimum data necessary to address that risk, and requires the requesting agency to provide the assertion in writing.',
        ],
      },
      {
        heading: 'Transparency',
        body: [
          'Lux publishes the number of requests received, the number complied with in whole or in part, and the number refused, aggregated by jurisdiction and by request type.',
        ],
      },
      {
        heading: 'How to serve',
        body: [
          'Legal process is served on the address published below. Requests must identify the account or number precisely, state the legal authority relied on, and name a return contact.',
        ],
      },
    ],
  },
  {
    slug: 'emergency-services',
    title: 'Emergency Services',
    summary:
      'How emergency calling works on interconnected voice service, and — importantly — the circumstances in which it will not work. Read this before deploying voice to end users.',
    sections: [
      {
        heading: 'How it works',
        body: [
          'Emergency calls from interconnected voice service are routed to the emergency answering point serving the registered service address of the calling endpoint.',
          'The registered address, not the physical location of the device, determines where the call is routed and what address is presented to the responder.',
        ],
      },
      {
        heading: 'Registering an address',
        body: [
          'You must register a valid service address for every endpoint before it is used, and update it whenever an endpoint moves. Addresses are registered through the API or the console and take effect on validation.',
          'An endpoint with no validated address may be blocked from placing calls, because a call that cannot be routed to a responder is worse than a call that fails immediately.',
        ],
      },
      {
        heading: 'Limitations you must disclose to your users',
        body: [
          'Emergency calling does not function during a power failure at the customer premises, or during loss of internet or network connectivity, unless a failover path is configured and available.',
          'If an endpoint is used at a location other than its registered address, the call is routed to the registered address and responders may be dispatched to the wrong place.',
          'Emergency calling may be unavailable during network maintenance or outage.',
          'Some jurisdictions do not support emergency calling from interconnected voice service at all. Coverage is stated per country in the documentation.',
        ],
      },
      {
        heading: 'Your obligation',
        body: [
          'You must advise your end users of these limitations, obtain their acknowledgement, and place warning labels on equipment where the applicable regulator requires it.',
        ],
      },
    ],
  },
  {
    slug: 'trust',
    title: 'Trust Center',
    summary:
      'The controls Lux operates against, how they are audited, and how to reach the security team.',
    sections: [
      {
        heading: 'Programme',
        body: [
          'Lux operates an information security programme covering the network, the control plane and the facilities, with annual independent assessment and continuous internal control monitoring.',
          'Certification and attestation reports are available to customers and prospective customers under NDA, on request to the security team.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'Traffic is carried on the Lux backbone rather than the public internet wherever both endpoints are on the network, including orbital sites, which join the backbone at the ground station.',
          'Media, storage and inference are pinned per region. The region is recorded with the data and is verifiable in the console.',
          'Access to production is role-based, time-bound and logged. Privileged actions are individually attributable.',
        ],
      },
      {
        heading: 'Vulnerability reporting',
        body: [
          'Report a vulnerability to the security address below. Lux acknowledges within one business day, provides an assessment within five, and does not pursue researchers who act in good faith and within the scope published in the security policy.',
        ],
      },
      {
        heading: 'Incidents',
        body: [
          'Security incidents affecting customer data are notified to affected customers without undue delay and within the periods the applicable law requires, with the facts known at the time and updates as the investigation proceeds.',
        ],
      },
    ],
  },
]

export function policy(slug: string) {
  return POLICIES.find((p) => p.slug === slug)
}
