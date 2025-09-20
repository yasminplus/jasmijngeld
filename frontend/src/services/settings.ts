import axiosInstance from "./axios";

export interface UserSettings {
  enabledCurrencies: string[]
  defaultCurrency: string
}

export interface SettingsId {
  id: number
  key: string
}

interface SettingsPayload {
  currency_enabled: object
  currency_default: object
}
export async function getCurrentSettings(): Promise<[UserSettings, SettingsId[]]> {
  return axiosInstance.get(`/api/settings/`)
    .then(response => {
      const res = response['data']
      const current: UserSettings = {
        enabledCurrencies: [],
        defaultCurrency: ''
      }
      const settingsIdList: SettingsId[] = []
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
        settingsIdList.push({
          'id': item.id,
          'key': item.key
        })
      }
      return [current, settingsIdList];
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

export async function updateSettings(currentSettings: UserSettings, settingsIdList: SettingsId[]): Promise<any> {
  const payload: SettingsPayload = {
    'currency_enabled': {},
    'currency_default': {}
  }
  payload['currency_enabled'] = {
    'value': currentSettings.enabledCurrencies.join(','),
    'id': (settingsIdList.find(s => s.key == 'currency_enabled'))?.id
  }
  payload['currency_default'] = {
    'value': currentSettings.defaultCurrency,
    'id': (settingsIdList.find(s => s.key == 'currency_default'))?.id
  }
  return axiosInstance.post(`/api/settings/update/`, payload)
    .then(response => {
      const res = response['data']
      return res
    })
    .catch(error => {
      throw error
    })
}

export async function getAllCurrencies(): Promise<string[]> {
  return axiosInstance.get(`/api/settings/currencies/`)
    .then(response => {
      const res = response['data']
      return res['currencies']
    })
    .catch(error => {
      throw error;
    })
}