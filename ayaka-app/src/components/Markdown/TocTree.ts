export interface TocTree {
    name: string
    id: string
    children: TocTree[]
    layer: number
}

export class TocTree {
    constructor() {
        this.name = ''
        this.id = ''
        this.children = []
        this.layer = 0
    }
}
