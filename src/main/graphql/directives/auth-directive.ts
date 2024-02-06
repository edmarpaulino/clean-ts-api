/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { makeAuthMiddleware } from '@/main/factories/middlewares'
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils'
import { ForbiddenError } from 'apollo-server-express'
import type { GraphQLFieldConfig, GraphQLSchema } from 'graphql'

export const authDirectiveTransformer = (
  schema: GraphQLSchema
): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.FIELD]: (fieldConfig: GraphQLFieldConfig<any, any>): any => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')
      if (authDirective) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            accessToken: context?.req?.headers?.['x-access-token']
          }
          const httpResponse = await makeAuthMiddleware().handle(request)
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body)
            return resolve?.call(this, parent, args, context, info)
          } else {
            throw new ForbiddenError(httpResponse.body.message as string)
          }
        }
      }
      return fieldConfig
    }
  })
}
