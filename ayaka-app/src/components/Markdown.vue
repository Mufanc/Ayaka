<template>
    <div class="markdown" v-html="replaceSrc($route.path)"></div>
</template>

<script setup lang="ts">
import axios from 'axios'
import * as cheerio from 'cheerio'
import highlight from 'highlight.js'
import 'highlight.js/styles/intellij-light.css'
import MarkdownIt from 'markdown-it'
import { ref } from 'vue'

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

const source = ref('')

function replaceSrc(path: string) {
    let $ = cheerio.load(markdown.render(source.value))
    $('img').each(function (this: cheerio.Element) {
        let src = $(this).attr('src')?.replace('\\', '/')
        if (src?.startsWith('./')) {
            $(this).attr('src', path + src.substring(2))
        }
    })
    return $.html()
}

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
        background-color: #fafafa; // Todo: extract to configs
    }

    :deep(code) {
        font-family: 'Consolas', 'monospace' !important;
    }
}
</style>
