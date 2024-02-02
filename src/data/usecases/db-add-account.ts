import type {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  Hasher
} from '@/data/protocols'
import type { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(
      data.email
    )
    let isAccountAdded: boolean = false
    if (!hasAccount) {
      const hashedPassword = await this.hasher.hash(data.password)
      isAccountAdded = await this.addAccountRepository.add({
        ...data,
        password: hashedPassword
      })
    }
    return isAccountAdded
  }
}
