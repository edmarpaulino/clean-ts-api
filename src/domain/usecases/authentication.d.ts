import type { AuthenticationModel } from '@/domain/models'

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }

  export type Result = AuthenticationModel | null
}

export interface Authentication {
  auth: (data: Authentication.Params) => Promise<Authentication.Result>
}
