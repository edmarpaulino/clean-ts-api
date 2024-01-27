import type { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import type { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import type { UpdateAccessTokenRepository } from '@/data/protocols/db/account/updated-access-token-repository'
import type { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import type { AddAccountParams } from '@/domain/usecases/account/add-account'

export class AddAccountRepositorySpy implements AddAccountRepository {
  public addAccountParams: AddAccountParams
  public accountModel: AccountModel = mockAccountModel()

  async add(data: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = data
    return await Promise.resolve(this.accountModel)
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  private readonly defaultAccountModel: AccountModel = mockAccountModel()

  public email: string
  public accountModel: AccountModel | null = this.defaultAccountModel

  async loadByEmail(email: string): Promise<AccountModel | null> {
    this.email = email
    return await Promise.resolve(this.accountModel)
  }

  reset(): void {
    this.accountModel = this.defaultAccountModel
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  private readonly defaultAccounModel: AccountModel = mockAccountModel()

  public token: string
  public role?: string
  public accountModel: AccountModel | null = this.defaultAccounModel

  async loadByToken(
    token: string,
    role?: string
  ): Promise<AccountModel | null> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.accountModel)
  }

  reset(): void {
    this.accountModel = this.defaultAccounModel
  }
}

export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository
{
  public id: string
  public token: string

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
