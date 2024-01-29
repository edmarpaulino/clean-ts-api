import { MongoHelper } from '@/infra/db'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import MockDate from 'mockdate'
import type { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  const accessToken = sign({ id: insertedId }, env.jwtSecret)
  await accountCollection.updateOne(
    { _id: insertedId },
    {
      $set: { accessToken }
    }
  )
  return accessToken
}

describe('SurveyResult Routes', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany()
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany()
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  describe('PUT /survey/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const { insertedId } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer'
          }
        ],
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })

  describe('GET /survey/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403)
    })

    test('Should return 200 on load survey result with accessToken', async () => {
      const { insertedId } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer'
          }
        ],
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .get(`/api/surveys/${insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
