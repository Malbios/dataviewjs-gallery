import { execSync } from 'child_process'
import 'dotenv/config'

const SCRIPTS_VAULT_PATH = process.env.SCRIPTS_VAULT_PATH
const STYLING_VAULT_PATH = process.env.STYLING_VAULT_PATH

if (!SCRIPTS_VAULT_PATH) {
	console.error('❌ SCRIPTS_VAULT_PATH is not defined in .env')
	process.exit(1)
}

if (!STYLING_VAULT_PATH) {
	console.error('❌ STYLING_VAULT_PATH is not defined in .env')
	process.exit(1)
}

execSync(`npx cpy ./dist/gallery.js "${SCRIPTS_VAULT_PATH}"`, { stdio: 'inherit' })
execSync(`npx cpy ./files/config.json "${SCRIPTS_VAULT_PATH}"`, { stdio: 'inherit' })
execSync(`npx cpy ./files/styling/* "${STYLING_VAULT_PATH}"`, { stdio: 'inherit' })