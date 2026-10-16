// script.js
const STORAGE_KEY = 'libraryApp:books'
let library = []
let editIndex = null

const cards = document.getElementById('cards')
const newBookBtn = document.getElementById('newBookBtn')
const modal = document.getElementById('modal')
const bookForm = document.getElementById('bookForm')
const titleInput = document.getElementById('title')
const authorInput = document.getElementById('author')
const pagesInput = document.getElementById('pages')
const readInput = document.getElementById('read')
const cancelBtn = document.getElementById('cancelBtn')
const importBtn = document.getElementById('importBtn')
const exportBtn = document.getElementById('exportBtn')
const fileInput = document.getElementById('fileInput')

function saveLibrary(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(library))
}

function loadLibrary(){
  const raw = localStorage.getItem(STORAGE_KEY)
  if(raw){
    try{library = JSON.parse(raw) || []}catch(e){library = []}
  }else{library = []}
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]
  })
}

function render(){
  cards.innerHTML = ''
  library.forEach((b,i)=>{
    const el = document.createElement('article')
    el.className = 'card'
    el.innerHTML = `\n      <div class="tag">${b.read? 'Read':'Unread'}</div>\n      <h3>${escapeHtml(b.title)}</h3>\n      <p>${escapeHtml(b.author)}</p>\n      <p>${escapeHtml(b.pages)} pages</p>\n      <div class="actions">\n        <button data-action="toggle" data-i="${i}" class="btn">Toggle Read</button>\n        <button data-action="edit" data-i="${i}" class="btn">Edit</button>\n        <button data-action="remove" data-i="${i}" class="btn">Remove</button>\n      </div>\n    `
    cards.appendChild(el)
  })
}

function openModal(index = null){
  editIndex = (index === null) ? null : Number(index)
  if(editIndex === null){
    document.getElementById('modalTitle').textContent = 'New Book'
    titleInput.value = ''
    authorInput.value = ''
    pagesInput.value = ''
    readInput.checked = false
  }else{
    const b = library[editIndex]
    document.getElementById('modalTitle').textContent = 'Edit Book'
    titleInput.value = b.title
    authorInput.value = b.author
    pagesInput.value = b.pages
    readInput.checked = !!b.read
  }
  modal.classList.remove('hidden')
  titleInput.focus()
}

function closeModal(){
  modal.classList.add('hidden')
  editIndex = null
  bookForm.reset()
}

newBookBtn.addEventListener('click', ()=>openModal(null))
cancelBtn.addEventListener('click', closeModal)

bookForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const title = titleInput.value.trim()
  const author = authorInput.value.trim()
  const pages = parseInt(pagesInput.value,10) || 0
  const read = !!readInput.checked
  if(!title || !author || pages < 1) return

  const book = {title,author,pages,read}
  if(editIndex === null){
    library.push(book)
  }else{
    library[editIndex] = book
  }
  saveLibrary()
  render()
  closeModal()
})

cards.addEventListener('click', (e)=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const action = btn.dataset.action
  const i = Number(btn.dataset.i)
  if(action === 'toggle'){
    library[i].read = !library[i].read
    saveLibrary(); render()
  }else if(action === 'edit'){
    openModal(i)
  }else if(action === 'remove'){
    if(confirm('Remove this book?')){
      library.splice(i,1)
      saveLibrary(); render()
    }
  }
})

exportBtn.addEventListener('click', ()=>{
  const data = JSON.stringify(library,null,2)
  const blob = new Blob([data],{type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'library.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
})

importBtn.addEventListener('click', ()=>fileInput.click())
fileInput.addEventListener('change', (e)=>{
  const f = e.target.files && e.target.files[0]
  if(!f) return
  const reader = new FileReader()
  reader.onload = (ev)=>{
    try{
      const parsed = JSON.parse(ev.target.result)
      if(!Array.isArray(parsed)) throw new Error('Invalid format')
      if(confirm('Import will replace your current library. Continue?')){
        library = parsed.map(p=>({
          title:String(p.title||''),
          author:String(p.author||''),
          pages:Number(p.pages||0),
          read:!!p.read
        }))
        saveLibrary(); render()
      }
    }catch(err){
      alert('Failed to import: '+err.message)
    }
  }
  reader.readAsText(f)
  // reset input so same file can be selected again
  fileInput.value = ''
})

// Initialize
loadLibrary(); render()
