import type { SurveyModel } from '@/domain/models'

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel | null
}

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<LoadSurveyByIdRepository.Result>
}
