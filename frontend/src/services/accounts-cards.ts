import axios from "axios";

export interface AccountsCards {
  id: number;
  name: string;
  source_type: string;
  acc_identifier: string | null;
}

const BE_BASE_URL = 'http://localhost:8007'

export function getAccountsCardsList(): Promise<AccountsCards[]> {
  return axios.get(`${BE_BASE_URL}/api/sources/`)
    .then(response => {
      // we may need to return the whole object wrapped with the pagination
      const res = response['data'];
      return res.results;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}