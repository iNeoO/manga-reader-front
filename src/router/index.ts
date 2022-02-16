import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '@/views/Home.vue';

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    layout?: string
  }
}

const isNotLogged = async () => {
  const { store } = await import('@/store');
  if (!store.getters['authStore/isLogged']) {
    return true;
  }
  return { name: 'home' };
};

const isLogged = async () => {
  const { store } = await import('@/store');
  if (store.getters['authStore/isLogged']) {
    return true;
  }
  return { name: 'login' };
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    beforeEnter: isNotLogged,
    meta: {
      layout: 'NotLogged',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    beforeEnter: isLogged,
    meta: {
      layout: 'Logged',
    },
  },
  {
    path: '/chapters-read',
    name: 'chaptersRead',
    component: () => import(/* webpackChunkName: "chaptersRead" */ '../views/ChaptersRead.vue'),
    beforeEnter: isLogged,
    meta: {
      layout: 'Logged',
    },
  },
  {
    path: '/manga/:mangaName',
    name: 'manga',
    props: true,
    component: () => import(/* webpackChunkName: "manga" */ '../views/Manga.vue'),
    beforeEnter: isLogged,
    meta: {
      layout: 'Logged',
    },
  },
  {
    path: '/manga/:mangaName/chapter/:chapterNumber',
    name: 'chapter',
    props: true,
    component: () => import(/* webpackChunkName: "chapter" */ '../views/Chapter.vue'),
    beforeEnter: isLogged,
    meta: {
      layout: 'Logged',
    },
  },
  {
    path: '/manga/:mangaName/chapter/:chapterNumber/page/:pageNumber',
    name: 'page',
    props: true,
    component: () => import(/* webpackChunkName: "page" */ '../views/Page.vue'),
    beforeEnter: isLogged,
    meta: {
      layout: 'Logged',
    },
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: isLogged,
    meta: {
      layout: 'Logged',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(() => {
  window.scrollTo(0, 0);
});

export default router;
