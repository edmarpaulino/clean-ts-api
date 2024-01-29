import type { SurveyModel } from '@/domain/models'

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'didAnswer'>

export interface AddSurvey {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
