import axiosInstance from "./axios";

export interface UserSettings {
  enabledCurrencies: string[]
  defaultCurrency: string
}
export async function getCurrentSettings(): Promise<UserSettings> {
  return axiosInstance.get(`/api/settings/`)
    .then(response => {
      const res = response['data']
      const current: UserSettings = {
        enabledCurrencies: [],
        defaultCurrency: ''
      }
      for (const item of res.results) {
        if (item.key == 'currency_enabled') {
          const temp = []
          for (const cur of item.value.split(',')) {
            temp.push(cur)
          }
          current.enabledCurrencies = temp
        } else if (item.key == 'currency_default') {
          current.defaultCurrency = item.value
        }
      }
      return current;
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}