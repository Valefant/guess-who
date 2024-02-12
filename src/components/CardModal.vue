<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 350px">
      <q-img
        :src="card.imageUrl"
        :alt="card.name"
        v-if="card.imageUrl"
        class="tw-h-64"
      />
      <q-card-section>
        <div class="text-h6" v-if="update">{{ $t('cards.edit') }}</div>
        <div class="text-h6" v-if="!update">{{ $t('cards.create') }}</div>
      </q-card-section>

      <q-form @submit="submit">
        <q-card-section>
          <q-input
            :label="$t('form.name') + '*'"
            v-model="card.name"
            autofocus
            :rules="[(val: string) => val !== '' || $t('validation.name')]"
          />
          <q-input
            :label="$t('form.imageUrl') + '*'"
            v-model="card.imageUrl"
            :rules="[(val: string) => val !== '' || $t('validation.imageUrl')]"
          />
          <q-select
            :label="$t('form.tags.label')"
            v-model="card.tags"
            use-input
            use-chips
            multiple
            input-debounce="0"
            @new-value="createTag"
            :options="filteredTagOptions"
            @filter="filterTag"
            @input-value="(input) => (tagName = input)"
          >
            <template #no-option>
              <q-item clickable class="tw-flex tw-items-center tw-opacity-50">
                <q-icon size="sm" name="add" />
                <span v-html="$t('form.tags.create', { tagName })"></span>
              </q-item>
            </template>
          </q-select>
          <q-input :label="$t('form.description')" v-model="card.description" />
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
import { computed, reactive, ref, toRaw } from 'vue';
import { Card, useAppStore } from 'stores/app-store';

export interface CardModalProps {
  modelValue: boolean;
  onSave: (card: Partial<Card>) => void;
  onCancel: () => void;
  update: Card | null;
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<CardModalProps>(), {
  modelValue: false,
  update: null,
});

const app = useAppStore();
const filteredTagOptions = ref(app.tags);
const tagName = ref('');

let card = reactive({
  name: '',
  imageUrl: '',
  tags: [],
  description: '',
} as Partial<Card>);

const model = computed({
  get() {
    if (props.update) {
      card = reactive(structuredClone(toRaw(props.update)));
    }
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

function createTag(val: string, done: (item?: any, mode?: 'add' | 'toggle' | 'add-unique' | undefined) => void) {
  if (val.length > 0) {
    if (!app.tags.includes(val)) {
      app.tags.push(val);
    }
    done(val, 'toggle');
  }
}

function filterTag(val: string, update: (block: () => void) => void) {
  update(() => {
    if (val === '') {
      filteredTagOptions.value = app.tags;
    } else {
      const needle = val.toLowerCase();
      filteredTagOptions.value = app.tags.filter(
        (tag) => tag.toLowerCase().indexOf(needle) > -1,
      );
    }
  });
}

function cancel() {
  card = reactive({
    name: '',
    imageUrl: '',
    tags: [],
    description: '',
  });
  props.onCancel();
}

function submit() {
  // we need the copy, otherwise we will use the same reference for each newly created card.
  props.onSave({ ...card });
  card = reactive({
    name: '',
    tags: [],
    imageUrl: '',
    description: '',
  });
}
</script>
