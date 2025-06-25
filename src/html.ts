export function renderLabel(parent: HTMLDivElement, text: string, htmlFor: string | null = null) {

	const labelNode = document.createElement('label')
	labelNode.innerText = text

	if (htmlFor)
		labelNode.htmlFor = htmlFor

	parent.appendChild(labelNode)
}

export function renderText(parent: HTMLDivElement, containerClass: string, text: string, tooltip: string | null = null) {

	const containerNode = document.createElement('div')
	containerNode.className = containerClass

	if (tooltip)
		containerNode.title = tooltip

	const textNode = document.createTextNode(text)

	containerNode.appendChild(textNode)

	parent.appendChild(containerNode)
}

export function renderButton(parent: HTMLDivElement, label: string, onClick: ((buttonNode: HTMLButtonElement) => Promise<void>) | ((buttonNode: HTMLButtonElement) => void), tooltip: string | null = null, isDisabled = false, className: string | null = null) {

	const buttonNode = document.createElement('button')
	buttonNode.innerText = label
	buttonNode.disabled = isDisabled

	if (tooltip)
		buttonNode.title = tooltip

	buttonNode.onclick = async () => await onClick(buttonNode)

	if (!className) {
		parent.appendChild(buttonNode)
		return
	}

	const container = document.createElement('div')
	container.className = className

	container.appendChild(buttonNode)

	parent.appendChild(container)
}

export function renderCheckboxInput(parent: HTMLDivElement, id: string, getValue: () => boolean, onChange: (isChecked: boolean) => void) {

	const node = document.createElement('input')
	node.type = 'checkbox'
	node.id = id
	node.checked = getValue()

	node.onchange = () => onChange(node.checked)

	parent.appendChild(node)
}

export function renderRadioInput(parent: HTMLDivElement, radioId: string, radioName: string, isChecked: boolean, onChange: () => void) {

	const radioNode = document.createElement('input')
	radioNode.type = 'radio'
	radioNode.id = radioId
	radioNode.name = radioName
	radioNode.checked = isChecked

	radioNode.onchange = onChange

	parent.appendChild(radioNode)
}

export function renderImage(parent: HTMLDivElement, resourcePath: string, width: number) {

	const imageNode = document.createElement('img')
	imageNode.src = resourcePath
	imageNode.width = width

	parent.appendChild(imageNode)
}