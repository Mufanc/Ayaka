<template>
    <main>
        <el-container>
            <div id="toc-box"></div>
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
    // Todo: 浮于 article 右侧？
    position: fixed;
    width: 20%;
    right: 4em;
    top: 50%;
    transform: translateY(-50%);
    max-height: 40%;
    overflow: auto;
}
</style>
