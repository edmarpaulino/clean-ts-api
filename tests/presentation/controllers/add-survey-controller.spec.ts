import { AddSurveyController } from '@/presentation/controllers'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import type { HttpRequest } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'
import { AddSurveySpy } from '@/tests/presentation/mocks'
import { ValidationSpy } from '@/tests/validation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockHttpRequest = (): HttpRequest => ({
  body: {
    question: faker.word.words(),
    answers: [
      {
        image: faker.image.url(),
        answer: faker.word.adjective()
      }
    ]
  }
})

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    const { validationSpy, addSurveySpy } = makeSut()
    validationSpy.reset()
    addSurveySpy.reset()
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(addSurveySpy.addSurveyParams).toEqual({
      question: httpRequest.body.question,
      answers: httpRequest.body.answers,
      date: new Date()
    })
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
