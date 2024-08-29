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

-   Redux and Zustand coexist, with Redux primarily for Central-Payment use.
-   RWD
-   Tailwind CSS.
-   next-i18next does not support next export, using [this solution](https://locize.com/blog/next-i18n-static/).

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
├── components/
├── config
├── data/
├── pages/
├── public
│   ├── img/
│   └── locales/
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
├── prettier.config.js
├── package.json

```

### `components`

###### 1.Toast.js

目前只有 success 和 error

```javascript
import Toast from "@/common/Toast";

<button onClick={() => Toast.success("success")}>success</button>;
```

### `pages`

This directory contains all the routable pages in the app. Next.js automatically routes files in this directory to the corresponding URL.

### `public`

This directory contains all the static assets used in the app, such as images, fonts, etc. Like `pages`, Next.js automatically routes files in this directory to the corresponding URL.

### `public/locales`

i18n
This directory contains the translations for the app.

### `Toast`

目前只有 Success 和 error

```javascript
import Toast from "@/common/Toast";

<button onClick={() => Toast.success("success")}>success</button>;
```

### `styles`

目前是使用 tailwind css， 顏色、字體都在 tailwind.config.js 中。

### `utils`

##### 取得當前的路徑(不包含語言以及 queryString)

```javascript
import useCurrentPath from "$HOOKS/useCurrentPath";
const path = useCurrentPath();
console.log("當前路徑: ", path);
```

##### 判斷是否為桌面版

```javascript
import useIsDesktop from "$HOOKS/useIsDesktop";
const isDesktop = useIsDesktop();
console.log("是否為桌機: ", isDesktop); // 768px以上為桌面版
```

##### 切換頁面、切換語言

```javascript
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";
const { changeLanguage, navigateTo } = useLanguageNavigation();
//導向其他頁面功能(語言會跟著帶過去)
<button onClick={() => navigateTo("/login")}>登入</button>;

//切換語言功能
<button onClick={() => changeLanguage(en || hi)}>切換語言</button>;
```

### `services`

## Other

### B: SEO

1. SEO `title`, `Keywords`, `description`, and `footer` are fetched from API (https://strapistag1.fun88.biz/admin). Fallback to local data in `data/seo/seo.static.js`.
2. Use `ol` for SEO footer lists to include bullet points, reserving `ul` for other purposes.
3. Adding footer in the admin site might fail when styling with tags; use CSS directly in the project.

### C: Image Paths

1. In `.scss` files: `@{base-path}/img/xxx/xxx.png`
2. In HTML/JS: `${process.env.BASE_PATH}/img/xxx/xxx.png`
3. External links can be used directly without modifications.
4. Paths are configured in `next.config.js`.
