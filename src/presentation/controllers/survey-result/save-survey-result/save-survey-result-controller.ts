import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId as string
      )
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return null as any
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
