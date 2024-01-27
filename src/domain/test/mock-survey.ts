import type { SurveyModel } from '@/domain/models/survey'
import type { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { faker } from '@faker-js/faker'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.word.sample()
    }
  ],
  date: faker.date.recent()
})

export const mockSurveyModelArray = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.word.words(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.word.sample()
    },
    {
      answer: faker.word.sample()
    }
  ],
  date: faker.date.recent()
})
