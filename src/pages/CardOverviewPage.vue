<template>
  <q-page class="tw-flex-col tw-space-y-8 tw-p-8">
    <!--    <div class="items-center tw-flex tw-justify-center tw-space-x-8">-->
    <!--    </div>-->
    <div class="tw-flex tw-items-center tw-justify-center tw-space-x-8">
      <q-input label="Search" dense v-model="filter">
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        :label="$t('cards.filterTags')"
        dense
        v-model="selectedTags"
        :options="filteredTags"
        use-chips
        use-input
        multiple
      />
      <q-btn no-caps @click="sortByName()" color="primary">
        {{ $t('cards.sortName') }}
        <q-icon
          size="xs"
          :name="sortModeName === 'asc' ? 'arrow_upward' : 'arrow_downward'"
        />
      </q-btn>
      <SizeGroup v-model="size" />
      <q-slider
        v-model="columns"
        snap
        label
        label-always
        :step="1"
        :max="6"
        :min="2"
        :markers="1"
        class="tw-w-80"
      />
    </div>

    <div
      class="tw-grid tw-grid-cols-6 tw-items-center tw-justify-items-center tw-gap-4"
      :style="`grid-template-columns: repeat(${columns}, 1fr)`"
    >
      <q-card v-for="card in filteredCards" :key="card.name">
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
                  @click="editCard(card)"
                  v-close-popup
                  class="tw-flex tw-items-center"
                >
                  <q-icon size="xs" name="edit" class="tw-mr-1 tw-opacity-70" />
                  {{ $t('cards.edit') }}
                </q-item>
                <q-item
                  clickable
                  @click="deleteCard(card.id)"
                  v-close-popup
                  class="tw-flex tw-items-center"
                >
                  <q-icon
                    size="xs"
                    name="delete"
                    class="tw-mr-1 tw-opacity-70"
                  />
                  {{ $t('cards.delete') }}
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

    <CardModal
      v-model="open"
      :on-save="(card) => saveCard(card)"
      :on-cancel="() => (selectedCard = null)"
      :update="selectedCard"
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="open = true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardModal from 'components/CardModal.vue';
import { Card, Id, Size, Tag, useAppStore } from 'stores/app-store';
import SizeGroup from 'components/SizeGroup.vue';
import { useQuasar } from 'quasar';

const open = ref(false);
const app = useAppStore();
const $q = useQuasar();
const selectedCard = ref<Card | null>(null);
const filteredCards = ref(app.cards);
const filteredTags = ref(app.tags);
const selectedTags = ref([] as Array<Tag>);
const size = ref('md' as Size);
const sortModeName = ref('asc');
const filter = ref('');
const columns = ref($q.screen.gt.md ? 4 : 2);

watch([filter, selectedTags], ([newFilter, newSelectedTags]) => {
  const needle = newFilter.toLowerCase();
  let cards = app.cards;
  cards = cards.filter((card) => card.name.toLowerCase().includes(needle));
  cards = cards.filter(
    (card) =>
      newSelectedTags.length === 0 ||
      (card.tags.length > 0 &&
        newSelectedTags.every((tag) => card.tags.includes(tag))),
  );
  filteredCards.value = cards;
});

function editCard(card: Card) {
  selectedCard.value = card;
  open.value = true;
}

function saveCard(card: Partial<Card>) {
  console.log('?');
  if (selectedCard.value == null) {
    console.log('1');
    app.createCard(card);
  } else {
    console.log('2');
    app.updateCard(card as Card);
  }
  open.value = false;
  selectedCard.value = null;
}

function deleteCard(id: Id) {
  app.deleteCard(id);
}

function sortByName() {
  filteredCards.value.sort((cardA, cardB) =>
    sortModeName.value === 'asc'
      ? cardA.name.localeCompare(cardB.name)
      : cardB.name.localeCompare(cardA.name),
  );
  sortModeName.value = sortModeName.value === 'asc' ? 'desc' : 'asc';
}
</script>
