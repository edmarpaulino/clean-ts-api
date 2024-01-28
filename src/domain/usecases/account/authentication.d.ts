import type { AuthenticationModel } from '@/domain/models/account'

export type AuthenticationParams = {
  email: string
  password: string
}

export interface Authentication {
  auth: (data: AuthenticationParams) => Promise<AuthenticationModel | null>
}
