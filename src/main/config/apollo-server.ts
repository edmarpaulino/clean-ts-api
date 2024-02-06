import { authDirectiveTransformer } from '@/main/graphql/directives'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import type { GraphQLError } from 'graphql'

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(
    (name) => name === errorName
  )
}

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error) => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

export default (app: any): void => {
  const schema = makeExecutableSchema({
    resolvers,
    typeDefs
  })
  const server = new ApolloServer({
    schema: authDirectiveTransformer(schema),
    context: ({ req }) => ({ req }),
    plugins: [
      {
        requestDidStart: async (): Promise<any> => ({
          willSendResponse: ({ response, errors }) => {
            handleErrors(response, errors as GraphQLError[])
          }
        })
      }
    ]
  })
  void server.start().then(() => {
    server.applyMiddleware({ app })
  })
}
