import type { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helpers'
import type { Controller, HttpResponse } from '@/presentation/protocols'

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const surveys = await this.loadSurveys.load(accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
