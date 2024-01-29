import { InvalidParamError } from '@/presentation/errors'
import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  LoadSurveyResult
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId },
        accountId
      } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId as string)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(
        surveyId as string,
        accountId as string
      )
      return ok(surveyResult)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
