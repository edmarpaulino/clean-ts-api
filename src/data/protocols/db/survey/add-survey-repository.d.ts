import type { AddSurveyParams } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (data: AddSurveyParams) => Promise<void>
}
