import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain/mocks'
import { EmailValidatorSpy } from '@/tests/validation/mocks'
import { EmailValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const field: string = faker.word.adjective()

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorSpy()
  const sut = new EmailValidation(field, emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  let validEmail: string
  let invalidEmail: string

  beforeEach(() => {
    const { emailValidatorStub } = makeSut()
    emailValidatorStub.reset()
    validEmail = faker.internet.email()
    invalidEmail = faker.word.sample()
  })

  test('Should return an error if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.isEmailValid = false
    const error = sut.validate(invalidEmail)
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    sut.validate({ [field]: validEmail })
    expect(emailValidatorStub.email).toBe(validEmail)
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate.bind(sut)).toThrow()
  })
})
