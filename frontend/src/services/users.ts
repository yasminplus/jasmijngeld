import { z } from "zod"

const BE_BASE_URL = 'http://localhost:8007'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

interface Token {
  access: string;
  refresh: string;
}

export async function login(credentials: z.infer<typeof formSchema>): Promise<Token> {
    console.log(credentials)
    return fetch(BE_BASE_URL + "/api/auth/token/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(response => {
      if (response.status == 401) {
        // throw error here
        throw new Error(`${response.status}`);
      } else {
        return response.json()
      }
    })
    .then(data => {
      const token: Token = {
        access: data.access,
        refresh: data.refresh
      }
      return token
    })
    .catch(error => {
      console.log(error)
      throw error
      console.log("User not found")
    })
  }