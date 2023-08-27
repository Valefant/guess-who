<template>
  <q-page class="tw-flex-col tw-space-y-8 tw-p-8">
    <div class="items-center tw-flex tw-justify-center tw-space-x-8">
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
      <SizeGroup v-model="size" />
    </div>
    <div
      class="tw-grid tw-items-center tw-justify-items-center tw-gap-4 xs:tw-grid-cols-4 md:tw-grid-cols-6"
      :style="`grid-template-columns: repeat(${columns}, 1fr)`"
    >
      <q-card
        v-for="(card, index) in cards"
        :key="card.name"
        :class="{
          'tw-opacity-25': !visible[index],
          'tw-border-4 tw-border-blue-700': selectedCard?.index == card.index,
        }"
        @click="markCard(index, card)"
      >
        <q-img
          :src="card.imageUrl"
          :alt="card.name"
          position="top"
          class="tw-h-24 tw-w-16"
          :class="{
            'md:tw-h-96 md:tw-w-64': size === 'lg',
            'md:tw-h-72 md:tw-w-48': size === 'md',
            'md:tw-h-48 md:tw-w-32': size === 'sm',
          }"
        />
        <q-card-section class="tw-text-center tw-font-medium">
          {{ card.name }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { PlayCard, Size } from 'stores/app-store';
import SizeGroup from 'components/SizeGroup.vue';

const route = useRoute();

const selectedCard = ref<PlayCard | null>();
const decodedPayload = atob(route.query.deck as string);
const partialCards = decodedPayload.split(';;').map((chunk, index) => {
  const [name, imageUrl] = chunk.split(';');
  return { index, name, imageUrl } as PlayCard;
});
const cards = ref<PlayCard[]>(partialCards);
const visible = ref<boolean[]>(new Array(cards.value.length).fill(true));
const columns = ref(4);
const size = ref('md' as Size);

function markCard(index: number, card: PlayCard) {
  if (!selectedCard.value) {
    selectedCard.value = card;
    return;
  }
  visible.value[index] = !visible.value[index];
}
</script>
