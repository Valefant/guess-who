import { defineStore } from 'pinia';

export const useUserPreferencesStore = defineStore('user-preferences', {
  state: (): State => ({
    locale: 'en-US',
    tab: 'decks',
    theme: 'auto',
  }),
  persist: true,
});

interface State {
  locale: string;
  tab: string;
  theme: 'auto' | 'light' | 'dark';
}
