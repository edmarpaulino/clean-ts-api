import { adaptResolver } from '@/main/adapters'
import {
  makeAddSurveyController,
  makeLoadSurveysController
} from '@/main/factories/controllers'

export default {
  Query: {
    surveys: async (): Promise<any> => {
      return await adaptResolver(makeLoadSurveysController())
    }
  },

  Mutation: {
    addSurvey: async (_: any, args: any): Promise<any> => {
      return await adaptResolver(makeAddSurveyController(), args)
    }
  }
}
