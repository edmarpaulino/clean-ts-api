import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepository: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepository = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepository)
  return {
    sut,
    loadAnswersBySurveyRepository
  }
}

describe('DbLoadSurveyById Usecase', () => {
  let surveyId: string

  beforeEach(() => {
    surveyId = faker.string.uuid()
    const { loadAnswersBySurveyRepository } = makeSut()
    loadAnswersBySurveyRepository.reset()
  })

  test('Should call LoadAnswersBySurveyRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepository.id).toBe(surveyId)
  })

  test('Should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual(loadAnswersBySurveyRepository.result)
  })

  test('Should return an empty array if LoadAnswersBySurveyRepository returns an empty array', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    loadAnswersBySurveyRepository.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyRepository, 'loadAnswers')
      .mockRejectedValueOnce(new Error())
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
