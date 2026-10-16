# Library App

A small single-page library app built with vanilla HTML, CSS, and JavaScript.

How to use

1. Clone or download the repository and open `index.html` in a modern browser.
2. Click "New Book" to add a book. You can edit, remove, or toggle the read status from each card.
3. "Export" downloads a `library.json` file of your current library.
4. "Import" lets you select a JSON file and will replace the current library (you'll be prompted to confirm before replacing).

Notes

- The app stores the library in localStorage under the key `libraryApp:books`.
- Import expects an array of objects with at least the fields: `title`, `author`, `pages`, and `read`.
