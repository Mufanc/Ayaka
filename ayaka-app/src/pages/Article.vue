<template>
    <main>
        <el-container>
            <el-aside width="20%" class="right-0 h-screen fixed flex items-center">
                <div id="toc-box"></div>
            </el-aside>
            <el-main>
                <article class="py-1.5rem max-w-screen-md mx-auto prose">
                    <suspense>
                        <Markdown :src="path.join($route.path, 'index.md')" :extensions="[]" />
                    </suspense>
                </article>
            </el-main>
        </el-container>
    </main>
</template>

<script setup lang="ts">
import Markdown from '@/components/Markdown/Markdown.vue'
import path from 'path'
</script>

<style lang="less" scoped>
#toc-box {
    width: 100%;
    max-height: 40%;
    overflow: auto;
}
</style>
