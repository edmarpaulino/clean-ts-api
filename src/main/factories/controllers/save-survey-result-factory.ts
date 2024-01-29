import { makeLogControllerDecorator } from '@/main/factories/decorators'
import {
  makeDbLoadSurveyById,
  makeDbSaveSurveyResult
} from '@/main/factories/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
