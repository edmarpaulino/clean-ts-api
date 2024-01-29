import type {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@/data/protocols'
import type { SurveyModel } from '@/domain/models'
import type { AddSurveyParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModelArray } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  public addSurveyParams: AddSurveyParams

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  public id: string
  public surveyModel: SurveyModel = mockSurveyModel()

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id
    return await Promise.resolve(this.surveyModel)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  private readonly defaultSurveyModelArray: SurveyModel[] =
    mockSurveyModelArray()

  public accountId: string
  public surveyModelArray: SurveyModel[] = this.defaultSurveyModelArray

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return await Promise.resolve(this.surveyModelArray)
  }

  reset(): void {
    this.surveyModelArray = this.defaultSurveyModelArray
  }
}
