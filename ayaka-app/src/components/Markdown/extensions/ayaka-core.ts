import type { Extension } from '.'
import 'animate.css'
import path from 'path'
import type { RouteLocationNormalized, Router } from 'vue-router'

class Anchor {
    private router: Router
    jumpTo(route: RouteLocationNormalized) {
        if (typeof route.query.anchor !== 'string') return

        const anchor = route.query.anchor
        const target = document.getElementById(anchor)

        target?.scrollIntoView()

        let timer: number
        function listener() {
            timer && window.clearTimeout(timer)
            timer = window.setTimeout(() => {
                window.removeEventListener('scroll', listener)
                target?.classList.add('animate__flash')
                setTimeout(() => {
                    target?.classList.remove('animate__flash')
                }, 1000)
            }, 100)
        }
        window.addEventListener('scroll', listener)
    }
    constructor(router: Router) {
        this.router = router
    }
}

class Ayaka implements Extension {
    private router?: Router
    private route?: RouteLocationNormalized
    private anchor?: Anchor
    injectStyle = true
    onLoad(router: Router, route: RouteLocationNormalized) {
        this.router = router
        this.route = route
        this.anchor = new Anchor(router)
    }

    onBeforeRouteUpdate(route: RouteLocationNormalized): void {
        if (typeof route.query.anchor === 'string') {
            this.anchor!.jumpTo(route)
        }
    }

    onRendered($: cheerio.Root): void {
        // replace <img/> source  Todo: deal with other type?
        $('img').each((ignored, element) => {
            const attr = $(element).attr('src')?.replace('\\', '/')
            if (attr?.startsWith('./')) {
                $(element).attr('src', path.join(this.route!.path, attr.substring(1)))
            }
        })

        // better scrollbar
        const scrollbarStyle = [
            'scrollbar-thin',
            'scrollbar-thumb-gray-400',
            'scrollbar-track-gray-200',
        ].join(' ')

        $('pre').each((...[, element]) => {
            $(element).addClass(scrollbarStyle)
        })
    }

    onViewUpdated(container: HTMLElement): void {
        if (!container) return

        this.anchor!.jumpTo(this.route!)
        container.querySelectorAll(':is(h2, h3, h4)').forEach(element => {
            element.addEventListener('click', () => {
                element.classList.remove('animate__animated')
                setTimeout(() => {
                    element.classList.add('animate__animated')
                }, 1200)
                this.router!.replace({ query: { anchor: element.id } }).catch(err => {
                    console.error(err)
                })
            })
        })

        container.querySelectorAll('pre').forEach(element => {
            element.addEventListener('wheel', event => {
                if (element.scrollWidth > element.clientWidth) {
                    event.preventDefault()
                    // noinspection JSSuspiciousNameCombination
                    element.scrollLeft += event.deltaY
                }
            })
        })
    }
}

export default new Ayaka()
