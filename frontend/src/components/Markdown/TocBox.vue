<template>
    <div class="wrap" ref="wrap">
        <Toc :hierarchy="props.hierarchy" />
    </div>
</template>

<script setup lang="ts">
import Toc from '@/components/Markdown/Toc.vue'
import { TocTree } from '@/components/Markdown/TocTree'
import { computed } from 'vue'

const props = defineProps<{
    center: number
    hierarchy: TocTree
}>()

const height = 7
const expandHeight = height * 2 + 1

const boxHeight = height * 2 + 'em'
const boxExpandHeight = expandHeight * 2 + 'em'

const boxTranslateY = computed(() => {
    return `calc(-${props.center * 2}em + ${height - (height & 1)}em)`
})

const boxExpandTranslateY = computed(() => {
    return `calc(-${props.center * 2}em + ${expandHeight - (expandHeight & 1)}em)`
})
</script>

<style lang="less" scoped>
.wrap {
    display: flex;
    width: calc(100% - 2em);
    height: v-bind(boxHeight);
    overflow: hidden;

    > :deep(ul) {
        transform: translateY(v-bind(boxTranslateY));
    }

    &,
    :deep(*),
    :deep(*::before) {
        transition: all 0.5s ease-in-out;
    }

    &:hover {
        height: v-bind(boxExpandHeight);
        > :deep(ul) {
            transform: translateY(v-bind(boxExpandTranslateY));
        }
    }
}
</style>
