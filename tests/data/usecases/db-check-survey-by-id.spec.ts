import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById Usecase', () => {
  let surveyId: string

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    const { checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.reset()
    surveyId = faker.string.uuid()
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest
      .spyOn(checkSurveyByIdRepositorySpy, 'checkById')
      .mockRejectedValueOnce(new Error())
    const promise = sut.checkById(surveyId)
    await expect(promise).rejects.toThrow()
  })

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const exists = await sut.checkById(surveyId)
    expect(exists).toBe(checkSurveyByIdRepositorySpy.result)
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.checkById(surveyId)
    expect(survey).toBe(checkSurveyByIdRepositorySpy.result)
  })
})
