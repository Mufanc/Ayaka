import encoder from 'base-x'
import * as cheerio from 'cheerio'

function b58encode(str: string) {
    const base58 = encoder('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
    return base58.encode(new TextEncoder().encode(str))
}

export class TocTree {
    active: boolean = false
    readonly name: string = ''
    readonly anchor: string = ''
    readonly children: TocTree[] = []
    readonly layer: number = 0
    readonly parent: TocTree | undefined = undefined
    readonly $root = this
    readonly $record = new Map<string, TocTree>()
    constructor(init: { [key: string]: any } = {}) {
        Object.assign(this, init)
        this.$root.$record.set(this.anchor, this)
    }
    mark(anchor: string) {
        this.$record.forEach(it => (it.active = false))
        let target = this.$record.get(anchor)
        while (target) {
            target.active = true
            target = target.parent
        }
    }
    static from($: cheerio.Root): TocTree {
        const root = new TocTree()
        const stack: TocTree[] = [root]

        $('body > :is(h2, h3, h4)').each((...[, element]) => {
            const layer = parseInt((element as any).name.substring(1)) - 1

            while (stack[stack.length - 1].layer >= layer) {
                stack.pop()
            }

            const parent = stack[stack.length - 1]

            const name = $(element).text()
            const anchor = b58encode(name)

            const node = new TocTree({
                name,
                layer,
                parent,
                anchor: parent.anchor ? `${parent.anchor}.${anchor}` : anchor,
                $root: stack[0],
            })

            stack[stack.length - 1].children.push(node)
            stack.push(node)

            $(element)
                .attr('id', node.anchor)
                .addClass('animate__animated')
                .append('<i class="fa-solid fa-link"></i>')
        })

        return root
    }
}
