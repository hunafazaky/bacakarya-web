# bacakarya-web (v2) — project notes for Claude

This is a from-scratch rewrite of Bacakarya's frontend on Nuxt 4, replacing
the old Nuxt 2 app (kept around only as a behavioral reference, not
something being ported file-by-file). Backend is `bacakarya-api`
(Express/MongoDB), contract defined in `api-reference/openapi.yaml`.

## Stack decisions (locked in, don't relitigate without asking)

- **Nuxt 4** — only actively-supported major (Nuxt 2 and 3 are both EOL).
- **Vuetify 4**, installed via the official installer (`npm create vuetify` /
  the Nuxt+Vuetify quickstart), not hand-configured. That installer also
  brought in some genuine improvements over the first hand-rolled setup:
  - `prefixComposables: ['useLayout']` in `nuxt.config.ts` — fixes a real
    naming collision between Vuetify's `useLayout` and Nuxt's built-in one.
  - `ssrClientHints` — detects viewport size / color scheme / reduced-motion
    from client hints during SSR, avoiding hydration mismatches for
    theme/layout-dependent rendering. Default theme is `dark` (see the
    comment in `nuxt.config.ts` about why `'system'` needs `ssr: false`).
  - `public/layers.css` + the `<link>` to it in `nuxt.config.ts` — declares
    CSS `@layer` order so Vuetify's styles and our own overrides cascade
    predictably.
  - ESLint via `@nuxt/eslint` + `eslint-config-vuetify` (flat config,
    `eslint.config.js`) — run `npm run lint` / `npm run lint:fix`. The
    generated `shared/types/api.d.ts` is excluded from linting on purpose.
  - `@vuetify/mcp` (dev dependency) — Vuetify's official MCP server for
    component/API lookups during development; not a runtime dependency.
  - `app/assets/styles/settings.scss` — the Sass variable override point for
    real theming work in Phase 2 (empty/default for now).
  - **Local dev uses `bun`**, not npm (see `AGENTS.md`, `bun.lock`) — I
    verify with `npm` in sandboxed sessions since bun isn't always
    available there, but treat `bun.lock` as authoritative locally.
- **Pinia**, not Vuex.
- **Composition API** (`<script setup lang="ts">`) throughout, not Options
  API.
- **TypeScript**, adopted from the start — types for every API shape are
  *generated*, not hand-written (see below). Note: the Vuetify installer's
  package.json regeneration drops `typescript`/`vue-tsc`/`openapi-typescript`
  and the `gen:types`/`typecheck` scripts if you rerun it — re-add them
  after (see git history around 2026-09-25 for the exact diff).
- UI/UX is open to change from the old app — this isn't a strict visual
  port. Phase 2 is where real design attention happens; earlier phases are
  intentionally plain/functional.
- Admin/ops-style endpoints are deliberately **not** wired into any UI —
  see `api-reference/unused-endpoints.md` before assuming something's
  missing by accident.

## API contract — things that caused real bugs in the old app, don't repeat them

- **Every response is `{ data, message, meta? }`.** Always read through
  `.data`. This single mistake (treating the envelope as the resource)
  broke nearly everything in the old app's first pass.
- **Auth**: `POST /users/login` returns `{ data: { user, token } }`. Token
  is a 7-day JWT, sent as `Authorization: Bearer <token>`. It's kept
  **memory-only** in the Pinia auth store (`app/stores/auth.ts`) —
  deliberate, not a bug: refreshing the page logs you out until the backend
  adds a refresh-token/cookie flow. Don't "fix" this by adding
  localStorage/cookie persistence without checking with Zashin first.
- **403 vs 401**: 403 means "authenticated, but not the resource's owner."
  401 means "no valid token at all." Don't collapse these into one error
  state in the UI.
