import { MongoHelper } from '@/infra/db'
import { UnauthorizedError } from '@/presentation/errors'
import { faker } from '@faker-js/faker'
import { gql, type ApolloServer } from 'apollo-server-express'
import { hash } from 'bcrypt'
import type { DocumentNode } from 'graphql'
import type { Collection } from 'mongodb'
import { makeApolloServer } from './helpers'

describe('Login GraphQL', () => {
  let accountCollection: Collection
  let apolloServer: ApolloServer
  let name: string
  let email: string
  let password: string

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
    apolloServer = makeApolloServer()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany()
    name = faker.person.fullName()
    email = faker.internet.email()
    password = faker.internet.password()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Login Query', () => {
    const loginQuery: DocumentNode = gql`
      query LoginQuery($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          name
        }
      }
    `

    test('Should return an Account on valid credentials', async () => {
      const salt: number = 12
      const hashedPassword: string = await hash(password, salt)
      await accountCollection.insertOne({
        name,
        email,
        password: hashedPassword
      })
      const response = await apolloServer.executeOperation({
        query: loginQuery,
        variables: { email, password }
      })
      expect(response).toBeTruthy()
      expect(response?.data?.login?.name).toBe(name)
      expect(response?.data?.login?.accessToken).toBeTruthy()
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const response = await apolloServer.executeOperation({
        query: loginQuery,
        variables: { email, password }
      })
      expect(response).toBeTruthy()
      expect(response?.data).toBeFalsy()
      expect(response?.errors?.[0]).toEqual(new UnauthorizedError())
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation: DocumentNode = gql`
      mutation signUpMutation(
        $name: String!
        $email: String!
        $password: String!
        $passwordConfirmation: String!
      ) {
        signUp(
          name: $name
          email: $email
          password: $password
          passwordConfirmation: $passwordConfirmation
        ) {
          accessToken
          name
        }
      }
    `

    test('Should return an Account on valid data', async () => {
      const response = await apolloServer.executeOperation({
        query: signUpMutation,
        variables: { name, email, password, passwordConfirmation: password }
      })
      expect(response).toBeTruthy()
      expect(response?.data?.signUp?.name).toBe(name)
      expect(response?.data?.signUp?.accessToken).toBeTruthy()
    })
  })
})
