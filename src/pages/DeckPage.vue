<template>
  <q-page class="tw-flex">
    <div>
      <q-table
        flat
        bordered
        :title="$t('cards.cards')"
        :rows="availableCards"
        :columns="tableColumns"
        row-key="index"
        selection="multiple"
        :rows-per-page-options="[0]"
        :filter="filter"
        v-model:selected="selected"
        style="height: calc(100vh - 48px); position: fixed"
        virtual-scroll
        class="tw-w-[22rem]"
      >
        <template #top>
          <div class="tw-flex tw-space-x-2">
            <q-btn
              color="primary"
              :label="$t('cards.add', selected.length)"
              @click="addCards"
              :disable="selected.length === 0"
            />
            <q-input borderless dense color="primary" v-model="filter">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template #body-cell-imageUrl="props">
          <q-td :props="props">
            <q-avatar size="lg">
              <img
                :src="props.row.imageUrl"
                :alt="props.row.name"
                class="tw-object-cover"
              />
            </q-avatar>
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="tw-ml-[22rem] tw-flex-1 tw-flex-col tw-space-y-8 tw-p-8">
      <div class="tw-flex tw-items-center tw-justify-center tw-space-x-8">
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
        class="tw-w-100 tw-grid tw-grid-cols-6 tw-items-center tw-justify-items-center tw-gap-4"
        :style="`grid-template-columns: repeat(${columns}, 1fr)`"
      >
        <q-card v-for="card in cards" :key="card.name">
          <q-img
            :src="card.imageUrl"
            :alt="card.name"
            class="tw-h-24 tw-w-16"
            :class="{
              'md:tw-h-96 md:tw-w-64': size === 'lg',
              'md:tw-h-72 md:tw-w-48': size === 'md',
              'md:tw-h-48 md:tw-w-32': size === 'sm',
            }"
          />

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
                    @click="app.removeCardFromDeck(card.id, deckId)"
                    v-close-popup
                    class="tw-flex tw-items-center"
                  >
                    <q-icon
                      size="xs"
                      name="delete"
                      class="tw-mr-1 tw-opacity-70"
                    />
                    {{ $t('decks.removeCard') }}
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <q-card-section
            class="tw-text-center tw-font-medium"
            :class="{
              'tw-text-sm': size === 'sm',
              'tw-text-base': size === 'md',
              'tw-text-lg': size === 'lg',
            }"
          >
            {{ card.name }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Card, Size, useAppStore } from 'stores/app-store';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import SizeGroup from 'components/SizeGroup.vue';
import { useQuasar } from 'quasar';

const app = useAppStore();
const $q = useQuasar();
const route = useRoute();
const columns = ref($q.screen.gt.md ? 4 : 2);

const deckId = route.params.id as string;
const cards = computed(() => app.getCardsInDeck(deckId));
const availableCards = computed(() =>
  app
    .getAvailableCardsForDeck(deckId)
    .map((card, index) => ({ index, ...card })),
);

const selected = ref<Card[]>([]);
const filter = ref('');
const size = ref('md' as Size);

const tableColumns = [
  { name: 'name', field: 'name', label: 'Name', sortable: true },
  { name: 'imageUrl', field: 'imageUrl', label: 'Avatar' },
];

function addCards() {
  selected.value.forEach((card) => app.addCard(deckId, card.id));
  selected.value = [];
}
</script>
