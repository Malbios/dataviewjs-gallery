import { getConfig, includePage } from './common'
import { Setting } from './constants'
import { DataviewPage } from './interfaces'
import { Config } from './types'
import { renderPageComponent, renderSidebarComponent } from './ui-components'

let config: Config | null = null

async function resetGallery() {

	config = await getConfig(input.preset, config)

	config[Setting.RESET_GALLERY] = resetGallery

	await renderGallery()
}

async function renderGallery() {

	if (dv.container.innerHTML.length > 0)
		dv.container.innerHTML = ''

	if (!config)
		config = await getConfig(input.preset)

	let viewMode = config[Setting.VIEW_MODE]
	let origin = config[Setting.ORIGIN]

	config[Setting.ITEMS] = dv
		.pages(`"${config[Setting.ROOT_PATH]}/items"`)
		.filter((page: DataviewPage) => includePage(page, viewMode, origin))
		.array()
		.sort(config[Setting.PAGE_SORT])

	config[Setting.TOTAL_PAGES] =
		config[Setting.ITEMS_PER_PAGE] < 0
			? 1
			: Math.ceil(config[Setting.ITEMS].length / config[Setting.ITEMS_PER_PAGE])

	const galleryContainer = dv.container.createEl('div', {
		cls: 'gallery-container',
	})

	const paginationContainer = document.createElement('div')
	paginationContainer.className = 'gallery-pagination-controls'
	galleryContainer.appendChild(paginationContainer)

	const tilesContainer = document.createElement('div')
	tilesContainer.className = 'gallery'
	galleryContainer.appendChild(tilesContainer)

	renderPageComponent(paginationContainer, tilesContainer, config)

	renderSidebarComponent(galleryContainer, config)
}

(async () => {
	await resetGallery()
})()