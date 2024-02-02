import type {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  private readonly defaultResult: boolean = true

  public params: AddAccountRepository.Params
  public result: AddAccountRepository.Result = this.defaultResult

  async add(
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.params = params
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  private readonly defaultResult: LoadAccountByEmailRepository.Result =
    mockAccountModel()

  public email: string
  public result: LoadAccountByEmailRepository.Result = this.defaultResult

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  private readonly defaultResult: LoadAccountByTokenRepository.Result =
    mockAccountModel()

  public token: string
  public role?: string
  public result: LoadAccountByTokenRepository.Result = this.defaultResult

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
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
