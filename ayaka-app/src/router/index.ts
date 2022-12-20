import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component() {
                return import('@/components/Home.vue')
            },
        },
        {
            path: '/posts/:article',
            name: 'Article',
            component() {
                return import('@/components/Reader.vue')
            },
        },
    ],
})

export default router
