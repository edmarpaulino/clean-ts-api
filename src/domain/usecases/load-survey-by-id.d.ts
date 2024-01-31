import type { SurveyModel } from '@/domain/models'

export namespace LoadSurveyById {
  export type Result = SurveyModel | null
}

export interface LoadSurveyById {
  loadById: (id: string) => Promise<LoadSurveyById.Result>
}
