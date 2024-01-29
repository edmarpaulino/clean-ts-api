/* eslint-disable @typescript-eslint/no-misused-promises */

import { adaptRoute } from '@/main/adapters'
import {
  makeLoginController,
  makeSignUpController
} from '@/main/factories/controllers'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
