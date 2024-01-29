import { DbLoadSurveyById } from '@/data/usecases'
import type { LoadSurveyById } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
