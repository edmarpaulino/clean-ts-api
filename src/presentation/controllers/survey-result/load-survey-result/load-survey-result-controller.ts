import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params?.surveyId as string
    )
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return await Promise.resolve({ statusCode: 418, body: "I'm a teapot" })
  }
}
