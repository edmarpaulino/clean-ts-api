import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories/controllers'

export default {
  Query: {
    surveys: async (): Promise<any> =>
      await adaptResolver(makeLoadSurveysController())
  }
}
