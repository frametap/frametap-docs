## FrameTap Docs

- This repository is a VitePress documentation site.
- Preserve the existing LLM copy/download buttons that appear at the top of each docs page.
- Every new documentation page should continue to render the `CopyOrDownloadAsMarkdownButtons` UI automatically.
- Do not remove or bypass the `vitepress-plugin-llms` integration in `docs/.vitepress/config.mjs`.
- Do not remove or rename the global `CopyOrDownloadAsMarkdownButtons` component registration in `docs/.vitepress/theme/index.js` unless replacing it with an equivalent implementation on every page.
- When changing page layouts, themes, markdown rendering, or theme components, verify the page-level LLM copy/download buttons still appear.
- If a change would disable those buttons for some or all pages, restore that behavior before finishing.
