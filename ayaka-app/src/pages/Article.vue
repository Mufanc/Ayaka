<template>
    <main>
        <el-container>
            <el-main>
                <article class="py-1.5rem max-w-screen-md mx-auto prose">
                    <suspense>
                        <Markdown
                            :src="path.join($route.path, 'index.md')"
                            :extensions="[]"
                            @update-toc="updateToc"
                        />
                    </suspense>
                </article>
            </el-main>
            <el-aside class="fixed right-0">
                <Toc :hierarchy="toc" />
            </el-aside>
        </el-container>
    </main>
</template>

<script setup lang="ts">
import { Markdown, Toc, TocTree } from '@/components/Markdown'
import path from 'path'
import { ref } from 'vue'

const toc = ref(new TocTree())

function updateToc(newToc: TocTree) {
    toc.value = newToc
}
</script>

<style lang="less" scoped></style>
