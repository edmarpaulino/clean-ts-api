import type { AccountModel, AuthenticationModel } from '@/domain/models'
import type { AddAccount, Authentication } from '@/domain/usecases'
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

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
