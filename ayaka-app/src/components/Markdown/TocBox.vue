<template>
    <div class="wrap">
        <Toc :hierarchy="props.hierarchy" />
    </div>
</template>

<script setup lang="ts">
import Toc from '@/components/Markdown/Toc.vue'
import { TocTree } from '@/components/Markdown/TocTree'
import { computed } from 'vue'

const height = 9
const props = defineProps<{
    center: number
    hierarchy: TocTree
}>()

const boxHeight = height * 2 + 'em'
const boxTranslateY = computed(() => {
    return `calc(-${props.center * 2}em + ${height - (height & 1)}em)`
})
</script>

<style lang="less" scoped>
.wrap {
    font-size: 1.1em;
    height: v-bind(boxHeight);
    overflow: hidden;

    > :deep(ul) {
        transform: translateY(v-bind(boxTranslateY));
        transition: all 0.3s ease-in-out;
    }
}
</style>
