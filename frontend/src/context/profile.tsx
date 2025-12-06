import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { base_key } from "@/context/auth"

type ProfileProviderState = {
  firstName: string
  setFirstName: (fname: string | null) => void
}

const initialState: ProfileProviderState = {
  firstName: '',
  setFirstName: () => null
}

const ProfileProviderContext = createContext<ProfileProviderState>(initialState)

const PROFILE_KEY = base_key + ".first_name";

function readStoredFirstName(): string {
  console.log("in readStoredFirstName")
  return localStorage.getItem(PROFILE_KEY) ?? "";
}

export function ProfileProvider({
  children
}: {children: ReactNode}) {
  const [firstName, setFirstNameState] = useState(() => readStoredFirstName())
  
  const setFirstName = useCallback((name: string | null) => {
    console.log("in useCallback")
    if (name == null || name === "") {
      localStorage.removeItem(PROFILE_KEY);
      setFirstNameState("");
    } else {
      localStorage.setItem(PROFILE_KEY, name);
      setFirstNameState(name);
    }
    // notify same-tab listeners
    window.dispatchEvent(new CustomEvent("profile:changed"));
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!e.key || e.key === PROFILE_KEY || e.key.startsWith(base_key))
      console.log("in onStorage")
        setFirstNameState(readStoredFirstName)
    }

    function onProfileChanged() {
      console.log("in onProfileChanged")
      setFirstNameState(readStoredFirstName)
    }

    // not sure if this event is necessary. test again.
    window.addEventListener("storage", onStorage);
    window.addEventListener("profile:changed", onProfileChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profile:changed", onProfileChanged as EventListener);
    };
  }, [firstName])


  const value = { firstName, setFirstName };

  return (
    <ProfileProviderContext.Provider value={value}>
      {children}
    </ProfileProviderContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileProviderContext)

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProviderContext');
  }

  return context
}