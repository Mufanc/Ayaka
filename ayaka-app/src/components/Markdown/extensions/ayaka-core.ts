import type { Extension } from '.'
import { TocTree } from '@/components/Markdown'
import 'animate.css'
import encoder from 'base-x'
import path from 'path'
import type { RouteLocationNormalized, Router } from 'vue-router'

function b58encode(str: string) {
    const base58 = encoder('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
    return base58.encode(new TextEncoder().encode(str))
}

class Anchor {
    // Todo: no animate when click <h*> tags
    private router: Router
    jumpTo(route: RouteLocationNormalized) {
        if (typeof route.query.anchor !== 'string') return

        const anchor = route.query.anchor
        const target = document.getElementById(anchor)
        if (!target) return

        target.scrollIntoView()

        const animator = ['animate__animated', 'animate__flash']
        target.classList.add(...animator)
        setTimeout(() => {
            target.classList.remove(...animator)
        }, 1000)
    }
    constructor(router: Router) {
        this.router = router
    }
}

class Ayaka implements Extension {
    private router?: Router
    private route?: RouteLocationNormalized
    private tocTree?: TocTree
    private updateToc?: (toc: TocTree) => void
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

    onRegisterEmits(register: (event: string) => (...args: any[]) => void): void {
        this.updateToc = register('update-toc')
    }

    onRendered($: cheerio.Root): void {
        // replace <img/> source  Todo: deal with other type?
        $('img').each((ignored, element) => {
            const attr = $(element).attr('src')?.replace('\\', '/')
            if (attr?.startsWith('./')) {
                $(element).attr('src', path.join(this.route!.path, attr.substring(1)))
            }
        })

        // TOC
        const root = new TocTree()

        let stack: TocTree[] = [root]
        $('body > :is(h2, h3, h4)').each((...[, element]) => {
            const layer = parseInt((element as any).name.substring(1)) - 1

            while (stack[stack.length - 1].layer >= layer) {
                stack.pop()
            }

            const parent = stack[stack.length - 1]

            const name = $(element).text()
            const id = b58encode(name)

            const node = {
                name,
                id: parent.id ? `${parent.id}.${id}` : id,
                children: [],
                layer,
            }

            stack[stack.length - 1].children.push(node)
            stack.push(node)

            $(element).attr('id', node.id)
            $(element).append('<i class="fa-solid fa-link"></i>')
        })

        this.tocTree = root

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

        if (this.tocTree) {
            this.updateToc?.call(null, this.tocTree)
        }

        this.anchor!.jumpTo(this.route!)
        container.querySelectorAll(':is(h2, h3, h4)').forEach(element => {
            element.addEventListener('click', () => {
                this.router!.replace({ query: { anchor: element.id } }).catch((err) => {
                    console.error(err)
                })
            })
        })

        container.querySelectorAll('pre').forEach(element => {
            element.addEventListener('wheel', (event) => {
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
