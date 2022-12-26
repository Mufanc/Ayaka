import { Extension } from '.'
import render from 'katex/contrib/auto-render'

class Katex implements Extension {
    injectStyle = true
    onViewUpdated(root: HTMLElement) {
        render(root, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
            ],
        })
    }
}

export default new Katex()
