import * as cheerio from 'cheerio'
import type { RouteLocationNormalized, Router } from 'vue-router'

export interface Extension {
    injectStyle: boolean
    onLoad?: (router: Router, route: RouteLocationNormalized) => void
    onBeforeRouteUpdate?: (route: RouteLocationNormalized) => void
    onRegisterEmits?: (register: (event: string) => ((...args: any[]) => void)) => void
    onRendered?: ($: cheerio.Root) => void
    onViewUpdated?: (root: HTMLElement) => void
}
