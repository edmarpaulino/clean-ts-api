import type { AccountModel } from '@/domain/models'

export namespace LoadAccountByTokenRepository {
  export type Result = AccountModel | null
}

export interface LoadAccountByTokenRepository {
  loadByToken: (
    token: string,
    role?: string
  ) => Promise<LoadAccountByTokenRepository.Result>
}
