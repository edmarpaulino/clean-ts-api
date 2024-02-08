import { authDirectiveTransformer } from '@/main/graphql/directives'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'

export const makeApolloServer = (): ApolloServer => {
  const schema = makeExecutableSchema({
    resolvers,
    typeDefs
  })

  return new ApolloServer({
    schema: authDirectiveTransformer(schema)
  })
}
