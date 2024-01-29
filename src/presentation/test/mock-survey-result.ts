import type { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import type { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import type {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  public saveSurveyResultParams: SaveSurveyResultParams
  public surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = data
    return await Promise.resolve(this.surveyResultModel)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  public surveyId: string
  public accountId: string
  public surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResultModel)
  }
}
