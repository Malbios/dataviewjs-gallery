export interface DVFileLink {
	path: string
	display?: string
	embed: boolean
	type: 'file' | 'header' | 'block'
}

export interface DataviewPage {
	file: {
		name: string
		path: string
		link: DVFileLink
		tags: string[] | null,
	},
	timestamp: string,
	image: string | null,
	description: string | null
}

export interface DataArray<T> {
	length: number
	get(index: number): T
	array(): T[]
	map<U>(callback: (value: T, index: number) => U): DataArray<U>
	filter(predicate: (value: T, index: number) => boolean): DataArray<T>
	forEach(callback: (value: T, index: number) => void): void
}

export interface DataviewApi {
	page(path: string): DataviewPage | null
	pages(query?: string): DataArray<DataviewPage>
	current(): DataviewPage
	el(tag: string, content: string): HTMLElement
	container: HTMLElement
}

export interface SortPages {
	(pageA: DataviewPage, pageB: DataviewPage): number
}