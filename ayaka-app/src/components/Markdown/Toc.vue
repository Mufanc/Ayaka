<template>
    <div v-if="hierarchy.id" @click="jump($router, hierarchy.id)">{{ hierarchy.name }}</div>
    <ul v-if="hierarchy.children.length">
        <li v-for="it in hierarchy.children" :class="`toc-item toc-layer-${it.layer}`">
            <Toc :hierarchy="it" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { TocTree } from './TocTree'
import type { Router } from 'vue-router'

const { hierarchy } = defineProps<{
    hierarchy: TocTree
}>()

function jump(router: Router, anchor: string) {
    router.replace({
        query: { anchor },
    })
}
</script>

<style lang="less" scoped>
.toc-item {
    margin-top: 1em;
    font-weight: bold;

    > div {
        line-height: 1em;
    }
}

.toc-item::before {
    content: '';
    float: left;
    background-color: #000;
    height: 0.2em;
    border-radius: calc($height / 2);
    margin-top: 0.5em;
    transform: translateY(-50%);
}

#width(@width) {
    width: @width;
    margin-right: calc((1em - @width) + 0.5em);
}

.toc-layer-1::before {
    #width(1em);
}

.toc-layer-2::before {
    #width(0.8em);
}

.toc-layer-3::before {
    #width(0.6em);
}
</style>
