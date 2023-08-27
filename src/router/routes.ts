import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/decks',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'decks', component: () => import('pages/DeckOverviewPage.vue') },
      { path: 'decks/:id', component: () => import('pages/DeckPage.vue') },
      { path: 'cards', component: () => import('pages/CardOverviewPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },
  {
    path: '/play',
    component: () => import('layouts/PlayLayout.vue'),
    children: [{ path: '', component: () => import('pages/PlayPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
