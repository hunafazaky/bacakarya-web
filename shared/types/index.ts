// Hand-written aliases over the generated OpenAPI types (api.d.ts).
// Keep this file thin - anything that mirrors the API contract itself
// belongs in the generated file, regenerated from api-reference/openapi.yaml
// via `npm run gen:types`, not edited by hand.
import type { components } from './api'

export type User = Omit<components['schemas']['User'], 'id'> & { id: string }
export type UserRating = components['schemas']['UserRating']
export type Work = Omit<components['schemas']['Work'], 'id'> & { id: string }
export type WorkRating = components['schemas']['WorkRating']
export type Attachment = components['schemas']['Attachment']
export type PaginationMeta = components['schemas']['PaginationMeta']

// Override with our stricter User (id required) rather than the raw
// generated one.
export type LoginResponse = Omit<components['schemas']['LoginResponse'], 'user'> & { user: User }

// The schema types `writer` as `string` (id) since it's documented as
// "id or populated object depending on the endpoint" - can't express that
// cleanly in OpenAPI. Confirmed with the backend: every endpoint this app
// actually uses (list/get works, recommendations) returns it populated.
// Use this alias wherever a Work is read from the API for display.
export type PopulatedWork = Omit<Work, 'writer'> & { writer: User }

// Generic envelope shapes, matching every response from bacakarya-api.
export interface ApiEnvelope<T> {
  data: T
  message: string | null
}
export interface ApiListEnvelope<T> {
  data: T[]
  message: string | null
  meta?: PaginationMeta
}
