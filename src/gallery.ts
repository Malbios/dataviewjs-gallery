import { getConfig, includePage } from './common'
import { Setting } from './constants'
import { DataviewPage } from './interfaces'
import { Configuration, PersistedConfigurations } from './types'
import { renderPageComponent, renderSidebarComponent } from './ui-components'

let config: Configuration | null = null

async function resetGallery() {

	config = await getConfig(input.preset as keyof PersistedConfigurations, config)

	config[Setting.RESET_GALLERY] = resetGallery

	await renderGallery()
}

async function renderGallery() {

	if (dv.container.innerHTML.length > 0)
		dv.container.innerHTML = ''

	if (!config)
		config = await getConfig(input.preset as keyof PersistedConfigurations)

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

	const topPaginationContainer = document.createElement('div')
	topPaginationContainer.className = 'gallery-pagination-controls'
	galleryContainer.appendChild(topPaginationContainer)

	const tilesContainer = document.createElement('div')
	tilesContainer.className = 'gallery'
	galleryContainer.appendChild(tilesContainer)

	const bottomPaginationContainer = document.createElement('div')
	bottomPaginationContainer.className = 'gallery-pagination-controls'
	galleryContainer.appendChild(bottomPaginationContainer)

	renderPageComponent(topPaginationContainer, tilesContainer, bottomPaginationContainer, config)

	renderSidebarComponent(galleryContainer, config)
}

(async () => {
	await resetGallery()
})()