import type {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(data: AddAccount.Params): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      data.email
    )
    if (!account) {
      const hashedPassword = await this.hasher.hash(data.password)
      const newAccount = await this.addAccountRepository.add(
        Object.assign({}, data, { password: hashedPassword })
      )
      return newAccount
    }
    return null
  }
}
