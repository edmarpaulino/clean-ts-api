export const serverError = {
  description: 'Falha inesperada no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
