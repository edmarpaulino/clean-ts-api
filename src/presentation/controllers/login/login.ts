import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import type { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }
    if (!httpRequest.body.password) {
      return await Promise.resolve(badRequest(new MissingParamError('password')))
    }
    this.emailValidator.isValid(httpRequest.body.email as string)
    return await Promise.resolve({ statusCode: 418, body: "I'm a teapot" })
  }
}
