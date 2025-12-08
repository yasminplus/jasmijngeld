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
  return localStorage.getItem(PROFILE_KEY) ?? "";
}

export function ProfileProvider({
  children
}: {children: ReactNode}) {
  const [firstName, setFirstNameState] = useState(() => readStoredFirstName())
  
  const setFirstName = useCallback((name: string | null) => {
    if (name == null || name === "") {
      localStorage.removeItem(PROFILE_KEY);
      setFirstNameState("");
    } else {
      localStorage.setItem(PROFILE_KEY, name);
      setFirstNameState(name);
    }
    // note: same-tab listener using the CustomEvent does not work.
    // instead call this function directly after editing profile.
  }, []);

  useEffect(() => {
    // handle different tab 
    function onStorage(e: StorageEvent) {
      if (!e.key || e.key === PROFILE_KEY || e.key.startsWith(base_key))
      setFirstNameState(readStoredFirstName)
    }

    // note: not sure if it's necessary. may need to test for tabs that is not updated for long (?)
    function onAuthUserChanged() {
      console.log("in onAuthUserChanged")
      setFirstNameState(readStoredFirstName());
    }
    
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:user:changed", onAuthUserChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:user:changed", onAuthUserChanged as EventListener);
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