- **Work create/update (`POST`/`PUT /works`) are `multipart/form-data`**,
  not JSON. `cover`/`attachment` are real files (the backend re-hosts them
  via ImageKit server-side — there is no client-side storage SDK to
  integrate, on purpose). `category` should be sent as repeated
  `category` form fields, not a JSON array string (both work, but repeated
  fields is the documented/preferred shape).
- **Mirrored fields**: liking/reading a work go through dedicated
  endpoints — `POST /works/{id}/read`, `POST`/`DELETE /works/{id}/like` —
  which atomically update both the work's and the user's side. Don't PUT
  `readers`/`like_by`/`read_list`/`like_list` directly; `PUT /works/{id}`
  and `PUT /users/{id}` don't accept those fields (whitelisted server-side).
- **Rating** goes through `PUT /recommendations` (`{ work_id, user_id,
  rating }`), not a direct field update either.
- `writer` on `POST /works` and `user_id` on `PUT /recommendations` are
  taken from the auth token server-side, not the request body — don't
  bother sending them.

## Types

`shared/types/api.d.ts` is **generated**, not hand-edited — regenerate with
`npm run gen:types` whenever `api-reference/openapi.yaml` changes (copy the
latest spec from `bacakarya-api` first). `shared/types/index.ts` has the
friendly aliases (`User`, `Work`, `ApiEnvelope<T>`, etc.) built on top of it
— add new aliases there, not by hand-copying shapes.

## Structure

```
app/
  components/
  composables/    # useApi() etc.
  layouts/
  middleware/     # auth.ts
  pages/
  plugins/        # api.ts - the configured $fetch instance
  stores/         # pinia: auth.ts, (works.ts etc. as they're built)
shared/
  types/          # api.d.ts (generated) + index.ts (aliases)
api-reference/
  openapi.yaml    # copied from bacakarya-api - keep in sync
  unused-endpoints.md
```

## Verification

- `npm run typecheck` (`nuxt typecheck`) — run before considering any
  phase done.
- `npm run lint` / `npm run lint:fix` — ESLint via `eslint-config-vuetify`.
- `npm run build` for a full sanity check.
- No test framework set up yet; add one when there's enough real behavior
  to be worth testing (premature right now while pages are still
  placeholders).

## Working style (carried over from the old project)

- Plan before writing code for anything non-trivial; get it confirmed
  first.
- Ship phase-by-phase (see project memory / conversation history for the
  current phase plan), not as one giant drop.
- When something in the old app or the API contract is ambiguous, ask
  rather than guess — contract mismatches were the single biggest source
  of bugs last time.

## Status

- **Phase 0 (foundation) — done.**
- **Phase 1 (reading side) — done.** `stores/works.ts` (list/detail/like/
  unlike/read/rate against the real endpoints), `composables/useWorkList.ts`
  (shared infinite-scroll logic for home/explore), `components/WorkCard.vue`,
  `utils/categories.ts` (static list - no `/categories` endpoint exists),
  and three pages: `home.vue` (recommendations + latest feed), `explore.vue`
  (category filter), `work/[id]/read.vue` (content rendered via
  `isomorphic-dompurify` - sanitized properly this time, not deferred like
  in the old app; like/unlike, mark-as-read on mount, and rating all wired
  to the real endpoints). Verified: typecheck/lint/build all clean, SSR boot
  test confirms `/home`, `/explore`, `/work/:id/read` correctly redirect to
  `/` when unauthenticated (no live backend available to test the
  authenticated path in this environment - test against a real
  `bacakarya-api` instance before considering this fully done).
  Write/edit (multipart upload) is next.
- Note: `User`/`Work`'s generated `id` field is typed optional in the raw
  OpenAPI output (schema doesn't list it under `required`, even though it's
  always present on a persisted document) - `shared/types/index.ts`
  re-declares it as required on the `User`/`Work`/`LoginResponse` aliases.
  If new fields hit the same "technically optional, always present"
  situation, follow that pattern rather than sprinkling `!` assertions.
