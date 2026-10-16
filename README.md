# Library App 

This is a small Library application (HTML/CSS/JS) for the assignment. It demonstrates managing a list of book objects, rendering them, and allowing users to add/edit/remove/toggle read status. It also includes persistence and import/export.

Features implemented
- Book constructor with unique id using `crypto.randomUUID()` (with fallback).
- `addBookToLibrary()` function to create and store books.
- `displayBooks()` to render the library as card UI.
- Per-card Remove and Toggle Read buttons.
- Edit book functionality (opens the same form prefilled).
- Add Book form implemented using a dialog with `event.preventDefault()` handling.
- Data saved to `localStorage` (auto-save/load).
- Export library to JSON (download) and Import from JSON (file input).
- "Clear" button to wipe the library (with confirmation).
- Accessibility improvements: labels, aria-live region for book container, focus management.
- Small responsive CSS and form validation.

How to run
1. Put these files in a single folder:
   - index.html
   - styles.css
   - script.js
   - README.md
2. Open `index.html` in a modern browser.
3. Use "New Book" to add a book. Edit / Remove / Toggle Read from each card.
4. Export downloads library.json. Import will replace current library (prompts for confirmation).

Notes for graders
- No server required; all client-side.
- localStorage persistence: the library will persist between reloads in the same browser.
- If you want to reset to the seeded sample books, clear localStorage for the site or use the Clear button.

Extra ideas (optional)
- Add cover images (upload or URL)
- Add sorting/filtering UI
- Replace dialog with a custom modal manager or animate transitions

If you want, I can:
- Package this into a zip for download,
- Add unit tests (e.g., small Jest tests around the Book object and storage functions),
- Or convert this to ES modules and add a simple build step.

Good luck with your submission!
