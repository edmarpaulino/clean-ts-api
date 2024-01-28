import type { AccountModel, AuthenticationModel } from '@/domain/models/account'
import type { AddAccountParams } from '@/domain/usecases/account/add-account'
import type { AuthenticationParams } from '@/domain/usecases/account/authentication'
import { faker } from '@faker-js/faker'

export const mockAccountModel = (): AccountModel => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: faker.string.uuid(),
  name: faker.person.fullName()
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
