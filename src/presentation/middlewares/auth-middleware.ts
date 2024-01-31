import type { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import type { HttpResponse, Middleware } from '@/presentation/protocols'

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        )
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return await Promise.resolve(forbidden(new AccessDeniedError()))
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
