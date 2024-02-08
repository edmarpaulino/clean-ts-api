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

describe('SurveyResult GraphQL', () => {
  let accountCollection: Collection
  let surveyCollection: Collection
  let surveyResultCollection: Collection
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany()
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

  describe('SurveyResult Query', () => {
    const surveyResultQuery: DocumentNode = gql`
      query surveyResult($surveyId: String!) {
        surveyResult(surveyId: $surveyId) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return survey result on success', async () => {
      const accessToken = await makeAccessToken()
      apolloServer.requestOptions.context = {
        req: {
          headers: {
            'x-access-token': accessToken
          }
        }
      }
      const { insertedId } = await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: surveyResultQuery,
        variables: { surveyId: insertedId.toString() }
      })
      expect(response?.data?.surveyResult).toBeTruthy()
      expect(response?.data?.surveyResult?.question).toEqual(survey.question)
      expect(response?.data?.surveyResult?.answers).toEqual(
        survey.answers.map((item) => ({
          answer: item.answer,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }))
      )
      expect(response?.data?.surveyResult?.date).toEqual(new Date(survey.date))
    })

    test('Should return AccessDeniedError if accessToken is not provided ', async () => {
      const { insertedId } = await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: surveyResultQuery,
        variables: { surveyId: insertedId.toString() }
      })
      expect(response?.data).toBeFalsy()
      expect(response?.errors).toEqual([new AccessDeniedError()])
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult($surveyId: String!, $answer: String!) {
        saveSurveyResult(surveyId: $surveyId, answer: $answer) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    test('Should return survey result', async () => {
      const accessToken = await makeAccessToken()
      apolloServer.requestOptions.context = {
        req: {
          headers: {
            'x-access-token': accessToken
          }
        }
      }
      const { insertedId } = await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: saveSurveyResultMutation,
        variables: {
          surveyId: insertedId.toString(),
          answer: survey.answers[0].answer
        }
      })
      expect(response?.data).toBeTruthy()
      expect(response?.data?.saveSurveyResult?.question).toBe(survey.question)
      expect(response?.data?.saveSurveyResult?.answers).toEqual([
        {
          answer: survey.answers[0].answer,
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        }
      ])
    })

    test('Should return AccessDeniedError if accessToken is not provided ', async () => {
      const { insertedId } = await surveyCollection.insertOne(survey)
      const response = await apolloServer.executeOperation({
        query: saveSurveyResultMutation,
        variables: {
          surveyId: insertedId.toString(),
          answer: survey.answers[0].answer
        }
      })
      expect(response?.data).toBeFalsy()
      expect(response?.errors).toEqual([new AccessDeniedError()])
    })
  })
})
