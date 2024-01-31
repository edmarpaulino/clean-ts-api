import { LogControllerDecorator } from '@/main/decorators'
import { ok, serverError } from '@/presentation/helpers'
import type { Controller, HttpResponse } from '@/presentation/protocols'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import { mockAccountModel } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

const mockRequest = (): any => {
  const password: string = faker.internet.password()
  return {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

const mockServerError = (): HttpResponse => {
  const error = new Error()
  error.stack = faker.word.words()
  return serverError(error)
}

class ControllerSpy implements Controller {
  public request: any
  public httpResponse: HttpResponse = ok(mockAccountModel())

  async handle(request: any): Promise<HttpResponse> {
    this.request = request
    return await Promise.resolve(this.httpResponse)
  }
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerSpy.request).toEqual(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    await sut.handle(mockRequest())
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
