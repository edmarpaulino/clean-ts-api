import type { AccountModel } from '@/domain/models'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import type { Collection } from 'mongodb'

describe('SurveyMongoRepository', () => {
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany()
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany()
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const { insertedId } = await accountCollection.insertOne(
      mockAddAccountParams()
    )
    const account = await accountCollection.findOne({ _id: insertedId })
    return account && MongoHelper.map(account)
  }

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const account = await makeAccount()
      const addSurveyParamsArray = [
        mockAddSurveyParams(),
        mockAddSurveyParams()
      ]
      const { insertedIds } =
        await surveyCollection.insertMany(addSurveyParamsArray)
      await surveyResultCollection.insertOne({
        surveyId: insertedIds[0],
        accountId: MongoHelper.generateObjectId(account.id),
        answer: addSurveyParamsArray[0].answers[0],
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyParamsArray[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveyParamsArray[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const account = await makeAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load a survey on success', async () => {
      const addSurveyParams = mockAddSurveyParams()
      const { insertedId } = await surveyCollection.insertOne(addSurveyParams)
      const sut = makeSut()
      const survey = await sut.loadById(insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
      expect(survey?.question).toBe(addSurveyParams.question)
    })
  })
})
