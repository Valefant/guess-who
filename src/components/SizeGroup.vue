<template>
  <q-btn-group>
    <q-btn
      label="s"
      :color="size === 'sm' ? 'primary' : undefined"
      @click="size = 'sm'"
    />
    <q-btn
      label="m"
      :color="size === 'md' ? 'primary' : undefined"
      @click="size = 'md'"
    />
    <q-btn
      label="l"
      :color="size === 'lg' ? 'primary' : undefined"
      @click="size = 'lg'"
    />
  </q-btn-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Size } from 'stores/app-store';

export interface SizeGroupProps {
  modelValue: Size;
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<SizeGroupProps>(), {});

const size = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});
</script>
