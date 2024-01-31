export namespace AddSurvey {
  export type Answer = {
    image?: string
    answer: string
  }

  export type Params = {
    question: string
    answers: Answer[]
    date: Date
  }
}

export interface AddSurvey {
  add: (surveyData: AddSurvey.Params) => Promise<void>
}
