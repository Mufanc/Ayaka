<template>
    <main>
        <div class="flex">
            <div class="aside"></div>
            <main v-if="ready" class="main">
                <article class="py-1.5rem max-w-screen-md mx-auto prose">
                    <suspense>
                        <Markdown :src="path.join($route.path, 'index.md')" :extensions="[]" />
                    </suspense>
                </article>
            </main>
            <div class="aside">
                <div ref="toc" id="toc-container"></div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import Markdown from '@/components/Markdown/Markdown.vue'
import path from 'path'
import { ref, watch } from 'vue'

const toc = ref<HTMLElement>()
const ready = ref(false)

watch(toc, value => {
    value && (ready.value = true)
})
</script>

<style lang="less" scoped>
.main {
    margin: 0 2em;
}

.aside {
    flex-grow: 1;
    display: flex;
    align-items: center;
}

#toc-container {
    top: 0;
    position: fixed;
    height: 100%;
    display: flex;
    align-items: center;
}
</style>
