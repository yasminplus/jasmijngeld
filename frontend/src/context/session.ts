import { createContext } from 'react';

export const SessionContext = createContext({
  first_name: "",
  last_name: "",
  access: "",
  refresh: ""
})