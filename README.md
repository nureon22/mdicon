# Use Material Design SVG Icons

A lightweight and simple solution for using Material Design SVG icons in your websites, featuring automatic reload and local caching for improved performance.

## How it work?

This library uses Web Components to create a custom element <md-icon>. It:
  - Listens for attribute changes and update the icon automatically
  - Fetches icons dynamically from the Google Fonts API
  - Stores icons in local storage for 7 days

## Installation

### Using CDN

Add the following script to you HTML file.
```html
<script src="https://cdn.jsdelivr.net/npm/mdicon/dist/main.js"></script>
```

### Via NPM

Install the package named `mdicon`.

```sh
npm install mdicon
```

And them import it inside your source file.

```js
import MDIcon from "mdicon";
````

## Usage

```html
<md-icon icon="search"></md-icon>
```

Supported attributes:
  - icon   : Name of the icon (Required)
  - filled : Use filled version if the value is empty or true (Default false)
  - size   : Icon size in pixels without unit (Default 24)


## Preloading

When you need to use icons later on your website, you can preload those icons using following method to avoid loading delays when icons first appear.

```js
MDIcon.preloadIcons([
  { icon: "favorite", filled: true },
  { icon: "bookmark", filled: true },
  { icon: "home", filled: false },
]);
````
