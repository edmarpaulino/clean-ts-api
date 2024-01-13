import type {
  SaveSurveyResult,
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(
    surveyResultData: SaveSurveyResultModel
  ): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyResultData)
    return null as any
  }
}
