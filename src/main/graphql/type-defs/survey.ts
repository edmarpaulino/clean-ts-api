import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  input AnswerInput {
    image: String
    answer: String!
  }

  extend type Mutation {
    addSurvey(question: String!, answers: [AnswerInput!]!): String @auth
  }

  type SurveyAnswer {
    image: String
    answer: String!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
    didAnswer: Boolean
  }
`
