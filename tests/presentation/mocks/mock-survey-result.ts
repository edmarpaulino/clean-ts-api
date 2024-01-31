import type { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  public params: SaveSurveyResult.Params
  public result: SaveSurveyResult.Result = mockSurveyResultModel()

  async save(
    params: SaveSurveyResult.Params
  ): Promise<SaveSurveyResult.Result> {
    this.params = params
    return await Promise.resolve(this.result)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  public surveyId: string
  public accountId: string
  public result: LoadSurveyResult.Result = mockSurveyResultModel()

  async load(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
