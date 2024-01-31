import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveysRepositorySpy } from '@/tests/data/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys Usecase', () => {
  const accountId: string = faker.string.uuid()

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    const { loadSurveysRepositorySpy } = makeSut()
    loadSurveysRepositorySpy.reset()
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository with correct value', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('Should return a list of surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load(accountId)
    expect(surveys).toEqual(loadSurveysRepositorySpy.result)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load(accountId)
    await expect(promise).rejects.toThrow()
  })
})
