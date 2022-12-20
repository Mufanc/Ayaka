<template>
    <article class="py-1.5rem max-w-screen-md mx-auto prose">
        <div v-for="item in articles" :key="item.uuid">
            <div class="flex justify-between items-baseline">
                <h1 class="inline-block">{{ item.article_name }}</h1>
                <span><i class="fa-regular fa-calendar"></i> {{ item.date }}</span>
            </div>
            <div>{{ item.description }}</div>
            <router-link :to="`/posts/${ item.uuid }/`">
                <el-link class="mt-4" type="primary">More...</el-link>
            </router-link>
            <hr>
        </div>
    </article>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import axios from "axios";

interface Article {
    uuid: string,
    article_name: string,
    date: string,
    description: string
}

const articles = reactive<Article[]>([]);

axios.get("/articles.json").then((resp) => {
    articles.push(...resp.data);
})
</script>

<style lang="less" scoped>

</style>