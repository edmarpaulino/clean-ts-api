import type { AccountModel } from '@/domain/models'

export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = AccountModel | null
}

export interface AddAccount {
  add: (data: AddAccount.Params) => Promise<AddAccount.Result>
}
