<template>
    <div ref="container" class="markdown" v-html="content"></div>
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
import path from 'path'
import { nextTick, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

const { index } = defineProps<{ index: string }>()

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
const router = useRouter()

const emit = defineEmits<{
    (e: 'update-toc', toc: TocTree): void
}>()

class Anchor {
    private static noAnimation = false
    static jumpTo(anchor: string, animate: boolean = true) {
        const element = document.getElementById(anchor as string)
        if (!element) return

        if (!animate) {
            this.noAnimation = true
            router.replace({ query: { anchor } })
            return
        }

        element.scrollIntoView()

        if (this.noAnimation) {
            this.noAnimation = false
        } else {
            const animator = ['animate__animated', 'animate__flash']
            element.classList.add(...animator)
            setTimeout(() => {
                element.classList.remove(...animator)
            }, 1000)
        }
    }
}

onBeforeRouteUpdate(it => Anchor.jumpTo(it.query.anchor as string))

const container = ref<HTMLElement>()
const source = ref('')
const content = ref('')

watch(source, () => {
    const $ = cheerio.load(markdown.render(source.value))

    // replace <img/> source  Todo: deal with other type?
    $('img').each((ignored, element) => {
        const src = $(element).attr('src')?.replace('\\', '/')
        if (src?.startsWith('./')) {
            $(element).attr('src', path.join(path.dirname(index), src.substring(1)))
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
        $(element).append('<i class="fa-solid fa-link"></i>')
    })

    content.value = $.html()
    emit('update-toc', root)

    nextTick(() => {
        Anchor.jumpTo(route.query.anchor as string)

        if (container.value) {
            container.value.querySelectorAll(':is(h2, h3, h4)').forEach(element => {
                element.addEventListener('click', () => {
                    Anchor.jumpTo(element.id, false)
                })
            })
        }
    })
})

axios.get(index).then(resp => {
    source.value = resp.data
})
</script>

<style lang="less" scoped>
.markdown {
    :deep(:is(h2, h3, h4)) {
        position: relative;
        display: flex;
        align-items: center;
        @offset: -1.5em;

        > i {
            position: absolute;
            transform: scale(0.8);
            left: @offset;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            visibility: hidden;
        }

        &:hover > i {
            opacity: 1;
            visibility: visible;
        }

        &::before {
            content: '';
            position: absolute;
            left: @offset;
            width: 1em;
            height: 1em;
        }
    }

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
