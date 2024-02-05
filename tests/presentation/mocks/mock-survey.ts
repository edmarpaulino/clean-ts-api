import type {
  AddSurvey,
  CheckSurveyById,
  LoadSurveyById,
  LoadSurveys
} from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModelArray } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  private readonly defaultCallsCount: number = 0

  public callsCount: number = this.defaultCallsCount
  public params: AddSurvey.Params

  async add(params: AddSurvey.Params): Promise<void> {
    this.params = params
  }

  reset(): void {
    this.callsCount = this.defaultCallsCount
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  private readonly defaultResult: LoadSurveyById.Result = mockSurveyModel()

  public id: string
  public result: LoadSurveyById.Result = this.defaultResult

  async loadById(id: string): Promise<LoadSurveyById.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  private readonly defaultResult: CheckSurveyById.Result = true

  public id: string
  public result: CheckSurveyById.Result = this.defaultResult

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  private readonly defaultResult: LoadSurveys.Result = mockSurveyModelArray()

  public accountId: string
  public result: LoadSurveys.Result = this.defaultResult

  async load(accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }

  reset(): void {
    this.result = this.defaultResult
  }
}
