<template>
  <q-page class="tw-flex-col tw-space-y-8 tw-p-8">
    <div class="tw-flex tw-justify-center tw-space-x-8">
      <q-slider
        v-model="columns"
        snap
        label
        label-always
        :step="1"
        :min="2"
        :max="6"
        :markers="1"
        class="tw-w-80"
      />
      <SizeGroup v-model="size" />
    </div>
    <div
      class="tw-grid tw-items-center tw-justify-items-center tw-gap-4"
      :style="`grid-template-columns: repeat(${columns}, 1fr)`"
    >
      <q-card v-for="deck in app.decks" :key="deck.name">
        <q-tooltip v-if="deck.description" :delay="600"
          >{{ deck.description }}
        </q-tooltip>
        <div>
          <q-img
            :src="deck.imageUrl"
            :alt="deck.name"
            class="tw-h-24 tw-w-16"
            :class="{
              'md:tw-h-96 md:tw-w-64': size === 'lg',
              'md:tw-h-72 md:tw-w-48': size === 'md',
              'md:tw-h-48 md:tw-w-32': size === 'sm',
            }"
          ></q-img>

          <div class="tw-absolute tw-right-2 tw-top-2">
            <q-btn
              round
              text-color="white"
              style="background: rgba(0, 0, 0, 0.4)"
              icon="more_vert"
              :size="size == 'lg' ? 'md' : size"
            >
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    clickable
                    @click="router.push(`decks/${deck.id}`)"
                    v-close-popup
                    class="tw-flex tw-items-center"
                  >
                    <q-icon
                      size="xs"
                      name="content_copy"
                      class="tw-mr-1 tw-opacity-70"
                    />
                    {{ $t('decks.manageCards') }}
                  </q-item>
                  <q-item
                    clickable
                    @click="play(deck.id)"
                    v-close-popup
                    class="tw-flex tw-items-center"
                  >
                    <q-icon
                      size="xs"
                      name="videogame_asset"
                      class="tw-mr-1 tw-opacity-70"
                    />
                    {{ $t('decks.play') }}
                  </q-item>
                  <q-item
                    clickable
                    @click="editDeck(deck)"
                    v-close-popup
                    class="tw-flex tw-items-center"
                  >
                    <q-icon
                      size="xs"
                      name="edit"
                      class="tw-mr-1 tw-opacity-70"
                    />
                    {{ $t('decks.edit') }}
                  </q-item>
                  <q-item
                    clickable
                    @click="deleteDeck(deck.id)"
                    v-close-popup
                    class="tw-flex tw-items-center"
                  >
                    <q-icon
                      size="xs"
                      name="delete"
                      class="tw-mr-1 tw-opacity-70"
                    />
                    {{ $t('decks.delete') }}
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <q-card-section
          class="tw-text-center tw-font-medium"
          :class="{
            'tw-text-sm': size === 'sm',
            'tw-text-base': size === 'md',
            'tw-text-lg': size === 'lg',
          }"
        >
          {{ deck.name }}
        </q-card-section>
        <q-separator />
      </q-card>
    </div>

    <DeckModal
      v-model="open"
      :on-save="(deck) => saveDeck(deck)"
      :on-cancel="() => (selectedDeck = null)"
      :update="selectedDeck"
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="open = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { copyToClipboard, useQuasar } from 'quasar';
import { Deck, Id, Size, useAppStore } from 'stores/app-store';
import { useI18n } from 'vue-i18n';
import DeckModal from 'components/DeckModal.vue';
import SizeGroup from 'components/SizeGroup.vue';

const { t } = useI18n({ useScope: 'global' });
const app = useAppStore();
const $q = useQuasar();
const router = useRouter();

const open = ref(false);
const columns = ref($q.screen.gt.md ? 4 : 2);
const size = ref('md' as Size);
const selectedDeck = ref<Deck | null>(null);

function play(id: Id) {
  const cards = app.getCardsInDeck(id);
  const payload = cards
    .map((card) => `${card.name};${card.imageUrl}`)
    .join(';;');
  const encodedPayload = btoa(payload);
  copyToClipboard(`${window.origin}/#/play?deck=${encodedPayload}`).then(() => {
    $q.notify({ type: 'positive', message: t('decks.playLinkGenerated') });
  });
}

function deleteDeck(id: Id) {
  app.deleteDeck(id);
}

function editDeck(deck: Deck) {
  selectedDeck.value = deck;
  open.value = true;
}

function saveDeck(deck: Partial<Deck>) {
  if (selectedDeck.value == null) {
    app.createDeck(deck);
  } else {
    app.updateDeck(deck as Deck);
  }
  open.value = false;
  selectedDeck.value = null;
}
</script>
