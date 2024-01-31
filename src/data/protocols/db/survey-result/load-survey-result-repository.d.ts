import type { SurveyResultModel } from '@/domain/models'

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel | null
}

export interface LoadSurveyResultRepository {
  loadBySurveyId: (
    surveyId: string,
    accountId: string
  ) => Promise<LoadSurveyResultRepository.Result>
}
