<template>
    <main>
        <el-container>
            <el-main>
                <article class="py-1.5rem max-w-screen-md mx-auto prose">
                    <Markdown :index="path.join($route.path, 'index.md')" @update-toc="updateToc" />
                </article>
            </el-main>
            <el-aside class="fixed right-0 prose">
                <Toc :hierarchy="toc" />
            </el-aside>
        </el-container>
    </main>
</template>

<script setup lang="ts">
import Markdown from '@/components/Markdown.vue'
import Toc from '@/components/Toc.vue'
import { TocTree } from '@/components/TocTree'
import path from 'path'
import { ref } from 'vue'

const toc = ref(new TocTree())

function updateToc(newToc: TocTree) {
    toc.value = newToc
}
</script>

<style lang="less" scoped></style>
