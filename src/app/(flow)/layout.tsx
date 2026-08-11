import React, { type PropsWithChildren } from 'react'

/*
  A route group with NO site chrome.

  The questionnaire is a flow, not a page: menus, a footer and a second call to
  action are all exits from the one thing this screen is for. It keeps the wordmark
  and a way out, and nothing else.
*/
export default function FlowLayout({ children }: PropsWithChildren) {
  return <div className='min-h-screen'>{children}</div>
}
