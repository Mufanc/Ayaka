import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component() {
                return import('@/pages/Home.vue')
            },
        },
        {
            path: '/posts/:article',
            name: 'Article',
            component() {
                return import('@/pages/Article.vue')
            },
        },
    ],
})

export default router
