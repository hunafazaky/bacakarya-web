// Shared "load a page of works, then load more on scroll" behaviour.
// home.vue and explore.vue were ~90% identical copies of this logic; this
// mixin is the single source of truth for it now.
//
// Consumers can set `this.category` (a data property) before calling
// fetchWorks() to filter by hashtag; it's optional.
export default {
  data() {
    return {
      works: [],
      page: 1,
      limit: 12,
      total: 0,
      loadingWorks: true,
    };
  },
  methods: {
    async fetchWorks() {
      this.loadingWorks = true;
      try {
        const res = await this.$store.dispatch('getWorks', {
          page: this.page,
          limit: this.limit,
          category: this.category || '',
        });
        if (res && Array.isArray(res.works)) {
          this.works.push(...res.works);
          this.total = res.total || 0;
        }
      } catch (error) {
        console.error('Gagal memuat works:', error);
      } finally {
        this.loadingWorks = false;
      }
    },
    async loadMore() {
      if (this.works.length >= this.total) return;
      this.page += 1;
      await this.fetchWorks();
    },
    handleScroll() {
      const scrollBottom = window.innerHeight + window.scrollY;
      const fullHeight = document.documentElement.offsetHeight;
      const nearBottom = scrollBottom >= fullHeight - 100;
      if (nearBottom && !this.loadingWorks && this.works.length < this.total) {
        this.loadMore();
      }
    },
    resetWorks() {
      this.page = 1;
      this.works = [];
      this.fetchWorks();
    },
    deleteWork(id) {
      if (!window.confirm('Apakah anda ingin menghapus karya tulis ini??'))
        return;
      this.$store.dispatch('deleteWork', id).then(() => {
        this.resetWorks();
        if (typeof this.afterWorkDeleted === 'function')
          this.afterWorkDeleted();
      });
    },
  },
  mounted() {
    this.fetchWorks();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
