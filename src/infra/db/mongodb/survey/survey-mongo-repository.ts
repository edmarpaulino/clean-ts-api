import type {
  AddSurveyParams,
  AddSurveyRepository
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import type { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import type {
  LoadSurveysRepository,
  SurveyModel
} from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers'

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(data: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: [
                      '$$item.accountId',
                      MongoHelper.generateObjectId(accountId)
                    ]
                  }
                }
              }
            },
            1
          ]
        }
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys.map((survey) => MongoHelper.map(survey))
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({
      _id: MongoHelper.generateObjectId(id)
    })
    return survey && MongoHelper.map(survey)
  }
}
