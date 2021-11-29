import { createApp } from 'vue';
import Cookies from 'js-cookie';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { store, key } from './store';

import './index.css';

(async () => {
  if (Cookies.get(process.env.VUE_APP_COOKIE_TOKEN_NAME)) {
    try {
      await store.dispatch('userStore/getUser');
      store.commit('authStore/SET_IS_LOGGED', true);
      createApp(App)
        .use(store, key)
        .use(router)
        .mount('#app');
    } catch (error) {
      store.commit('authStore/SET_IS_LOGGED', false);
      createApp(App)
        .use(store, key)
        .use(router)
        .mount('#app');
    }
  } else {
    createApp(App)
      .use(store, key)
      .use(router)
      .mount('#app');
  }
})();
