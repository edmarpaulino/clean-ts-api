import type { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import type { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await Promise.resolve(badRequest(new MissingParamError('email')))
      }
      if (!password) {
        return await Promise.resolve(badRequest(new MissingParamError('password')))
      }
      const isValid = this.emailValidator.isValid(email as string)
      if (!isValid) {
        return await Promise.resolve(badRequest(new InvalidParamError('email')))
      }
      await this.authentication.auth(email as string, password as string)
      return await Promise.resolve({ statusCode: 418, body: "I'm a teapot" })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
