// NOTE: this list is currently hardcoded on the frontend. Consider moving it
// to the backend (e.g. GET /categories) so it can be managed without a redeploy.
export const state = () => ({
  data: [
    { id: 0, name: 'Teknologi' },
    { id: 1, name: 'Kesehatan' },
    { id: 2, name: 'Olahraga' },
    { id: 3, name: 'Travel' },
    { id: 4, name: 'Otomotif' },
  ],
})
