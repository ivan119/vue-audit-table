import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'          // ← you forgot to import path!

export default defineConfig({
    plugins: [vue()],

    build: {
        lib: {
            // Correct entry point
            entry: path.resolve(__dirname, 'src/index.js'),

            // Name that will be used in UMD/IIFE builds
            name: 'AuditTable',

            // Correct file naming (you had .ts → wrong!)
            fileName: (format) => {
                switch (format) {
                    case 'es':   return 'audit-table.es.js'
                    case 'cjs':  return 'audit-table.cjs.js'
                    case 'umd':  return 'audit-table.umd.js'
                    default:     return 'audit-table.js'
                }
            },
            // Alternative shorter version:
            // fileName: 'audit-table',
        },

        rollupOptions: {
            // Externalize Vue so consumers provide it (peer dependency)
            external: ['vue'],

            output: {
                // For UMD builds – makes sure `window.Vue` is used
                globals: {
                    vue: 'Vue',
                },
                // THIS IS THE ONLY LINE THAT MATTERS FOR YOUR CASE
                assetFileNames: 'style.css',   // ← forces exactly dist/style.css
            },
        },

    },
})