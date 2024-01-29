import type {
  LoadSurveyResultRepository,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save(
    surveyResultData: SaveSurveyResultParams
  ): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyResultData)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyResultData.surveyId,
      surveyResultData.accountId
    )
    return surveyResult as any
  }
}
