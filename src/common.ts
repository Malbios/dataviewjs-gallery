import { type TAbstractFile, type TFile } from 'obsidian'
import { Origin, Preset, Setting, ViewMode } from './constants'
import { type DataviewPage, type SortPages } from './interfaces'
import { Configuration, PersistedConfigurations, PersistedPresetSettings } from './types'

const configFilePath = 'System/Scripts/gallery/config.json'

export async function updatePersistedConfigValue<K extends keyof PersistedPresetSettings>(
	preset: keyof PersistedConfigurations,
	name: K,
	value: PersistedPresetSettings[K]
) {
	const raw = JSON.parse(await app.vault.adapter.read(configFilePath))
	const configurations = raw as PersistedConfigurations
	configurations[preset][name] = value
	await app.vault.adapter.write(configFilePath, JSON.stringify(configurations, null, 2))
}

async function getPersistedPresetSettings(preset: keyof PersistedConfigurations): Promise<PersistedPresetSettings> {

	const raw = await app.vault.adapter.read(configFilePath)
	const configurations = JSON.parse(raw) as PersistedConfigurations
	return configurations[preset]
}

function getDefaultConfig(preset: string, persistedPresetSettings: PersistedPresetSettings, previousConfig: Configuration | null = null): Configuration {

	const asyncNoop = async (): Promise<void> => { }

	return {
		[Setting.RESET_GALLERY]: previousConfig?.[Setting.RESET_GALLERY] ?? asyncNoop,

		[Setting.PRESET]: preset,

		[Setting.CURRENT_PAGE_NUM]: previousConfig ? previousConfig[Setting.CURRENT_PAGE_NUM] : 1,

		[Setting.ITEMS]: previousConfig ? previousConfig[Setting.ITEMS] : [],
		[Setting.TOTAL_PAGES]: previousConfig ? previousConfig[Setting.TOTAL_PAGES] : -1,

		[Setting.VIEW_MODE]: persistedPresetSettings[Setting.VIEW_MODE],
		[Setting.SHOW_TAGS]: persistedPresetSettings[Setting.SHOW_TAGS],

		[Setting.PAGE_SORT]: getPageSort(preset),

		[Setting.ITEMS_PER_ROW]: 6,

		[Setting.ITEMS_PER_PAGE]: 0,
		[Setting.ORIGIN]: '',
		[Setting.ROOT_PATH]: '',
	}
}

export async function getConfig(inputPreset: keyof PersistedConfigurations, previousConfig: Configuration | null = null): Promise<Configuration> {

	let persistedConfig = await getPersistedPresetSettings(inputPreset)

	let config = getDefaultConfig(inputPreset, persistedConfig, previousConfig)

	if (inputPreset === Preset.PROMPTS_OTHER) {
		config[Setting.ITEMS_PER_PAGE] = 12
		config[Setting.ORIGIN] = Origin.OTHER
		config[Setting.ROOT_PATH] = 'AI/Sora/Databases/Prompts'
	} else if (inputPreset === Preset.PROMPTS_MINE) {
		config[Setting.ITEMS_PER_PAGE] = 12
		config[Setting.ORIGIN] = Origin.MINE
		config[Setting.ROOT_PATH] = 'AI/Sora/Databases/Prompts'

	} else if (inputPreset === Preset.STYLES) {
		config[Setting.ITEMS_PER_PAGE] = -1
		config[Setting.ORIGIN] = Origin.BOTH
		config[Setting.ROOT_PATH] = 'AI/Sora/Databases/Styles'
	} else {
		throw new Error(`getConfig(): unexpected gallery inputPreset: ${inputPreset}`)
	}

	return config
}

export function includePage(page: DataviewPage, viewMode: string, origin: string) {

	if (viewMode === ViewMode.SFW && page.file.tags?.includes('#nsfw'))
		return false

	if (viewMode === ViewMode.NSFW && !page.file.tags?.includes('#nsfw'))
		return false

	if (origin === Origin.MINE && !page.file.tags?.includes('#mine'))
		return false

	if (origin === Origin.OTHER && page.file.tags?.includes('#mine'))
		return false

	return true
}

function compareTimestamps(pageA: DataviewPage, pageB: DataviewPage) {

	function getDate(p: DataviewPage): Date {
		let str = p?.timestamp?.replace(' ', 'T')
		let date = str ? new Date(str) : new Date(0)

		return date
	}

	let diff = getDate(pageA).getTime() - getDate(pageB).getTime()

	if (diff > 0)
		return 1

	if (diff < 0)
		return -1

	return 0
}

function compareFavorites(pageA: DataviewPage, pageB: DataviewPage) {

	if (pageA.file?.tags?.includes('#fav') !== pageB.file?.tags?.includes('#fav'))
		return pageA.file?.tags?.includes('#fav') ? -1 : 1

	return 0
}

function compareDescriptions(pageA: DataviewPage, pageB: DataviewPage) {

	return pageA.description?.localeCompare(pageB.description ?? '', undefined, { sensitivity: 'base' }) ?? 0
}

function sortPrompts(pageA: DataviewPage, pageB: DataviewPage): number {

	return compareTimestamps(pageB, pageA)
}

function sortStyles(pageA: DataviewPage, pageB: DataviewPage): number {

	let favoriteComparison = compareFavorites(pageA, pageB)

	if (favoriteComparison !== 0)
		return favoriteComparison

	return compareDescriptions(pageA, pageB)
}

export function getPageSort(preset: string): SortPages {

	switch (preset) {
		case Preset.PROMPTS_OTHER:
		case Preset.PROMPTS_MINE:
			return sortPrompts
		case Preset.STYLES:
			return sortStyles
		default:
			throw new Error(`getPageSort(): unexpected gallery preset: ${preset}`)
	}
}

export function createUniqueId(prefix = 'id') {

	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export function asTFile(file: TAbstractFile | null): TFile | null {
	if (file && file instanceof Object && 'extension' in file)
		return file as TFile

	return null
}

function getExtension(filename: string) {
	return filename
		.split('?')[0]
		.split('#')[0]
		.split('.')
		.pop()
		?.toLowerCase() || ''
}

export function getFileType(filename: string) {

	const ext = getExtension(filename)

	const images = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif'])

	const videos = new Set(['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'ogv'])

	if (images.has(ext))
		return 'image'

	if (videos.has(ext))
		return 'video'

	return 'unknown'
}
