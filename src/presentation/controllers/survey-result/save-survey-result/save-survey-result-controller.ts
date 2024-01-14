import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params?.surveyId as string)
    return null as any
  }
}
