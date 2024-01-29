import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    sut,
    addSurveyRepositorySpy
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const addSurveyParams = mockAddSurveyParams()
    await sut.add(addSurveyParams)
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(addSurveyParams)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
