import type { SurveyModel } from '@/domain/models'
import type { AddSurvey } from '@/domain/usecases'
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
  date: faker.date.recent(),
  didAnswer: true
})

export const mockSurveyModelArray = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]

export const mockAddSurveyParams = (): AddSurvey.Params => ({
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
