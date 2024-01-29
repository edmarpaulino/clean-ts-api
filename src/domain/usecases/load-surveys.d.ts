import type { SurveyModel } from '@/domain/models'

export interface LoadSurveys {
  load: (accountId: string) => Promise<SurveyModel[]>
}
