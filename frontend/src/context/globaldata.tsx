import { getCurrentSettings } from "@/services/settings"
import { createContext, useContext, useState, type ReactNode } from "react"
export interface GlobalDataContextI {
  getSettings: () => Promise<void>
  enabledCurrencies: string[]
  defaultCurrency: string
}

const GlobalDataContext = createContext<GlobalDataContextI | null>(null)

export function SettingsProvider({ children }: {children: ReactNode}) {
  const [enabledCurr, setEnabledCurr] = useState<string[]>(["IDR"])
  const [defaultCurr, setDefaultCurr] = useState<string>("IDR")

  const getSettings = async (): Promise<void> => {
    getCurrentSettings()
    .then((currentSettings) => {
      setEnabledCurr(currentSettings[0].enabledCurrencies)
      setDefaultCurr(currentSettings[0].defaultCurrency)
    })
  }

  const enabledCurrencies = enabledCurr
  const defaultCurrency = defaultCurr

  return (
    <GlobalDataContext.Provider value={{getSettings, enabledCurrencies, defaultCurrency}}>
      { children }
    </GlobalDataContext.Provider>
  )
}

export function useGlobalDataContext() {
  const context = useContext(GlobalDataContext)

  if (!context) {
    throw new Error('useGlobalDataContext must be used with an AuthProvider');
  }

  return context
}