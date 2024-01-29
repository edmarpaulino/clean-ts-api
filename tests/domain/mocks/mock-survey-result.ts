import type { SurveyResultModel } from '@/domain/models'
import type { SaveSurveyResultParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      answer: faker.word.sample(),
      count: faker.number.float({ min: 0, max: 1000 }),
      percent: faker.number.float({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean()
    },
    {
      image: faker.image.url(),
      answer: faker.word.sample(),
      count: faker.number.float({ min: 0, max: 1000 }),
      percent: faker.number.float({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean()
    }
  ],
  date: faker.date.recent()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: faker.string.uuid(),
  accountId: faker.string.uuid(),
  answer: faker.word.sample(),
  date: faker.date.recent()
})
