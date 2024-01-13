/* eslint-disable @typescript-eslint/no-misused-promises */

import { adaptRoute } from '@/main/adapter/express/express-route-adapter'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-factory'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-factory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
