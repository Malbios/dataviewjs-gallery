import { asTFile, createUniqueId, updatePersistedConfigValue } from './common'
import { Setting, ViewMode } from './constants'
import { renderButton, renderCheckboxInput, renderImage, renderLabel, renderRadioInput, renderText } from './html-nodes'
import { DataviewPage } from './interfaces'
import { Config } from './types'

let configsPanel: HTMLDivElement = document.createElement('div')
let configsBackdrop: HTMLDivElement = document.createElement('div')

function renderRadioComponent(parent: HTMLDivElement, containerClass: string, label: string, values: string[], getCurrentValue: () => string, setCurrentValue: (newValue: string) => void) {

	function setValueIfChanged(newValue: string) {
		if (getCurrentValue() === newValue) return

		setCurrentValue(newValue)
	}

	const containerNode = document.createElement('div')
	containerNode.className = containerClass

	renderLabel(containerNode, label)

	const radiosContainerNode = document.createElement('div')
	radiosContainerNode.className = 'radio-control-items'

	const radioName = createUniqueId()

	for (let i in values) {
		const value = values[i]
		const radioId = createUniqueId()

		const itemContainerNode = document.createElement('div')
		itemContainerNode.className = 'radio-control-item'

		itemContainerNode.onclick = () => setValueIfChanged(value)

		renderRadioInput(
			itemContainerNode,
			radioId,
			radioName,
			getCurrentValue() === value,
			() => setValueIfChanged(value),
		)

		renderLabel(itemContainerNode, value, radioId)

		radiosContainerNode.appendChild(itemContainerNode)
	}

	containerNode.appendChild(radiosContainerNode)

	parent.appendChild(containerNode)
}

function renderCheckboxComponent(parent: HTMLDivElement, containerClass: string, labelText: string, getValue: () => boolean, setValue: (newValue: boolean) => void) {

	const containerNode = document.createElement('div')
	containerNode.className = containerClass

	containerNode.onclick = () => setValue(!getValue())

	const checkboxId = createUniqueId()

	renderCheckboxInput(containerNode, checkboxId, getValue, setValue)

	renderLabel(containerNode, labelText, checkboxId)

	parent.appendChild(containerNode)
}

function renderImageComponent(parent: HTMLDivElement, page: DataviewPage) {

	function internalRender(parent: HTMLDivElement) {
		if (!page.image) {
			parent.textContent = 'no image'
			return
		}

		const imagePath = `System/Attachments/${page.image}`
		const abstractFile = app.vault.getAbstractFileByPath(imagePath)

		const file = asTFile(abstractFile)

		if (!file) {
			parent.textContent = `⚠️ Image not found: ${imagePath}`
			return
		}

		const resourcePath = app.vault.getResourcePath(file)

		parent.style.cursor = 'pointer'

		parent.onclick = (e: MouseEvent) => {
			if (!page.image)
				return

			e.preventDefault()
			app.workspace.openLinkText(page.image, '', true)
		}

		renderImage(parent, resourcePath, 200)
	}

	const containerNode = document.createElement('div')

	internalRender(containerNode)

	parent.appendChild(containerNode)
}

function renderPaginationComponent(paginationContainer: HTMLDivElement, tilesContainer: HTMLDivElement, config: Config) {

	function changePage(newPageNum: number) {
		config[Setting.CURRENT_PAGE_NUM] = newPageNum
		renderPageComponent(paginationContainer, tilesContainer, config)
	}

	const paginationText =
		`Page ${config[Setting.CURRENT_PAGE_NUM]} of ${config[Setting.TOTAL_PAGES]} (Total Items: ${config[Setting.ITEMS].length})`

	renderButton(paginationContainer, '⏮️', () => changePage(1),
		'Go to first page', config[Setting.CURRENT_PAGE_NUM] === 1)

	renderButton(paginationContainer, '⬅', () => changePage(--config[Setting.CURRENT_PAGE_NUM]),
		'Go to previous page', config[Setting.CURRENT_PAGE_NUM] === 1)

	renderText(paginationContainer, 'gallery-pagination-controls-text', paginationText)

	renderButton(paginationContainer, '➡', () => changePage(++config[Setting.CURRENT_PAGE_NUM]),
		'Go to next page', config[Setting.CURRENT_PAGE_NUM] === config[Setting.TOTAL_PAGES])

	renderButton(paginationContainer, '⏭️', () => changePage(config[Setting.TOTAL_PAGES]),
		'Go to last page', config[Setting.CURRENT_PAGE_NUM] === config[Setting.TOTAL_PAGES])
}

function renderCopyButton(parent: HTMLDivElement, page: DataviewPage) {

	let defaultLabel = '📋'

	let onClick = async (button: HTMLButtonElement) => {
		const abstractFile = app.vault.getAbstractFileByPath(page.file.path)

		const file = asTFile(abstractFile)

		if (!file)
			throw new Error(`tile button 'copy': could not find file: ${page.file.path}`)

		const rawText = await app.vault.read(file)
		const contentWithoutFrontmatter = rawText.replace(/^---[\s\S]*?---/, '').trim()

		navigator.clipboard.writeText(contentWithoutFrontmatter)
		button.innerText = '✅'

		setTimeout(() => (button.innerText = defaultLabel), 750)
	}

	renderButton(parent, defaultLabel, onClick, 'Copy prompt to clipboard')
}

