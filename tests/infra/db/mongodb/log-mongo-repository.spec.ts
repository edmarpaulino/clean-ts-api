import { LogMongoRepository, MongoHelper } from '@/infra/db'
import { faker } from '@faker-js/faker'
import type { Collection } from 'mongodb'

const makeSut = (): LogMongoRepository => new LogMongoRepository()

describe('LogMongoRepository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError(faker.word.words())
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
