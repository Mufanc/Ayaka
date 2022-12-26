<template>
    <div ref="container" id="markdown" v-html="content"></div>
    <teleport to="#toc-container">
        <TocWrapper :hierarchy="catalog" :center="center" />
    </teleport>
</template>

<script setup lang="ts">
import { Article } from '.'
import type { Extension } from './extensions'
import TocWrapper from '@/components/Markdown/TocBox.vue'
import { TocRoot } from '@/components/Markdown/TocTree'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import highlight from 'highlight.js'
import 'highlight.js/styles/intellij-light.css'
import MarkdownIt from 'markdown-it'
import path from 'path'
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

const modules: Extension[] = []

// Todo: polyfill punycode - https://github.com/vuejs/vitepress/pull/1244
const markdown = MarkdownIt({
    html: true,
    highlight(code, lang) {
        if (lang && highlight.getLanguage(lang)) {
            try {
                return highlight.highlight(code, { language: lang }).value
            } catch (err) {
                console.error(err)
            }
        }
        return ''
    },
})

const catalog = reactive(new TocRoot())
const center = ref(0)

const headers = new Set<HTMLElement>()
const observer = new IntersectionObserver(entries => {
    entries.forEach(it => {
        const element = it.target as HTMLElement
        if (it.intersectionRatio > 0) {
            // 元素进入
            headers.add(element)
        } else {
            // 元素消失
            headers.delete(element)
        }
    })

    if (!headers.size) return

    const element = Array.from(headers.entries())
        .map(it => it[0])
        .reduce((a, b) => {
            if (a.offsetTop < b.offsetTop) {
                return a
            } else {
                return b
            }
        })

    center.value = catalog.mark(element.id)
})

const { src } = defineProps<{
    src: string
}>()

onBeforeRouteUpdate(to => {
    modules.forEach(it => it.onBeforeRouteUpdate?.call(it, to))
})

const routes: [Router, RouteLocationNormalized] = [useRouter(), useRoute()]
const metadata: Article = (await axios.get(path.join(routes[1].path, 'article.json'))).data

metadata.plugins ??= []

// https://cn.vitejs.dev/guide/features.html#dynamic-import
for (const name of ['ayaka-core', ...metadata.plugins]) {
    try {
        // noinspection TypeScriptCheckImport
        const module: Extension = (await import(`./extensions/${name}.ts`)).default
        if (module.injectStyle) {
            // noinspection TypeScriptCheckImport
            await import(`./extensions/${name}.less`)
        }
        module.onLoad?.call(module, ...routes)
        modules.push(module)
    } catch (err) {
        console.error(err)
        nextTick(() => {
            ElMessage.error(`Error: Failed to load extension "${name}"`)
        })
    }
}

modules.forEach(it => {
    const plugin = it.onLoadMarkdownPlugin?.call(it)
    plugin && markdown.use(plugin)
})

const content = ref('')
const container = ref<HTMLElement>()

axios.get(src).then(resp => {
    const $ = cheerio.load(markdown.render(resp.data))

    // TOC
    const root = TocRoot.from($)
    Object.assign(catalog, root)

    modules.forEach(it => it.onRendered?.call(it, $))

    content.value = $.html()

    nextTick(() => {
        const root = container.value
        if (!root) return

        root.querySelectorAll(':is(h2, h3, h4)').forEach(element => {
            observer.observe(element)
        })

        modules.forEach(it => it.onViewUpdated?.call(it, root))
    })
})

onMounted(() => {
    modules.forEach(it => it.onMounted?.call(it))
})

onUnmounted(() => {
    observer.disconnect()
    modules.forEach(it => it.onUnmounted?.call(it))
})
</script>

<style lang="less" scoped>
#markdown {
    :deep(p) {
        text-indent: 2em;
    }

    :deep(ul) {
        padding: 0;
    }

    :deep(pre) {
        overflow-x: auto;
        color: unset;
        background-color: #fafafa;
    }

    :deep(img) {
        margin-left: auto;
        margin-right: auto;
    }

    :deep(code) {
        font-family: 'Consolas', 'monospace' !important;
    }
}
</style>
