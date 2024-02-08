import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'
import { AccessDeniedError } from '@/presentation/errors'
import { faker } from '@faker-js/faker'
import { gql, type ApolloServer } from 'apollo-server-express'
import type { DocumentNode } from 'graphql'
import { sign } from 'jsonwebtoken'
import type { Collection } from 'mongodb'
import { makeApolloServer } from './helpers'

type Answer = {
  image?: string
  answer: string
}

type Survey = {
  question: string
  answers: Answer[]
  date: Date | string
}

describe('Survey GraphQL', () => {
  let accountCollection: Collection
  let surveyCollection: Collection
  let apolloServer: ApolloServer
  let survey: Survey

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
    survey = {
      question: faker.word.words(),
      answers: [
        {
          image: faker.image.url(),
          answer: faker.word.adjective()
        }
      ],
      date: faker.date.recent().toISOString()
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
      await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: surveysQuery
      })
      expect(response?.data?.surveys?.length).toBe(1)
      expect(response?.data?.surveys?.[0].id).toBeTruthy()
      expect(response?.data?.surveys?.[0].question).toBe(survey.question)
      expect(response?.data?.surveys?.[0].answers).toEqual(survey.answers)
      expect(response?.data?.surveys?.[0].didAnswer).toBe(false)
    })

    test('Should return AccessDeniedError if accessToken is not provided ', async () => {
      await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: surveysQuery
      })
      expect(response?.data).toBeFalsy()
      expect(response?.errors).toEqual([new AccessDeniedError()])
    })
  })

  describe('AddSurvey Mutation', () => {
    const addSurveyMutation: DocumentNode = gql`
      mutation addSurvey($question: String!, $answers: [AnswerInput!]!) {
        addSurvey(question: $question, answers: $answers)
      }
    `

    test('Should add survey', async () => {
      const accessToken = await makeAccessToken()
      apolloServer.requestOptions.context = {
        req: {
          headers: {
            'x-access-token': accessToken
          }
        }
      }
      const question: string = faker.word.words()
      const answers = [
        {
          answer: faker.word.adjective()
        },
        { answer: faker.word.adjective() }
      ]
      const response = await apolloServer.executeOperation({
        query: addSurveyMutation,
        variables: {
          question,
          answers
        }
      })
      expect(response?.data?.addSurvey).toBeNull()
      expect(response?.errors).toBeFalsy()
    })

    test('Should return AccessDeniedError if accessToken is not provided ', async () => {
      const question: string = faker.word.words()
      const answers = [
        {
          answer: faker.word.adjective()
        },
        { answer: faker.word.adjective() }
      ]
      const response = await apolloServer.executeOperation({
        query: addSurveyMutation,
        variables: {
          question,
          answers
        }
      })
      expect(response?.data?.addSurvey).toBeNull()
      expect(response?.errors).toEqual([new AccessDeniedError()])
    })
  })
})
