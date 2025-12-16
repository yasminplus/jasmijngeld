import axiosInstance from "@/services/axios";
import { z } from "zod"


export interface PaymentSourceForm {
  name: string;
  source_type: 'Bank account' | 'Credit card' | 'Digital wallet' | 'Prepaid card' | 'Cash';
  acc_identifier: string | undefined;
}

export interface PaymentSource extends PaymentSourceForm {
  id: number;
}

// TODO: decide if we're going with PaymentSourceForm or the zod schema
export const sourceSchema = z.object({
  name: z.string('Please enter a name of the payment source'),
  source_type: z.enum(['Bank account', 'Cash', 'Credit card', 'Digital wallet', 'Prepaid card'], {
    error: 'Please select a type of the payment source'
  }),
  acc_identifier: z.string().optional().or(z.literal('')),
})

export const SOURCE_TYPE_CHOICES = [
  'Bank account', 'Cash', 'Credit card', 'Digital wallet', 'Prepaid card'
]

export function getPaymentSourceList(): Promise<PaymentSource[]> {
  return axiosInstance.get(`/api/sources/`)
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

export function getPaymentSource(sourceId: string): Promise<PaymentSource> {
  return axiosInstance.get(`/api/sources/${sourceId}`)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function createPaymentSource(data: z.infer<typeof sourceSchema>): Promise<PaymentSource> {
  return axiosInstance.post(`/api/sources/`, data)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function updatePaymentSource(id:number, data: z.infer<typeof sourceSchema>): Promise<PaymentSource> {
  return axiosInstance.put(`/api/sources/${id}`, data)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function deletePaymentSource(id:number): Promise<boolean> {
  return axiosInstance.delete(`/api/sources/${id}`)
    .then(response => {
      if (response['status'] == 204) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}
