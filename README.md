# Library App

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-green)](https://abdulrhmankhablil.github.io/library-app/)

A small single-page library app built with vanilla HTML, CSS, and JavaScript.

Live demo

- https://abdulrhmankhablil.github.io/library-app/

How to use

1. Clone or download the repository and open `index.html` in a modern browser.
2. Click "New Book" to add a book. You can edit, remove, or toggle the read status from each card.
3. "Export" downloads a `library.json` file of your current library.
4. "Import" lets you select a JSON file and will replace the current library (you'll be prompted to confirm before replacing).

Notes

- The app stores the library in localStorage under the key `libraryApp:books`.
- Import expects an array of objects with at least the fields: `title`, `author`, `pages`, and `read`.

Deployment

This repository is published to GitHub Pages from the `gh-pages` branch. The site should be available at the live demo URL above within a minute after this branch was created. If you don't see the site:

1. Visit the repository's Settings → Pages and confirm the publishing source is set to the `gh-pages` branch.
2. If you configured a custom domain, check the DNS settings and the `CNAME` file in the repository root.

