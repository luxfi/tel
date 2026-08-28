import React, { type PropsWithChildren } from 'react'
import { Box } from '@hanzo/ui'

/*
  A route group with NO site chrome.

  The questionnaire is a flow, not a page: menus, a footer and a second call to
  action are all exits from the one thing this screen is for. It keeps the wordmark
  and a way out, and nothing else.
*/
export default function FlowLayout({ children }: PropsWithChildren) {
  return <Box className='min-h-screen'>{children}</Box>
}
