import { Setting } from './constants'
import { DataviewPage } from './interfaces'

export type Config = {
	[Setting.ITEMS_PER_ROW]: number
	[Setting.ITEMS_PER_PAGE]: number
	[Setting.ORIGIN]: string
	[Setting.ROOT_PATH]: string
	[Setting.PAGE_SORT]: (pageA: DataviewPage, pageB: DataviewPage) => number
	[Setting.ITEMS]: DataviewPage[]
	[Setting.TOTAL_PAGES]: number
	[Setting.CURRENT_PAGE_NUM]: number
	[Setting.VIEW_MODE]: string
	[Setting.SHOW_TAGS]: boolean
	[Setting.RESET_GALLERY]: () => Promise<void>
}

export type PersistedConfig = {
	[Setting.VIEW_MODE]: string
	[Setting.SHOW_TAGS]: boolean
}