import type { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helpers'
import type {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      const surveys = await this.loadSurveys.load(accountId as string)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
