import type {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@/data/protocols'
import type { SurveyResultModel } from '@/domain/models'
import type {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '@/domain/usecases'

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
