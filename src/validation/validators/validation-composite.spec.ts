import { InvalidParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/validation/test'
import { faker } from '@faker-js/faker'
import { ValidationComposite } from './validation-composite'

const field: string = faker.word.adjective()

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies
  }
}

describe('Validation Composite', () => {
  beforeEach(() => {
    const { validationSpies } = makeSut()
    validationSpies.forEach((validationSpy) => {
      validationSpy.reset()
    })
  })

  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[1].error = new InvalidParamError(field)
    const error = sut.validate({ [field]: faker.word.sample() })
    expect(error).toEqual(validationSpies[1].error)
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].error = new Error()
    validationSpies[1].error = new InvalidParamError(field)
    const error = sut.validate({ [field]: faker.word.sample() })
    expect(error).toEqual(validationSpies[0].error)
  })

  test('Should return null if all validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ [field]: faker.word.sample() })
    expect(error).toBeNull()
  })
})
