import type { AddAccount, Authentication } from '@/domain/usecases'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import type {
  Controller,
  HttpResponse,
  Validation
} from '@/presentation/protocols'

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  public handle = async (
    request: SignUpController.Request
  ): Promise<HttpResponse> => {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const account = await this.addAccount.add({ name, email, password })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error: any) {
      return serverError(error as Error)
    }
  }
}