function renderTileButtonsComponent(parent: HTMLDivElement, page: DataviewPage) {

	const tileButtonsContainer = document.createElement('div')
	tileButtonsContainer.className = 'gallery-tile-buttons'

	renderButton(tileButtonsContainer, '✏️', () => app.workspace.openLinkText(page.file.path, '', true), 'Edit item')

	renderCopyButton(tileButtonsContainer, page)

	parent.appendChild(tileButtonsContainer)
}

function renderTileComponent(rowContainer: HTMLDivElement, page: DataviewPage, showTags: boolean) {

	const tile = document.createElement('div')
	tile.className = 'gallery-tile'

	if (page.file.tags?.includes('#fav')) {
		tile.className += ' favorite-tile'
	}

	const tileFirstPart = document.createElement('div')
	tileFirstPart.className = 'gallery-tile-part1'

	if (page.description && page.description.length > 0) {
		const descriptionNode = document.createElement('div')
		descriptionNode.innerText = page.description
		descriptionNode.className = 'gallery-tile-description'
		tileFirstPart.appendChild(descriptionNode)
	}

	if (showTags && page.file.tags && page.file.tags.length > 0) {
		const tags = page.file.tags.map((tag: string) => `${tag}`).join(' ')
		const tagsNode = dv.el('span', tags)
		tileFirstPart.appendChild(tagsNode)
	}

	if (tileFirstPart.children.length > 0) {
		tile.appendChild(tileFirstPart)
	}

	const tileSecondPart = document.createElement('div')
	tileSecondPart.className = 'gallery-tile-part2'

	renderImageComponent(tileSecondPart, page)

	renderTileButtonsComponent(tileSecondPart, page)

	tile.appendChild(tileSecondPart)

	rowContainer.appendChild(tile)
}

export function renderSidebarComponent(parent: HTMLDivElement, config: Config) {

	renderButton(parent, '🔁', async () => await config[Setting.RESET_GALLERY](),
		'Refresh gallery', false, 'gallery-floating-refresh-button')

	renderButton(parent, '⚙️', () => {
		configsPanel.classList.toggle('active')
		configsBackdrop.style.display = configsPanel.classList.contains('active') ? 'block' : 'none'
	}, 'Open settings', false, 'gallery-floating-settings-toggler')

	renderConfigurationComponent(parent, config)
}

function renderConfigurationBackdrop(parent: HTMLDivElement) {
	configsBackdrop = document.createElement('div')
	configsBackdrop.className = 'gallery-config-backdrop'

	configsBackdrop.onclick = () => {
		configsPanel.classList.remove('active')
		configsBackdrop.style.display = 'none'
	}

	parent.appendChild(configsBackdrop)
}

function renderConfigurationComponent(parent: HTMLDivElement, config: Config) {

	renderConfigurationBackdrop(parent)

	configsPanel = document.createElement('div')
	configsPanel.className = 'gallery-config-controls'

	const titleContainer = document.createElement('div')
	titleContainer.className = 'gallery-config-controls-title'

	renderLabel(titleContainer, 'Gallery Settings')

	configsPanel.appendChild(titleContainer)

	const containerNode = document.createElement('div')
	containerNode.className = 'gallery-config-controls-items'

	async function updatePersistedValue<T>(name: string, value: T) {
		await updatePersistedConfigValue(name, value)
		await config[Setting.RESET_GALLERY]()
	}

	renderRadioComponent(containerNode, 'gallery-config-controls-item gallery-config-controls-view-mode', 'View Mode',
		[ViewMode.ALL, ViewMode.SFW, ViewMode.NSFW],
		() => config[Setting.VIEW_MODE],
		async (newValue: string) => await updatePersistedValue(Setting.VIEW_MODE, newValue))

	renderCheckboxComponent(containerNode, 'gallery-config-controls-item gallery-config-controls-tags', 'Show Tags',
		() => config[Setting.SHOW_TAGS],
		async (newValue: boolean) => await updatePersistedValue(Setting.SHOW_TAGS, newValue))

	configsPanel.appendChild(containerNode)

	parent.appendChild(configsPanel)
}

export function renderPageComponent(paginationContainer: HTMLDivElement, tilesContainer: HTMLDivElement, config: Config) {

	paginationContainer.innerHTML = ''
	tilesContainer.innerHTML = ''

	const start = (config[Setting.CURRENT_PAGE_NUM] - 1) * (config[Setting.ITEMS_PER_PAGE] < 0 ? 0 : config[Setting.ITEMS_PER_PAGE])
	const end = start + (config[Setting.ITEMS_PER_PAGE] < 0 ? config[Setting.ITEMS].length : config[Setting.ITEMS_PER_PAGE])
	const subset = config[Setting.ITEMS].slice(start, end)

	if (config[Setting.TOTAL_PAGES] > 1)
		renderPaginationComponent(paginationContainer, tilesContainer, config)

	let rowContainer = document.createElement('div')

	for (let i = 0; i < subset.length; i++) {
		const page = subset[i]

		if (i % config[Setting.ITEMS_PER_ROW] === 0) {
			rowContainer = document.createElement('div')
			rowContainer.className = 'gallery-row'
			tilesContainer.appendChild(rowContainer)
		}

		renderTileComponent(rowContainer, page, config[Setting.SHOW_TAGS])
	}
}