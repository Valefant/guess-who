<template>
  <q-page class="tw-flex tw-items-center tw-justify-center">
    <div class="tw-flex-col tw-space-y-8">
      <q-select
        v-model="locale"
        :options="localeOptions"
        :label="$t('languages.language')"
        borderless
        emit-value
        map-options
        options-dense
        style="min-width: 150px"
        @update:model-value="
          (selectedLocale) => {
            userPreferences.locale = selectedLocale;
          }
        "
      >
        <template #prepend>
          <q-icon :name="`img:src/assets/${locale}.svg`" size="sm" />
        </template>

        <template #option="scope">
          <q-item
            v-bind="scope.itemProps"
            class="tw-flex tw-items-center tw-p-2"
          >
            <q-icon
              :name="`img:src/assets/${scope.opt.value}.svg`"
              size="sm"
              class="tw-mr-4"
            />
            {{ scope.opt.label }}
          </q-item>
        </template>
      </q-select>

      <div>
        <q-btn
          icon="download"
          color="primary"
          @click="exportData"
          class="tw-w-full"
        >
          {{ $t('settings.export') }}
        </q-btn>
      </div>
      <div>
        <q-btn
          icon="add"
          color="primary"
          @click="file?.click()"
          class="tw-w-full"
        >
          {{ $t('settings.import') }}
        </q-btn>
      </div>
      <div>
        <q-btn
          icon="delete"
          color="red"
          @click="resetModal = true"
          class="tw-w-full"
        >
          {{ $t('settings.resetData') }}
        </q-btn>
      </div>
      <div class="tw-flex tw-justify-center">
        <q-btn
          round
          @click="toggleDarkMode()"
          :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
          class="dark:tw-border-2 dark:tw-border-solid dark:tw-border-white"
        />
      </div>

      <input
        hidden
        type="file"
        ref="file"
        @change="readFile"
        accept="application/json"
      />

      <q-dialog v-model="resetModal">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ $t('settings.resetData') }}</div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn
              flat
              :label="$t('actions.cancel')"
              @click="resetModal = false"
              v-close-popup
            />
            <q-btn flat color="red" :label="$t('actions.save')" type="submit" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FileSaver from 'file-saver';
import { computed, ref, watch } from 'vue';
import { useUserPreferencesStore } from 'stores/user-preferences-store';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const langList = import.meta.glob('../../node_modules/quasar/lang/*.mjs');

const { locale, t } = useI18n({ useScope: 'global' });
const userPreferences = useUserPreferencesStore();
const $q = useQuasar();
const resetModal = ref(false);

const localeOptions = computed(() => [
  {
    value: 'en-US',
    label: t('languages.english'),
  },
  {
    value: 'de',
    label: t('languages.german'),
  },
]);

watch(locale, () => {
  langList[
    `../../node_modules/quasar/lang/${userPreferences.locale}.mjs`
  ]().then((locale) => {
    $q.lang.set(locale.default);
  });
});

const file = ref<HTMLInputElement | null>(null);

function exportData() {
  const app = localStorage.getItem('app') as string;
  const file = new File([app], `${Date.now()}-guess-who-export.json`, {
    type: 'application/json;charset=utf-8',
  });
  FileSaver.saveAs(file);
}

async function readFile() {
  if (file.value?.files === null || file.value?.files.length === 0) {
    return;
  }

  const selectedFile = file.value?.files[0];
  const json = (await selectedFile?.text()) ?? '{}';
  localStorage.setItem('app', json);
  window.location.reload();
}

function toggleDarkMode() {
  $q.dark.toggle();
  userPreferences.theme = $q.dark.isActive ? 'dark' : 'light';
}
</script>
