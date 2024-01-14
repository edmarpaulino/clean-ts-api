import type { SaveSurveyResultRepository } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import type { SurveyResultModel } from '@/domain/models/survey-result'
import type { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(
    surveyResultData: SaveSurveyResultModel
  ): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: surveyResultData.surveyId,
        accountId: surveyResultData.accountId
      },
      {
        $set: {
          answer: surveyResultData.answer,
          date: surveyResultData.date
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return surveyResult && MongoHelper.map(surveyResult)
  }
}
