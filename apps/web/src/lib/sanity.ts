import {createClient} from '@sanity/client'

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET
const apiVersion = import.meta.env.SANITY_API_VERSION

if (!projectId || !dataset || !apiVersion) {
  throw new Error(
    'Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_API_VERSION environment variable.',
  )
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: 'published',
  useCdn: false,
})
