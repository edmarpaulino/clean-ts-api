import type { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModelArray } from '@/domain/test'
import type {
  AddSurvey,
  AddSurveyParams
} from '@/domain/usecases/survey/add-survey'
import type { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import type { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(survey: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveyModelArray())
    }
  }
  return new LoadSurveysStub()
}
