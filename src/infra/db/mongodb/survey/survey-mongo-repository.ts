import type {
  AddSurveyModel,
  AddSurveyRepository
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import type { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import type {
  LoadSurveysRepository,
  SurveyModel
} from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
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
