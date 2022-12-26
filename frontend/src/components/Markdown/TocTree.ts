import encoder from 'base-x'
import * as cheerio from 'cheerio'

function b58encode(str: string) {
    const base58 = encoder('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
    return base58.encode(new TextEncoder().encode(str))
}

export class TocTree {
    active: boolean = false
    center: boolean = false
    readonly name: string = ''
    readonly anchor: string = ''
    readonly children: TocTree[] = []
    readonly layer: number = 0
    readonly parent: TocTree | undefined = undefined
    protected constructor(init: { [key: string]: any } = {}) {
        Object.assign(this, init)
    }
}

export class TocRoot extends TocTree {
    private readonly record: [string, TocTree][] = []
    constructor(init: { [key: string]: any } = {}) {
        super(init)
    }
    static from($: cheerio.Root): TocTree {
        const root = new TocRoot()
        const stack: TocTree[] = [root]

        $('body > :is(h2, h3, h4)').each((...[, element]) => {
            const layer = parseInt((element as any).name.substring(1)) - 1

            while (stack[stack.length - 1].layer >= layer) {
                stack.pop()
            }

            const parent = stack[stack.length - 1]

            const name = $(element).text()
            const anchor = (parent.anchor ? `${parent.anchor}.` : '') + b58encode(name)

            const node = new TocTree({ name, layer, parent, anchor })

            root.record.push([anchor, node])
            stack[stack.length - 1].children.push(node)
            stack.push(node)

            $(element).attr('id', node.anchor)
        })

        return root
    }

    mark(id: string): number {
        let center = -1

        this.record.forEach(([anchor, node], index) => {
            node.active = false
            node.center = false
            if (id.startsWith(anchor)) {
                node.active = true
                center = index
            }
        })

        if (center != -1) {
            this.record[center][1].center = true
        }

        return center
    }
}
