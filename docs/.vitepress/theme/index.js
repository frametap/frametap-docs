import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'
import TerminalBlock from './TerminalBlock.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the component for copy/download buttons (injected at top of page)
    app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)
    // Register terminal component
    app.component('TerminalBlock', TerminalBlock)
  }
}
