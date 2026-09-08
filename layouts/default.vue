<template>
  <v-app dark>
    <v-navigation-drawer
      :permanent="height > 400"
      :mini-variant="height <= 500"
      dark
      fixed
      app
    >
      <h1 v-if="height > 500" class="text-center ma-5 white--text">
        Bacakarya
      </h1>
      <h1 v-else class="text-center ma-5 white--text">B</h1>
      <!-- TODO: search bar was planned here but never wired to anything -->
      <v-list>
        <v-tooltip
          v-for="(item, i) in items"
          :key="i"
          :disabled="height > 500"
          right
        >
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" :to="item.to" router exact v-on="on">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-divider />
        <!-- TODO: a "current user" link + settings shortcut was planned
             here but never finished/wired up -->
      </v-list>
    </v-navigation-drawer>
    <v-main class="mb-12">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer v-if="height <= 400" dark fixed app padless>
      <v-card flat tile width="100%" class="text-center">
        <v-card-text>
          <v-btn
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
            class="mx-4"
            icon
          >
            <v-icon size="24px">
              {{ item.icon }}
            </v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import responsiveHeight from '~/mixins/responsiveHeight';

export default {
  name: 'DefaultLayout',
  mixins: [responsiveHeight],
  data() {
    return {
      items: [
        {
          icon: 'mdi-home',
          title: 'Beranda',
          to: '/home',
        },
        {
          icon: 'mdi-compass',
          title: 'Eksplorasi',
          to: '/explore',
        },
        {
          icon: 'mdi-bookshelf',
          title: 'Rak Buku',
          to: '/bookshelf',
        },
        {
          icon: 'mdi-text-box-plus',
          title: 'Tulis Sesuatu',
          to: '/write',
        },
      ],
      title: 'Bacakarya',
    };
  },
};
</script>

<style lang="css">
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.bottom {
  bottom: 16px;
}
.dashed-border {
  border: 1px dashed #212122;
}
.h-100 {
  height: 100%;
}
.w-100 {
  width: 100%;
}
.zoom-in-pointer {
  cursor: zoom-in;
}
.zoom-out-pointer {
  cursor: zoom-out;
}
</style>
