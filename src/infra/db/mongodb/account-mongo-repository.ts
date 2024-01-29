import type {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccountParams } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(data: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(data)
    const account = { _id: insertedId.toString(), ...data }
    return MongoHelper.map(account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: MongoHelper.generateObjectId(id) },
      { $set: { accessToken: token } }
    )
  }

  async loadByToken(
    token: string,
    role?: string
  ): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role
        },
        {
          role: 'admin'
        }
      ]
    })
    return account && MongoHelper.map(account)
  }
}
