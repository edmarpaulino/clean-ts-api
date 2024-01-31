import type { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import type { Controller, HttpResponse } from '@/presentation/protocols'

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        if (!survey.answers.some((item) => item.answer === answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
