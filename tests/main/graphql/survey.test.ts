import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'
import { faker } from '@faker-js/faker'
import { gql, type ApolloServer } from 'apollo-server-express'
import type { DocumentNode } from 'graphql'
import { sign } from 'jsonwebtoken'
import type { Collection } from 'mongodb'
import { makeApolloServer } from './helpers'

describe('Survey GraphQL', () => {
  let accountCollection: Collection
  let surveyCollection: Collection
  let apolloServer: ApolloServer

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
    apolloServer = makeApolloServer()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany()
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany()
    apolloServer.requestOptions.context = {
      req: {
        headers: {}
      }
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeAccessToken = async (): Promise<string> => {
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      role: 'admin'
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

  describe('Surveys Query', () => {
    const surveysQuery: DocumentNode = gql`
      query surveys {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `

    test('Should return surveys', async () => {
      const accessToken = await makeAccessToken()
      apolloServer.requestOptions.context = {
        req: {
          headers: {
            'x-access-token': accessToken
          }
        }
      }
      const survey = {
        question: faker.word.words(),
        answers: [
          {
            image: faker.image.url(),
            answer: faker.word.adjective()
          },
          {
            answer: faker.word.adjective()
          }
        ],
        date: faker.date.recent().toISOString()
      }
      await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: surveysQuery
      })
      expect(response?.data?.surveys?.length).toBe(1)
      expect(response?.data?.surveys?.[0].id).toBeTruthy()
      expect(response?.data?.surveys?.[0].question).toBe(survey.question)
      expect(response?.data?.surveys?.[0].answers).toEqual(
        survey.answers.map((item) => ({ ...item, image: item.image ?? null }))
      )
      expect(response?.data?.surveys?.[0].didAnswer).toBe(false)
    })
  })
})
