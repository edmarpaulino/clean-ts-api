import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'
import { makeDbCheckSurveyById } from '../usecases/db-check-survey-by-id-factory'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeDbLoadSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
