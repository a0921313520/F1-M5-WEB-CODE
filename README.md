# F1-M5-WEB

## Table of Contents

-   [📚 Features](#features)
-   [Key Scripts Overview](#key-scripts-overview)
-   [🎨 Styling and Design System](#styling-and-design-system)
-   [Editor Configuration](#editor-configuration)
-   [Project Structure](#project-structure)
-   [Other](#other)

## Features

-   ✨ **[ESLint](https://eslint.org/)** and **[Prettier](https://prettier.io/)**: Maintain clean, consistent, and error-free code.
-   🩹 **[Patch-package](https://www.npmjs.com/package/patch-package)**: Easily fix and patch external dependencies.
-   🚀 **[GitHub Actions](https://github.com/features/actions)**: Pre-configured actions for seamless workflows, including bundle size and performance statistics.
-   **[Zustand](https://zustand.surge.sh/)**: Simplified state management for React.
-   **[Redux](https://redux.js.org/)**: Predictable state management for JavaScript apps.
-   **[Sass](https://sass-lang.com/)**: Powerful CSS preprocessor for better styling.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
-   **[next-i18next](https://github.com/isaachinman/next-i18next)** and **[next-language-detector](https://github.com/i18next/next-language-detector)**: Comprehensive internationalization support for Next.js.

### Key Points:

-   Redux and Zustand coexist, with Redux primarily for centralized use.
-   Both Less and Sass are installed, with Less mainly for compatibility with antd styles.
-   RWD supported with Tailwind CSS.
-   next-i18next does not support SSG, using [this solution](https://locize.com/blog/next-i18n-static/).

## Key Scripts Overview

-   **`dev`**: Starts the development server with colorized output.
-   **`postinstall`**: Applies patches to external dependencies.
-   **`format`**: Formats the code with Prettier.

## 🎨 Styling and Design System

-   RWD
-   Tailwind CSS
-   SCSS

## Editor Configuration

### VSCode

For VSCode users, settings are pre-configured to automatically format your code on save.

### Other Editors

For users of other editors, configure your editor to use ESLint and Prettier for formatting. Refer to their respective documentation for setup instructions.

## Project Structure

```sh
.
├── actions/
├── components/
├── config
├── data
├── lib
├── pages/
├── postcss.config.js
├── prettier.config.js
├── public
│   ├──
│   └── favicon
├── i18n
│   ├── en.ts
│   ├── index.ts
│   └── zh.ts
├── renovate.json
├── redux/
│   ├── thunks/
│   │   ├── gameThunk.js
│   │   ├── promotionThunk.js
│   ├── slices/
│   │   ├── gameSlice.js
│   │   ├── promotionSlice.js
│   │   ├── spinSlice.js
│   │   ├── userCenterSlice.js
│   └── store.js
├── zustand
├── styles
├── utils
│   ├── api.ts
|   ├── ...
│   └── toasts.ts
├── package.json


```

## Other

### A: WebP Format

1. Generate WebP images using `webp.js`.
2. Run `node webp` in the terminal to generate images.

### B: SEO

1. SEO `title`, `Keywords`, `description`, and `footer` are fetched from API (https://strapistag1.fun88.biz/admin). Fallback to local data in `data/seo/seo.static.js`.
2. Use `ol` for SEO footer lists to include bullet points, reserving `ul` for other purposes.
3. Adding footer in the admin site might fail when styling with tags; use CSS directly in the project.

### C: Image Paths

1. In `.scss` files: `@{base-path}/img/xxx/xxx.png`
2. In HTML/JS: `${process.env.BASE_PATH}/img/xxx/xxx.png`
3. External links can be used directly without modifications.
4. Paths are configured in `next.config.js`.
