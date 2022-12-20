<template>
    <article class="py-1.5rem max-w-screen-md mx-auto prose">
        <Markdown :src="`${ $route.path }/index.md`" />
    </article>
</template>

<script setup lang="ts">
import Markdown from "@/components/Markdown.vue";
</script>

<style lang="less" scoped>
</style>
