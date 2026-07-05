import { getCurrentSettings, type UserSettings } from "@/services/settings"
import { createContext, useContext, useState, type ReactNode } from "react"

// TODO: not sure which is better, getSettings or setSettings
export interface GlobalDataContextI {
  getSettings: () => Promise<void>
  setSettings: (stgs: UserSettings) => void
  enabledCurrencies: string[]
  defaultCurrency: string
}

const GlobalDataContext = createContext<GlobalDataContextI | null>(null)

export function GlobalDataProvider({ children }: {children: ReactNode}) {
  const [enabledCurr, setEnabledCurr] = useState<string[]>([])
  const [defaultCurr, setDefaultCurr] = useState<string>("")

  const getSettings = async (): Promise<void> => {
    getCurrentSettings()
    .then(([currentSettings, ]) => {
      setEnabledCurr(currentSettings.enabledCurrencies)
      setDefaultCurr(currentSettings.defaultCurrency)
    })
  }

  const setSettings = (stgs: UserSettings) => {
    setEnabledCurr(stgs.enabledCurrencies)
    setDefaultCurr(stgs.defaultCurrency)
  }

  const enabledCurrencies = enabledCurr
  const defaultCurrency = defaultCurr

  return (
    <GlobalDataContext.Provider value={{getSettings, setSettings, enabledCurrencies, defaultCurrency}}>
      { children }
    </GlobalDataContext.Provider>
  )
}

export function useGlobalDataContext() {
  const context = useContext(GlobalDataContext)

  if (!context) {
    throw new Error('useGlobalDataContext must be used with a GlobalDataProvider');
  }

  return context
}