import type { AccountModel } from '@/domain/models'

export namespace LoadAccountByEmailRepository {
  export type Result = AccountModel | null
}

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<LoadAccountByEmailRepository.Result>
}
