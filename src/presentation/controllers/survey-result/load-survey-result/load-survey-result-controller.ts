import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params?.surveyId as string)
    return await Promise.resolve({ statusCode: 418, body: "I'm a teapot" })
  }
}
