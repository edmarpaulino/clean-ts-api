import { LoadSurveysController } from '@/presentation/controllers'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { LoadSurveysSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockHttpRequest = (): LoadSurveysController.Request => ({
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
    const request = mockHttpRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.accountId).toBe(request.accountId)
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.result))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.result = []
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
