import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const field: string = faker.word.adjective()
const fieldToCompare: string = faker.word.adjective()

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      [field]: faker.word.sample(),
      [fieldToCompare]: faker.word.sample()
    })
    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  test('Should return null if validation succeeds', () => {
    const sut = makeSut()
    const value = faker.word.sample()
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(error).toBeNull()
  })
})
