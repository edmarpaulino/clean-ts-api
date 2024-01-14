import type { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import type { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import type { UpdateAccessTokenRepository } from '@/data/protocols/db/account/updated-access-token-repository'
import type { AccountModel } from '@/domain/models/account'
import type { AddAccountModel } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const account = { _id: insertedId.toString(), ...accountData }
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
