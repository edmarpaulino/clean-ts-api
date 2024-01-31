import type {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  public params: SaveSurveyResultRepository.Params

  async save(params: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  private readonly defaultResult: LoadSurveyResultRepository.Result =
    mockSurveyResultModel()

  public surveyId: string
  public accountId: string
  public result: LoadSurveyResultRepository.Result = this.defaultResult

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}
