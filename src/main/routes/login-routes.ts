/* eslint-disable @typescript-eslint/no-misused-promises */

import type { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express/express-route-adapter'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-factory'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
