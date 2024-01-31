import type { AccountModel } from '@/domain/models'

export namespace LoadAccountByToken {
  export type Result = AccountModel | null
}

export interface LoadAccountByToken {
  load: (
    accessToken: string,
    role?: string
  ) => Promise<LoadAccountByToken.Result>
}
