import esbuild from 'esbuild'

await esbuild.build({
	entryPoints: ['out-tsc/gallery.js'],
	bundle: true,
	format: 'iife',
	outfile: 'dist/gallery.js',
	platform: 'browser'
}).catch(() => process.exit(1))