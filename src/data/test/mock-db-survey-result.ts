import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import type { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import type { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  public saveSurveyResultParams: SaveSurveyResultParams

  async save(data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  private readonly defaultSurveyResultModel: SurveyResultModel =
    mockSurveyResultModel()

  public surveyId: string
  public accountId: string
  public surveyResultModel: SurveyResultModel | null =
    this.defaultSurveyResultModel

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResultModel)
  }

  reset(): void {
    this.surveyResultModel = this.defaultSurveyResultModel
  }
}
