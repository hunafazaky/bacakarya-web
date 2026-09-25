# Endpoints not used by this app

Per project decision: admin/ops-style endpoints are not wired into any UI
here. Listed for reference so nobody re-adds a "wait, why doesn't the app
call this?" investigation later. See `openapi.yaml` in this folder (or
`bacakarya-api`'s `/docs`) for full request/response shapes.

- `DELETE /users` — deletes every user. No confirmation UI exists for this; a
  bug, not a feature, if it's ever exposed.
- `DELETE /works` — deletes every work. Same reasoning.
- `POST /works/many` — bulk-create works from a JSON array (cover as a
  hosted URL string, not a file). Looks like a seeding/import tool, not a
  user-facing action.
- `POST /classifications` — full classifier retrain from every work in the
  DB. Not needed day-to-day: the classifier already trains incrementally on
  every `POST /works` (`work.service.js` calls
  `classificationService.learnAndCategorize` internally). This is a
  maintenance/ops action.
- `DELETE /classifications` — deletes all classification records.
- `PUT /classifications/{id}` — manually teach the classifier a
  title/category example outside of a real work. Same "ops tool" category;
  also `id` is accepted but unused server-side (singleton collection).
- `POST /recommendations` — full recommender retrain from every rating in
  the DB. Same reasoning as the classifier retrain - not needed day-to-day,
  since `PUT /recommendations` (submitting a rating) is what actually drives
  the recommender.
- `GET /recommendations` — lists raw recommendation records (the
  serialized ratings table), not per-user recommended works. That's
  `GET /recommendations/{userId}`, which the app does use.
- `DELETE /recommendations` / `DELETE /recommendations/{id}` — deletes
  recommendation record(s).

If any of these turn into real product features later (e.g. an admin panel,
a "reset my recommendations" button), move them out of this list and into
the relevant composable/page instead of leaving them undocumented.
