import type {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@/data/protocols'
import { mockSurveyModel, mockSurveyModelArray } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  public params: AddSurveyRepository.Params

  async add(params: AddSurveyRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  public id: string
  public result: LoadSurveyByIdRepository.Result = mockSurveyModel()

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  private readonly defaultResult: LoadSurveysRepository.Result =
    mockSurveyModelArray()

  public accountId: string
  public result: LoadSurveysRepository.Result = this.defaultResult

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}
