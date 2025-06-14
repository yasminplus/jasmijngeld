import axios from "axios";

export interface AccountsCards {
  id: number;
  name: string;
  source_type: 'Bank account' | 'Credit card' | 'Digital wallet' | 'Prepaid card' | 'Cash';
  acc_identifier: string | undefined;
}

export const SOURCE_TYPE_CHOICES = [
  'Bank account', 'Credit card', 'Digital wallet', 'Prepaid card', 'Cash'
]

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

export function getAccountCard(sourceId: string): Promise<AccountsCards> {
  return axios.get(`${BE_BASE_URL}/api/sources/${sourceId}`)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}