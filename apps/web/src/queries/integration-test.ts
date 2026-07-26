export const INTEGRATION_TEST_QUERY =
  '*[_type == "integrationTest"][0]{_id, message}'

export type IntegrationTest = {
  _id: string
  message: string
}
