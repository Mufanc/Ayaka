<template>
    <div :ref="onUpdate" id="markdown" v-html="content"></div>
    <teleport to="#toc-box">
        <span class="w-full">
            <Toc :hierarchy="catalog" />
        </span>
    </teleport>
</template>

<script lang="ts">
import { Extension } from './extensions'
import Toc from '@/components/Markdown/Toc.vue'
import { TocTree } from '@/components/Markdown/TocTree'
import axios from 'axios'
import encoder from 'base-x'
import * as cheerio from 'cheerio'
import highlight from 'highlight.js'
import 'highlight.js/styles/intellij-light.css'
import MarkdownIt from 'markdown-it'
import { reactive, ref } from 'vue'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

function b58encode(str: string) {
    const base58 = encoder('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
    return base58.encode(new TextEncoder().encode(str))
}

export interface Props {
    src: string
    extensions?: string[]
}

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

const catalog = reactive(new TocTree())

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

    catalog.mark(element.id)
})

export default {
    components: { Toc },
    props: {
        src: String,
        extensions: Array,
    },
    async setup({ src, extensions }: Props, { emit: $emit }: any) {
        extensions ??= []

        onBeforeRouteUpdate(to => {
            modules.forEach(it => it.onBeforeRouteUpdate?.call(it, to))
        })

        const routes: [Router, RouteLocationNormalized] = [useRouter(), useRoute()]

        // https://cn.vitejs.dev/guide/features.html#dynamic-import
        for (const name of ['ayaka-core', ...extensions]) {
            // noinspection TypeScriptCheckImport
            const module: Extension = (await import(`./extensions/${name}.ts`)).default
            if (module.injectStyle) {
                // noinspection TypeScriptCheckImport
                await import(`./extensions/${name}.less`)
            }
            module.onLoad?.call(module, ...routes)
            modules.push(module)
        }

        const content = ref('')

        axios.get(src).then(resp => {
            const $ = cheerio.load(markdown.render(resp.data))

            // TOC
            const root = new TocTree()
            const stack: TocTree[] = [root]

            $('body > :is(h2, h3, h4)').each((...[, element]) => {
                const layer = parseInt((element as any).name.substring(1)) - 1

                while (stack[stack.length - 1].layer >= layer) {
                    stack.pop()
                }

                const parent = stack[stack.length - 1]

                const name = $(element).text()
                const anchor = b58encode(name)

                const node = new TocTree({
                    name,
                    layer,
                    $root: stack[0],
                    anchor: parent.anchor ? `${parent.anchor}.${anchor}` : anchor,
                })

                stack[stack.length - 1].children.push(node)
                stack.push(node)

                $(element)
                    .attr('id', node.anchor)
                    .addClass('animate__animated')
                    .append('<i class="fa-solid fa-link"></i>')
            })

            Object.assign(catalog, root)

            modules.forEach(it => it.onRendered?.call(it, $))

            content.value = $.html()
        })

        function onUpdate(root: HTMLElement) {
            if (!root) return

            root.querySelectorAll(':is(h2, h3, h4)').forEach(element => {
                observer.observe(element)
            })

            modules.forEach(it => it.onViewUpdated?.call(it, root))
        }

        return { content, onUpdate, catalog }
    },
    mounted() {
        modules.forEach(it => it.onMounted?.call(it))
    },
    unmounted() {
        observer.disconnect()
        modules.forEach(it => it.onUnmounted?.call(it))
    },
}
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

    :deep(code) {
        font-family: 'Consolas', 'monospace' !important;
    }
}
</style>
