import type { AccountModel, AuthenticationModel } from '@/domain/models'
import type { AddAccountParams, AuthenticationParams } from '@/domain/usecases'
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
