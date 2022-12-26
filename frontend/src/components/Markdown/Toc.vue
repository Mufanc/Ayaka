<template>
    <el-tooltip v-if="hierarchy.anchor" :visible="show" placement="top-start" effect="light">
        <template #content>
            <span>{{ hierarchy.name }}</span>
        </template>
        <div
            ref="title"
            class="toc-title"
            @mouseenter="mouseover = true"
            @mouseleave="mouseover = false"
            @click="jumpTo(hierarchy.anchor)"
        >
            {{ hierarchy.name }}
        </div>
    </el-tooltip>
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
import { computed, ref } from 'vue'

const title = ref<HTMLElement>()
const mouseover = ref(false)

const show = computed(() => {
    const element = title.value
    if (!element) return false
    return element.clientWidth < element.scrollWidth && mouseover.value
})

const { hierarchy } = defineProps<{
    hierarchy: TocTree
}>()

function jumpTo(anchor: string) {
    document.getElementById(anchor)?.scrollIntoView()
}

function bindClass(node: TocTree) {
    return Object.fromEntries([
        [`toc-layer-${node.layer}`, true],
        ['toc-active', node.active],
        ['toc-center', node.center],
    ])
}
</script>

<style lang="less" scoped>
.toc-title {
    white-space: nowrap;
    overflow: hidden;
}

.toc-item {
    padding-top: 1em;
    font-weight: bold;

    > div {
        line-height: 1em;
    }

    &::before,
    > div {
        opacity: 0.2;
        transform-origin: left;

        &:is(#toc-container:hover *) {
            opacity: 0.3;
        }
    }

    &:is(.toc-active)::before,
    &:is(.toc-active) > div {
        opacity: 0.7 !important;

        &:is(#toc-container:hover *) {
            opacity: 1;
        }
    }

    &:hover::before,
    &:hover > div {
        opacity: 0.7 !important;
    }

    &:is(.toc-center) > div {
        transform: scale(1.2);
    }
}

.toc-item::before {
    content: '';
    float: left;
    border-radius: 1em;
    background-color: #000;
    margin-top: 0.5em;
    transform: translateY(-50%);
}

@max-width: 1.6em;

#width(@width) {
    &::before {
        width: @width;
        height: calc(0.25em + (@max-width - @width) / 6);
        margin-right: calc(@max-width - @width + 1em);
    }
}

.toc-layer-1 {
    #width(@max-width);
}

.toc-layer-2 {
    #width(@max-width - 0.3em);
}

.toc-layer-3 {
    #width(@max-width - 0.6em);
}
</style>
