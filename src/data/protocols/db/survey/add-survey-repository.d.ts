import type { AddSurveyModel } from '@/data/usecases/add-survey/db-add-survey-protocols'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
