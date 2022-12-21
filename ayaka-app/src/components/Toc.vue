<template>
    <span @click="jump($router, hierarchy.id)">{{ hierarchy.name }}</span>
    <ul v-for="it in hierarchy.children">
        <li><Toc :hierarchy="it" /></li>
    </ul>
</template>

<script setup lang="ts">
import { TocTree } from '@/components/TocTree'
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

<style lang="less" scoped></style>
