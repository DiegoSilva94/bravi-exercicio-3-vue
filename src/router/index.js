import { createRouter, createWebHistory } from 'vue-router'
import PessoasView from '../views/PessoasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PessoasView
    },
    {
      path: '/pessoa/criar',
      name: 'pessoa.create',
      component: () => import('../views/PessoaFormView.vue')
    },
    {
      path: '/pessoa/:id',
      name: 'pessoa.view',
      component: () => import('../views/PessoaShowView.vue')
    },
    {
      path: '/pessoa/:id/editar',
      name: 'pessoa.edit',
      component: () => import('../views/PessoaFormView.vue')
    }
  ]
})

export default router
