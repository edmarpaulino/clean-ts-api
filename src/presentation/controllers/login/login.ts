import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import type { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
    return await Promise.resolve({ statusCode: 418, body: "I'm a teapot" })
  }
}
