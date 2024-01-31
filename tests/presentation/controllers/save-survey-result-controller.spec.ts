import { SaveSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import {
  LoadSurveyByIdSpy,
  SaveSurveyResultSpy
} from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockRequest = (answer?: string): SaveSurveyResultController.Request => ({
  surveyId: faker.string.uuid(),
  answer: answer ?? faker.word.sample(),
  accountId: faker.string.uuid()
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  )
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    const { loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.reset()
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyByIdSpy.id).toBe(request.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    const answer = loadSurveyByIdSpy.result?.answers[0].answer
    const request = mockRequest(answer)
    await sut.handle(request)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(new Error())
    const answer = loadSurveyByIdSpy.result?.answers[0].answer
    const httpResponse = await sut.handle(mockRequest(answer))
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    const answer = loadSurveyByIdSpy.result?.answers[0].answer
    const httpResponse = await sut.handle(mockRequest(answer))
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})
