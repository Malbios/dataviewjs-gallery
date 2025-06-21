import { App } from 'obsidian'

import { DataviewApi } from './interfaces'

declare global {
	const app: App

	const dv: DataviewApi

	const input: {
		preset: string
	}
}

export { }
