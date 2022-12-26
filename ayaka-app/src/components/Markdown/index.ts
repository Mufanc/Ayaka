export { default as Markdown } from './Markdown.vue'

export interface Article {
    uuid: string
    article_name: string
    date: string
    description: string
    categories: string[] | null
    plugins: string[] | null
}
