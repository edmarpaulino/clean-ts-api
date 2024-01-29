import { LoadSurveysController } from '@/presentation/controllers'
import { noContent, ok, serverError } from '@/presentation/helpers'
import type { HttpRequest } from '@/presentation/protocols'
import { LoadSurveysSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockHttpRequest = (): HttpRequest => ({
  accountId: faker.string.uuid()
})

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    const { loadSurveysSpy } = makeSut()
    loadSurveysSpy.reset()
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId)
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModelArray))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveyModelArray = []
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
