import { adaptResolver } from '@/main/adapters'
import {
  makeAddSurveyController,
  makeLoadSurveysController
} from '@/main/factories/controllers'

export default {
  Query: {
    surveys: async (_: any, args: any, context: any): Promise<any> => {
      return await adaptResolver(makeLoadSurveysController(), args, context)
    }
  },

  Mutation: {
    addSurvey: async (_: any, args: any, context: any): Promise<any> => {
      return await adaptResolver(makeAddSurveyController(), args, context)
    }
  }
}
