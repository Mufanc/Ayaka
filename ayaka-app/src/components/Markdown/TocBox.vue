<template>
    <div class="wrap">
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

const boxHeight = height * 2 + 'em'
const boxTranslateY = computed(() => {
    return `calc(-${props.center * 2}em + ${height - (height & 1)}em)`
})
</script>

<style lang="less" scoped>
.wrap {
    overflow: hidden;

    @height: v-bind(boxHeight);
    height: @height;

    > :deep(ul) {
        transform: translateY(v-bind(boxTranslateY));
    }

    &,
    :deep(*),
    :deep(*::before) {
        transition: all 0.5s ease-in-out;
    }

    &:hover {
        height: calc(@height * 2);
    }
}
</style>
