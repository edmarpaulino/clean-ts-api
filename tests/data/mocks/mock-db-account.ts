import type {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccountParams } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

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
