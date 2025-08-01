import { createRouter, createWebHashHistory } from 'vue-router'
import CreateWordView from '../views/CreateWordView.vue'
import PlayWordleView from '../views/PlayWordleView.vue'

const routes = [
  {
    path: '/',
    name: 'CreateWord',
    component: CreateWordView
  },
  {
    path: '/play/:encodedWord',
    name: 'PlayWordle',
    component: PlayWordleView,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router