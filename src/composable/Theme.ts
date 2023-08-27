import { watch } from 'vue';
import { Dark, useQuasar } from 'quasar';
import { useUserPreferencesStore } from 'stores/user-preferences-store';

export function mergeDarkModeWithTailwind() {
  const userPreferences = useUserPreferencesStore();
  const $q = useQuasar();

  console.log(userPreferences.theme);
  if (Dark.isActive || userPreferences.theme === 'dark') {
    $q.dark.set(true);
    mergeQuasarThemeWithTailwind(true);
  }

  watch(
    () => Dark.isActive,
    (isDark) => {
      mergeQuasarThemeWithTailwind(isDark);
    },
  );
}

function mergeQuasarThemeWithTailwind(val: boolean) {
  console.log("let's go", val);
  const prefix = 'tw-';
  const rootEl = document.querySelector('html');
  rootEl?.classList?.remove(val ? `${prefix}light` : `${prefix}dark`);
  rootEl?.classList?.add(val ? `${prefix}dark` : `${prefix}light`);
}
