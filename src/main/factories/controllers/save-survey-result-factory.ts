import { makeLogControllerDecorator } from '@/main/factories/decorators'
import {
  makeDbLoadAnswersBySurvey,
  makeDbSaveSurveyResult
} from '@/main/factories/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
