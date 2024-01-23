import type { SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import type { SurveyResultModel } from '@/domain/models/survey-result'
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(
    surveyResultData: SaveSurveyResultParams
  ): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: MongoHelper.generateObjectId(surveyResultData.surveyId),
        accountId: MongoHelper.generateObjectId(surveyResultData.accountId)
      },
      {
        $set: {
          answer: surveyResultData.answer,
          date: surveyResultData.date
        }
      },
      {
        upsert: true
      }
    )
    return await this.loadBySurveyId(surveyResultData.surveyId)
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({
        surveyId: MongoHelper.generateObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$_id.answer'
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: ['$count', '$_id.total']
            },
            100
          ]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const aggCursor = surveyResultCollection.aggregate(query)
    const [surveyResult] = await aggCursor.toArray()
    return surveyResult as SurveyResultModel
  }
}
