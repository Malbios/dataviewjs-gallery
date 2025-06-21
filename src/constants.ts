export const Preset = {
	PROMPTS_OTHER: 'prompts-other',
	PROMPTS_MINE: 'prompts-mine',
	STYLES: 'styles',
} as const

export const Origin = {
	BOTH: 'both',
	MINE: 'mine',
	OTHER: 'other',
} as const

export const ViewMode = {
	ALL: 'all',
	SFW: 'sfw',
	NSFW: 'nsfw',
} as const

export const Setting = {
	ITEMS_PER_ROW: 'items-per-row',
	ITEMS_PER_PAGE: 'items-per-page',
	ORIGIN: 'origin',
	ROOT_PATH: 'root-path',
	PAGE_SORT: 'page-sort',
	ITEMS: 'items',
	TOTAL_PAGES: 'total-pages',
	CURRENT_PAGE_NUM: 'current-page-num',
	VIEW_MODE: 'view-mode',
	SHOW_TAGS: 'show-tags',
	RESET_GALLERY: 'reset-gallery',
} as const