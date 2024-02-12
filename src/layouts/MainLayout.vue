<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      class="bg-primary text-white"
      v-if="$q.screen.gt.md"
      :mini="!drawer || miniState"
      @click.capture="drawerClick"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            clickable
            v-ripple
            active-class="tw-font-bold tw-text-white bg-blue-9"
            :active="tab === 'decks'"
            @click="setNavigation('decks')"
          >
            <q-item-section avatar>
              <q-icon name="photo_library" />
            </q-item-section>
            <q-item-section class="">
              {{ $t('navigation.decks') }}
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            active-class="tw-font-bold tw-text-white bg-blue-9"
            :active="tab === 'cards'"
            @click="setNavigation('cards')"
          >
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>
            <q-item-section>
              {{ $t('navigation.cards') }}
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            active-class="tw-font-bold tw-text-white bg-blue-9"
            :active="tab === 'settings'"
            @click="setNavigation('settings')"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              {{ $t('navigation.settings') }}
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="miniState = true">
            <q-item-section avatar>
              <q-icon name="chevron_left" />
            </q-item-section>
            <q-item-section>
              {{ $t('navigation.minimize') }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-footer v-if="$q.screen.lt.lg">
      <q-tabs no-caps v-model="tab">
        <q-tab
          name="decks"
          :label="$t('navigation.decks')"
          @click="setNavigation('decks')"
        />
        <q-tab
          name="cards"
          :label="$t('navigation.cards')"
          @click="setNavigation('cards')"
        />
        <q-tab
          name="settings"
          :label="$t('navigation.settings')"
          @click="setNavigation('settings')"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserPreferencesStore } from 'stores/user-preferences-store';

const userPreferences = useUserPreferencesStore();
const router = useRouter();

const tab = computed(() => userPreferences.tab);
const drawer = ref(true);
const miniState = ref(false);

function setNavigation(navigation: string) {
  userPreferences.tab = navigation;
  router.push(`/${navigation}`);
}

function drawerClick(e: Event) {
  if (miniState.value) {
    miniState.value = false;
    e.stopPropagation();
  }
}
</script>
