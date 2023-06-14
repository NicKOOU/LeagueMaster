import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SessionView from '../views/SessionView.vue';
import ChampSelect from '../views/ChampSelect.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/session', component: SessionView },
  { path: '/champ-select', component: ChampSelect },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;