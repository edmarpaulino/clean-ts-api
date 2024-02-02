import type {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import type { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      data.email
    )
    let isAccountAdded: boolean = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(data.password)
      isAccountAdded = await this.addAccountRepository.add({
        ...data,
        password: hashedPassword
      })
    }
    return isAccountAdded
  }
}
