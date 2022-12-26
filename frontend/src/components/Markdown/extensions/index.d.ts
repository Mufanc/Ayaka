import * as cheerio from 'cheerio'
import type { RouteLocationNormalized, Router } from 'vue-router'
import type { PluginSimple } from 'markdown-it'

export interface Extension {
    injectStyle: boolean
    onLoad?: (router: Router, route: RouteLocationNormalized) => void
    onLoadMarkdownPlugin?: () => PluginSimple
    onMounted?: () => void
    onUnmounted?: () => void
    onBeforeRouteUpdate?: (route: RouteLocationNormalized) => void
    onRendered?: ($: cheerio.Root) => void
    onViewUpdated?: (root: HTMLElement) => void
}
