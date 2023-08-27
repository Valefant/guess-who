<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer>
      <q-tabs no-caps v-model="tab">
        <q-tab
          name="decks"
          :label="$t('navigation.decks')"
          @click="setActiveTab('decks')"
        />
        <q-tab
          name="cards"
          :label="$t('navigation.cards')"
          @click="setActiveTab('cards')"
        />
        <q-tab
          name="settings"
          :label="$t('navigation.settings')"
          @click="setActiveTab('settings')"
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
import { computed } from 'vue';
import { useUserPreferencesStore } from 'stores/user-preferences-store';

const userPreferences = useUserPreferencesStore();
const router = useRouter();

const tab = computed(() => userPreferences.tab);

function setActiveTab(tab: string) {
  userPreferences.tab = tab;
  router.push(`/${tab}`);
}
</script>
