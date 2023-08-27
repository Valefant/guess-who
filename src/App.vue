<template>
  <router-view />
</template>

<script setup lang="ts">
import { mergeDarkModeWithTailwind } from 'src/composable/Theme';

mergeDarkModeWithTailwind();
</script>
