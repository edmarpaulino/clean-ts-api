import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]!
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
