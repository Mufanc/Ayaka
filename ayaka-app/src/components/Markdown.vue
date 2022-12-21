<template>
    <div class="markdown" v-html="content"></div>
</template>

<script setup lang="ts">
import { TocTree } from '@/components/TocTree'
import 'animate.css'
import axios from 'axios'
import encoder from 'base-x'
import * as cheerio from 'cheerio'
import highlight from 'highlight.js'
import 'highlight.js/styles/intellij-light.css'
import MarkdownIt from 'markdown-it'
import { nextTick, ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const { src } = defineProps<{ src: string }>()

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

const route = useRoute()
const source = ref('')
const content = ref('')

const emit = defineEmits<{
    (e: 'update-toc', toc: TocTree): void
}>()

function jumpTo(route: RouteLocationNormalizedLoaded) {
    const element = document.getElementById(route.query.anchor as string)

    if (!element) {
        return
    }

    element.scrollIntoView()

    const animate = ['animate__animated', 'animate__flash']
    element.classList.add(...animate)
    setTimeout(() => {
        element.classList.remove(...animate)
    }, 1000)
}

onBeforeRouteUpdate(jumpTo)

watch(source, () => {
    const $ = cheerio.load(markdown.render(source.value))

    // replace <img/> source  Todo: deal with other type?
    $('img').each((ignored, element) => {
        const src = $(element).attr('src')?.replace('\\', '/')
        if (src?.startsWith('./')) {
            $(element).attr('src', route.path + src.substring(1))
        }
    })

    // TOC
    function b58encode(str: string) {
        const base58 = encoder('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
        return base58.encode(new TextEncoder().encode(str))
    }

    const root = new TocTree()

    let stack: TocTree[] = [root]
    $('body > :is(h2, h3, h4)').each((ignored, element) => {
        const layer = parseInt((element as any).name.substring(1))

        while (stack[stack.length - 1].layer >= layer) {
            stack.pop()
        }

        const parent = stack[stack.length - 1]

        const name = $(element).text()
        const id = b58encode(name)

        const node = {
            name,
            id: parent.id ? `${parent.id}.${id}` : id,
            children: [],
            layer,
        }

        stack[stack.length - 1].children.push(node)
        stack.push(node)

        $(element).attr('id', node.id)
    })

    content.value = $.html()
    emit('update-toc', root)

    nextTick().then(() => jumpTo(route))
})

axios.get(src).then(resp => {
    source.value = resp.data
})
</script>

<style lang="less" scoped>
.markdown {
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
