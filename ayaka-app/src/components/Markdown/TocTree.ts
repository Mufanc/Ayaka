export class TocTree {
    active: boolean = false
    readonly name: string = ''
    readonly anchor: string = ''
    readonly children: TocTree[] = []
    readonly layer: number = 0
    readonly $root = this
    readonly $record = new Map<string, TocTree>()
    constructor(init: { [key: string]: any } = {}) {
        Object.assign(this, init)
        this.$root.$record.set(this.anchor, this)
    }
    mark(anchor: string) {
        this.$record.forEach(it => (it.active = false))
        const target = this.$record.get(anchor)
        target && (target.active = true)
    }
}
