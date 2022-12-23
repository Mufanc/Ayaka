import * as cheerio from 'cheerio'
import type { RouteLocationNormalized, Router } from 'vue-router'

export interface Extension {
    injectStyle: boolean
    onLoad?: (router: Router, route: RouteLocationNormalized) => void
    onMounted?: () => void
    onUnmounted?: () => void
    onBeforeRouteUpdate?: (route: RouteLocationNormalized) => void
    onRendered?: ($: cheerio.Root) => void
    onViewUpdated?: (root: HTMLElement) => void
}
