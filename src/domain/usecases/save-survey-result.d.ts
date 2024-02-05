import type { SurveyResultModel } from '@/domain/models'

export namespace SaveSurveyResult {
  export type Params = {
    surveyId: string
    accountId: string
    answer: string
    date: Date
  }

  export type Result = SurveyResultModel
}

export interface SaveSurveyResult {
  save: (
    surveyResultData: SaveSurveyResult.Params
  ) => Promise<SaveSurveyResult.Result>
}