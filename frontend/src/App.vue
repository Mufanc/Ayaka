<template>
    <router-view />
</template>

<script setup lang="ts">
// https://github.com/trivago/prettier-plugin-sort-imports/issues/191
</script>

<style lang="less">
#app {
    font-family: 'Noto Sans Mono', 'Noto Color Emoji', 'Noto Serif CJK SC', system-ui;
}

html {
    scroll-behavior: smooth;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #f3f4f6;
}

::-webkit-scrollbar-track {
    background-color: #f3f4f6;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d1d5db;
}
</style>
