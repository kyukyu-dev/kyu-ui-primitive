import * as esbuild from 'esbuild'
import * as tsup from 'tsup'
import { globSync } from 'glob'

async function build(path) {
  const entryPoints = [`${path}/src/index.ts`]
  const dist = `${path}/dist`

  const esbuildConfig = {
    entryPoints,
    external: ['@kyu-ui/*'],
    packages: 'external',
    bundle: true,
    sourcemap: true,
    minify: true,
    format: 'cjs',
    target: 'es2022',
    outdir: dist,
  }

  console.log(`>> BUILD START - ${path}`)

  await esbuild.build(esbuildConfig)
  console.log(`>> CJS BUILT: ${path}/dist/index.js`)

  await esbuild.build({ ...esbuildConfig, format: 'esm', outExtension: { '.js': '.mjs' } })
  console.log(`>> MJS BUILT: ${path}/dist/index.mjs`)

  await tsup.build({
    entry: entryPoints,
    format: ['cjs', 'esm'],
    dts: { only: true },
    outDir: dist,
    silent: true,
    external: [/@kyu-ui\/.+/],
  })
  console.log(`>> D.TS BUILT: ${path}/dist/index.d.ts`)

  console.log(`>> BUILD END - ${path}`)
}

globSync('packages/*/*').forEach(build)
