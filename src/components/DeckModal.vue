<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 350px">
      <q-img
        :src="deck.imageUrl"
        :alt="deck.name"
        v-if="deck.imageUrl"
        class="tw-h-64"
      />
      <q-card-section>
        <div class="text-h6" v-if="update">{{ $t('decks.edit') }}</div>
        <div class="text-h6" v-if="!update">{{ $t('decks.create') }}</div>
      </q-card-section>

      <q-form @submit="submit">
        <q-card-section>
          <q-input
            :label="$t('form.name') + '*'"
            v-model="deck.name"
            autofocus
            :rules="[(val) => val !== '' || $t('validation.name')]"
          />
          <q-input
            :label="$t('form.imageUrl') + '*'"
            v-model="deck.imageUrl"
            :rules="[(val) => val !== '' || $t('validation.imageUrl')]"
          />
          <q-input :label="$t('form.description')" v-model="deck.description" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            :label="$t('actions.cancel')"
            @click="cancel"
            v-close-popup
          />
          <q-btn flat :label="$t('actions.save')" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, toRaw } from 'vue';
import { Deck } from 'stores/app-store';

export interface DeckModalProps {
  modelValue: boolean;
  onSave: (deck: Partial<Deck>) => void;
  onCancel: () => void;
  update: Deck | null;
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<DeckModalProps>(), {
  modelValue: false,
  update: null,
});

let deck = reactive({
  name: '',
  description: '',
  imageUrl: '',
} as Partial<Deck>);

const model = computed({
  get() {
    if (props.update) {
      deck = structuredClone(toRaw(props.update));
    }
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

function cancel() {
  deck = reactive({
    name: '',
    description: '',
    imageUrl: '',
  });
  props.onCancel();
}

function submit() {
  // we need the copy, otherwise we will use the same reference for each newly created card.
  props.onSave({ ...deck });
  deck = reactive({
    name: '',
    description: '',
    imageUrl: '',
  });
}
</script>
