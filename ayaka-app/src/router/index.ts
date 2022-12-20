import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component() {
                return import('@/components/HomePage.vue')
            },
        },
        {
            path: '/posts/:article',
            name: 'Article',
            component() {
                return import('@/components/ArticlePage.vue')
            },
        },
    ],
})

export default router
