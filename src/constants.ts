export const Preset = {
	PROMPTS_OTHER: 'prompts-other',
	PROMPTS_MINE: 'prompts-mine',
	STYLES: 'styles',
} as const

export type PresetKey = keyof typeof Preset
export type PresetValue = typeof Preset[PresetKey]

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
	PRESET: 'preset',
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

export const Position = {
	TOP: 'top',
	BOTTOM: 'bottom',
} as const

export type PositionKey = keyof typeof Position
export type PositionValue = typeof Position[PositionKey]