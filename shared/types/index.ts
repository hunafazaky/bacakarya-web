// Hand-written aliases over the generated OpenAPI types (api.d.ts).
// Keep this file thin - anything that mirrors the API contract itself
// belongs in the generated file, regenerated from api-reference/openapi.yaml
// via `npm run gen:types`, not edited by hand.
import type { components } from './api'

// The generated types mark nearly every property optional, since the
// OpenAPI schemas don't list a `required` array for User/Work at all (only
// their *Create*Request/Form variants do). In practice every field below is
// always present on a persisted document - redeclare them as required here
// once, rather than scattering `?.`/`!` through every page.
//
// work_list/read_list/like_list: bacakarya-api populates these as full
// Work objects on every user-fetching endpoint this app uses (GET /users,
// GET /users/{id}, PUT /users/{id}, POST /users/login) - see the
// `UserWithWorks` / `UserDetail` schemas in openapi.yaml. (The spec used
// to document them as plain id strings; that was corrected 2026-09-28.)
// The spec models the raw (ids) and populated variants as separate
// schemas; this alias intentionally collapses to the populated one, since
// that's what the app actually receives.
export type User = Omit<
  components['schemas']['User'],
  | 'id'
  | 'username'
  | 'pen_name'
  | 'work_list'
  | 'read_list'
  | 'like_list'
  | 'rate_list'
> & {
  id: string
  username: string
  pen_name: string
  work_list: Work[]
  read_list: Work[]
  like_list: Work[]
  rate_list: components['schemas']['UserRating'][]
}
export type UserRating = components['schemas']['UserRating']
// readers/like_by: populated as full User objects by GET /works,
// GET /works/{id}, GET /recommendations/{id} and the like/unlike/read
// endpoints (the `PopulatedWork` schema). POST/PUT /works return the raw
// `Work` (ids) instead - the app doesn't rely on those responses' shape.
// Don't use like_by for "did I like this" via ids - it's User objects; use
// auth.user.like_list.some(w => w.id === workId).
export type Work = Omit<
  components['schemas']['Work'],
  | 'id'
  | 'title'
  | 'text'
  | 'cover'
  | 'category'
  | 'readers'
  | 'like_by'
  | 'rate_by'
  | 'writer'
> & {
  id: string
  title: string
  text: string
  cover: string
  category: string[]
  readers: User[]
  like_by: User[]
  rate_by: components['schemas']['WorkRating'][]
  // "id or populated object depending on the endpoint" - modeled as a
  // real union instead of picking one and casting around the other.
  writer: string | User
}
export type WorkRating = components['schemas']['WorkRating']
export type Attachment = components['schemas']['Attachment']
export type PaginationMeta = components['schemas']['PaginationMeta']

// Override with our stricter User (id required) rather than the raw
// generated one.
export type LoginResponse = Omit<
  components['schemas']['LoginResponse'],
  'user'
> & { user: User }

// Use this alias wherever a Work is read from an endpoint confirmed to
// populate writer (every endpoint this app currently reads works from does).
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
