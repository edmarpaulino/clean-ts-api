import type { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import type { Decrypter } from '../../protocols/criptography/decrypter'
import type { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (accessToken: string): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return await Promise.resolve(null)
  }
}
