export class QueryBuilder {
  private readonly query: object[] = []

  private addStep(step: string, data: object): this {
    this.query.push({
      [step]: data
    })
    return this
  }

  match(data: object): this {
    return this.addStep('$match', data)
  }

  group(data: object): this {
    return this.addStep('$group', data)
  }

  unwind(data: object): this {
    return this.addStep('$unwind', data)
  }

  lookup(data: object): this {
    return this.addStep('$lookup', data)
  }

  project(data: object): this {
    return this.addStep('$project', data)
  }

  sort(data: object): this {
    return this.addStep('$sort', data)
  }

  build(): object[] {
    return this.query
  }
}
