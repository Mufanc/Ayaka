<template>
    <div :ref="onUpdate" class="markdown" v-html="content"></div>
</template>

<script lang="ts">
import { Extension } from './extensions'
import axios from 'axios'
import * as cheerio from 'cheerio'
import highlight from 'highlight.js'
import 'highlight.js/styles/intellij-light.css'
import MarkdownIt from 'markdown-it'
import { ref } from 'vue'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

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

export default {
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

        for (const module of modules) {
            module.onRegisterEmits?.call(module, (event: string) => {
                return (...args) => {
                    $emit(event, ...args)
                }
            })
        }

        // onBeforeRouteUpdate(to => {
        //     modules.forEach(it => it.onBeforeRouteUpdate?.call(it, to))
        // })

        const content = ref('')

        axios.get(src).then(resp => {
            const root = cheerio.load(markdown.render(resp.data))
            modules.forEach(it => it.onRendered?.call(it, root))
            content.value = root.html()
        })

        function onUpdate(root: HTMLElement) {
            modules.forEach(it => it.onViewUpdated?.call(it, root))
        }

        return { content, onUpdate }
    },
    mounted() {
        modules.forEach(it => it.onMounted?.call(it))
    },
    unmounted() {
        modules.forEach(it => it.onUnmounted?.call(it))
    },
}
</script>

<style lang="less" scoped></style>
