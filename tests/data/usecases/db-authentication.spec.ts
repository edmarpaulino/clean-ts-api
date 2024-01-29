import { DbAuthentication } from '@/data/usecases'
import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy
} from '@/tests/data/mocks'
import { mockAuthenticationParams } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication Usecase', () => {
  beforeEach(() => {
    const { loadAccountByEmailRepositorySpy, hashComparerSpy } = makeSut()
    loadAccountByEmailRepositorySpy.reset()
    hashComparerSpy.reset()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(
      authenticationParams.email
    )
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = null
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(hashComparerSpy.plaintext).toBe(authenticationData.password)
    expect(hashComparerSpy.digest).toBe(
      loadAccountByEmailRepositorySpy.accountModel?.password
    )
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(encrypterSpy.plaintext).toBe(
      loadAccountByEmailRepositorySpy.accountModel?.id
    )
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an authenticationModel on succees', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel?.accessToken).toBe(encrypterSpy.ciphertext)
    expect(authenticationModel?.name).toBe(
      loadAccountByEmailRepositorySpy.accountModel?.name
    )
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      loadAccountByEmailRepositorySpy,
      encrypterSpy
    } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByEmailRepositorySpy.accountModel?.id
    )
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
