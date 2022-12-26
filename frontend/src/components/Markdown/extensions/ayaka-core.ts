import type { Extension } from '.'
import 'animate.css'
import path from 'path'
import type { RouteLocationNormalized } from 'vue-router'

class Ayaka implements Extension {
    private route?: RouteLocationNormalized
    injectStyle = false
    onLoad(...[, route]: [any, RouteLocationNormalized]) {
        this.route = route
    }

    onRendered($: cheerio.Root): void {
        // replace <img/> source  Todo: deal with other types?
        $('img').each((ignored, element) => {
            const attr = $(element).attr('src')?.replace('\\', '/')
            if (attr?.startsWith('./')) {
                $(element).attr('src', path.join(this.route!.path, attr.substring(1)))
            }
        })
    }

    onViewUpdated(container: HTMLElement): void {
        if (!container) return

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
