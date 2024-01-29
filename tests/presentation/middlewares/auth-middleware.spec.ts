import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AuthMiddleware } from '@/presentation/middlewares'
import type { HttpRequest } from '@/presentation/protocols'
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'

const mockHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.string.uuid()
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('Auth Middleware', () => {
  beforeEach(() => {
    const { loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.reset()
  })

  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct values', async () => {
    const role = faker.word.adjective()
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.accessToken).toBe(
      httpRequest.headers['x-access-token']
    )
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.accountModel = null
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(
      ok({ accountId: loadAccountByTokenSpy.accountModel?.id })
    )
  })

  test('Should return 500 if LoadAccountByToken thows', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
