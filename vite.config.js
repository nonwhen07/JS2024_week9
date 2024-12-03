import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';

// 先移除 'vite-plugin-live-reload' 因為尚未支援vite6版本，請vite不一定需要 vite-plugin-live-reload
//import liveReload from 'vite-plugin-live-reload';

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig({
  // base 的寫法：
  // base: '/Repository 的名稱/'
  base: '/JS2024_week9/',
  plugins: [
    // 移除了 liveReload 插件
    //liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
    ViteEjsPlugin(),
    moveOutputPlugin(),
  ],
  server: {
    // 啟動 server 時預設開啟的頁面
    open: 'pages/index.html',
    // 因移除了 liveReload 插件 而需要 watch 來監聽
    watch: {
      // 監聽額外的文件變化（如 .ejs 和 .html）
      ignored: ['!./layout/**/*.ejs', '!./pages/**/*.ejs', '!./pages/**/*.html'],
    },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('pages/**/*.html')
          .map((file) => [
            path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
    outDir: 'dist',
  },

  define: {
    'process.env': process.env
  },
});
