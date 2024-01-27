import { mockAddAccountParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { faker } from '@faker-js/faker'
import type { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'

describe('AccountMongoRepository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const account = await sut.add(addAccountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on success', async () => {
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const sut = makeSut()
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })

    test('Should return null on fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const { insertedId } = await accountCollection.insertOne(
        mockAddAccountParams()
      )
      const accountBeforeUpdate = await accountCollection.findOne({
        _id: insertedId
      })
      expect(accountBeforeUpdate?.accessToken).toBeFalsy()
      const sut = makeSut()
      const accessToken = faker.string.uuid()
      await sut.updateAccessToken(insertedId.toString(), accessToken)
      const accountAfterUpdate = await accountCollection.findOne({
        _id: insertedId
      })
      expect(accountAfterUpdate).toBeTruthy()
      expect(accountAfterUpdate?.accessToken).toBe(accessToken)
    })
  })

  describe('LoadByToken()', () => {
    let name: string
    let email: string
    let password: string
    let accessToken: string
    let role: string

    beforeEach(() => {
      name = faker.person.fullName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.string.uuid()
      role = faker.word.adjective()
    })

    test('Should return an account on success - without role', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(name)
      expect(account?.email).toBe(email)
      expect(account?.password).toBe(password)
    })

    test('Should return an account on success - with role', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken, role)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(name)
      expect(account?.email).toBe(email)
      expect(account?.password).toBe(password)
    })

    test('Should return an account on success - with admin role', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(name)
      expect(account?.email).toBe(email)
      expect(account?.password).toBe(password)
    })

    test('Should return an account on success if user is admin', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(name)
      expect(account?.email).toBe(email)
      expect(account?.password).toBe(password)
    })

    test('Should return null on fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})
