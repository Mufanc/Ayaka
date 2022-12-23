<template>
    <div v-if="hierarchy.anchor" @click="jump($router, hierarchy.anchor)">{{ hierarchy.name }}</div>
    <ul v-if="hierarchy.children.length">
        <li
            v-for="it in hierarchy.children"
            :key="it.anchor"
            class="toc-item"
            :class="bindClass(it)"
        >
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

function bindClass(node: TocTree) {
    return Object.fromEntries([
        [`toc-layer-${node.layer}`, true],
        ['active', node.active],
    ])
}
</script>

<style lang="less" scoped>
.toc-item {
    margin-top: 1em;

    > div {
        line-height: 1em;
    }

    &:is(.active) > div {
        color: red;
        font-weight: bold;
    }
}

.toc-item::before {
    content: '';
    float: left;
    background-color: #000;
    height: 0.25em;
    border-radius: $height;
    margin-right: 0.5em;
    margin-top: 0.5em;
    transform: translateY(-50%);
}

#width(@width) {
    width: @width;
    margin-right: calc(2em - @width + 0.5em);
}

.toc-layer-1::before {
    #width(1.6em);
}

.toc-layer-2::before {
    #width(1.2em);
}

.toc-layer-3::before {
    #width(0.8em);
}
</style>
