import { route } from 'quasar/wrappers';
import { createRouter, createWebHashHistory } from 'vue-router';

import routes from './routes';
import { useUserPreferencesStore } from 'stores/user-preferences-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.afterEach((to) => {
    const userPreferences = useUserPreferencesStore();
    userPreferences.tab = to?.path?.substring(1).split('/')?.at(0) ?? 'decks';
  });

  return Router;
});
