import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { ApolloServer } from 'apollo-server-express'

export default (app: any): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })
  void server.start().then(() => {
    server.applyMiddleware({ app })
  })
}
