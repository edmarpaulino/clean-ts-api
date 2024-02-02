import type {
  AddAccount,
  Authentication,
  LoadAccountByToken
} from '@/domain/usecases'
import { mockAccountModel, mockAuthenticationModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  private readonly defaultResult: AddAccount.Result = true

  public params: AddAccount.Params
  public result: AddAccount.Result = this.defaultResult

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}

export class AuthenticationSpy implements Authentication {
  private readonly defaultResult: Authentication.Result =
    mockAuthenticationModel()

  public params: Authentication.Params
  public result: Authentication.Result = this.defaultResult

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  private readonly defaultResult: LoadAccountByToken.Result = mockAccountModel()

  public accessToken: string
  public role?: string
  public result: LoadAccountByToken.Result = this.defaultResult

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}
