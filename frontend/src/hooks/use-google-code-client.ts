import * as React from 'react'

// Declare minimal types for the parts of Google Identity Services (GIS) we use.
// https://developers.google.com/identity/oauth2/web/reference/js-reference
interface CodeResponse {
  code?: string
  error?: string
  error_description?: string
}

interface CodeClientError {
  type: 'popup_failed_to_open' | 'popup_closed' | 'unknown'
  message?: string
}

interface CodeClientConfig {
  client_id: string
  scope: string
  ux_mode: 'popup' | 'redirect'
  callback: (response: CodeResponse) => void
  error_callback?: (error: CodeClientError) => void
}

export interface CodeClient {
  requestCode: () => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: CodeClientConfig) => CodeClient
        }
      }
    }
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client'
const GENERIC_ERROR = 'Google sign-in failed. Please try again.'

// Shared across components, so the script is only added once.
let gisPromise: Promise<void> | null = null

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()

  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GIS_SRC
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        // allow a retry on the next mount
        gisPromise = null
        script.remove()
        reject(new Error('Failed to load Google Identity Services'))
      }
      document.head.appendChild(script)
    })
  }
  return gisPromise
}

/*
  Loads GIS and sets up a code client (popup mode).
  Returns null until it's ready. requestCode() has to be called
  straight from a click handler, or browsers may block the popup.
*/
export function useGoogleCodeClient({ onCode, onError }: {
  onCode: (code: string) => void,
  onError: (message: string) => void,
}): CodeClient | null {
  const [client, setClient] = React.useState<CodeClient | null>(null)

  // keep the latest callbacks without re-creating the client
  const onCodeRef = React.useRef(onCode)
  const onErrorRef = React.useRef(onError)
  React.useEffect(() => {
    onCodeRef.current = onCode
    onErrorRef.current = onError
  })

  React.useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set, Google sign-in is disabled')
      return
    }

    let cancelled = false
    loadGis()
    .then(() => {
      if (cancelled || !window.google) return
      setClient(window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'openid email profile',
        ux_mode: 'popup',
        callback: (response) => {
          if (response.code) {
            onCodeRef.current(response.code)
          } else if (response.error !== 'access_denied') {
            // access_denied means the user cancelled on the consent screen
            onErrorRef.current(GENERIC_ERROR)
          }
        },
        error_callback: (error) => {
          if (error.type === 'popup_closed') return
          if (error.type === 'popup_failed_to_open') {
            onErrorRef.current("Couldn't open the Google sign-in window. Allow popups for this site and try again.")
          } else {
            onErrorRef.current(GENERIC_ERROR)
          }
        },
      }))
    })
    .catch(error => {
      console.error(error)
    })

    return () => { cancelled = true }
  }, [])

  return client
}
