<template>
    <article class="py-1.5rem max-w-screen-md mx-auto prose">
        <div v-for="it in articles" :key="it.uuid">
            <div class="flex justify-between items-baseline">
                <h2 class="inline-block">{{ it.article_name }}</h2>
                <span><i class="fa-regular fa-calendar"></i> {{ it.date }}</span>
            </div>
            <div>{{ it.description }}</div>
            <router-link :to="`/posts/${it.uuid}/`">
                <el-link class="mt-4" type="primary">More...</el-link>
            </router-link>
            <hr />
        </div>
    </article>
</template>

<script setup lang="ts">
import axios from 'axios'
import { reactive } from 'vue'

interface Article {
    uuid: string
    article_name: string
    date: string
    description: string
}

const articles = reactive<Article[]>([])

axios.get('/articles.json').then(resp => {
    articles.push(...resp.data)
})
</script>

<style lang="less" scoped></style>
