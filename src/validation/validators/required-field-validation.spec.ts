import { MissingParamError } from '@/presentation/errors'
import { faker } from '@faker-js/faker'
import { RequiredFieldValidation } from './required-field-validation'

const field: string = faker.word.adjective()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ invalidField: faker.word.sample() })
    expect(error).toEqual(new MissingParamError(field))
  })

  test('Should return null if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: faker.word.sample() })
    expect(error).toBeNull()
  })
})
