'use strict';

const notesContainer = document.querySelector('.notes__container');
const addNotesTitle = document.querySelector('.add-notes__title');
const addNotesText = document.querySelector('.add-notes__text');
const addNotesButton = document.querySelector('.add-notes__button');
const buttonAddNote = document.querySelector('.button-add-note')
const overlay = document.querySelector('.overlay')
const addNoteDisplay = document.querySelector('.add-notes');
const editNoteDisplay = document.querySelector('.edit-note')
const viewNoteDisplay = document.querySelector('.view-note');
const deleteNoteModal = document.querySelector('.delete-note-modal')
const acceptDeleteButton = document.querySelector('.delete-note-modal__yes')
const noteActions = document.querySelector('.note__actions');

const editNoteTitle = document.querySelector('.edit-note__title')
const editNoteText = document.querySelector('.edit-note__text')
const editNoteSaveButton = document.querySelector('.edit-note__save')
const closeButton = document.querySelector('.view-note__close')
const viewNoteTitle = document.querySelector('.view-note__title');
const viewNoteText = document.querySelector('.view-note__note')

let notes = [];
let editted = 0;

const Note = function (title, note, id) {
  this.title = title;
  this.note = note;
  this.id = id;
}

const displayNote = function(note) {
  let noteEl = `
  <div class="note" data-id="${note.id}">
  <p class="note__title" data-id="${note.id}">
  ${note.title}
  </p>
  <div class="note__actions">

  <img src="images/icon-edit.png" alt="" class="note__edit icon" data-id="${note.id}">
  <img src="images/icon-trash.png" alt="" class="note__delete icon" data-id="${note.id}">
  </div>
  </div>`;
  notesContainer.insertAdjacentHTML('beforeend', noteEl)
  document.querySelectorAll('.note__edit').forEach(n => n.addEventListener('click', editNote));
  document.querySelectorAll('.note__delete').forEach(n => n.addEventListener('click', deleteModal));
  document.querySelectorAll('.note').forEach(n => n.addEventListener('click', viewNote))
}

const addNote = function() {
  let noteTitle = addNotesTitle.value;
  let noteText = addNotesText.value;
  let ids = notes.map(n => n.id);
  let id = ids.length ? Math.max(...ids) + 1: 1;
  let note = new Note(noteTitle, noteText, id);
  notes.push(note);
 localStorage.setItem('notes', JSON.stringify(notes));
  displayNote(note);
  addNotesTitle.value = "";
  addNotesText.value = "";
  overlay.classList.add('hidden')
  buttonAddNote.classList.remove('hidden')
}

addNotesButton.addEventListener('click', addNote);
buttonAddNote.addEventListener('click', function() {
  overlay.classList.remove('hidden');
  editNoteDisplay.classList.add('hidden');
  addNoteDisplay.classList.remove('hidden');
  deleteNoteModal.classList.add('hidden');
  viewNoteDisplay.classList.add('hidden');
  buttonAddNote.classList.add('hidden');
})

const editNote = function (e) {
  overlay.classList.remove('hidden');
  addNoteDisplay.classList.add('hidden');
  editNoteDisplay.classList.remove('hidden');
  deleteNoteModal.classList.add('hidden');
  viewNoteDisplay.classList.add('hidden');
  buttonAddNote.classList.add('hidden')
  let id = e.target.dataset.id;
  let [toBeEdited] = notes.filter(n => n.id === +id)

  editNoteTitle.value = toBeEdited.title;
  editNoteText.value = toBeEdited.note;

  editted = id;
}

editNoteSaveButton.addEventListener('click', function() {
  const [edittedNote] = notes.filter(n => n.id === +editted);
  edittedNote.title = editNoteTitle.value;
  edittedNote.note = editNoteText.value;
  localStorage.setItem('notes', JSON.stringify(notes))
  overlay.classList.add('hidden')
  buttonAddNote.classList.remove('hidden')
  notesContainer.innerHTML = "";
  notes.forEach(note => displayNote(note))
})

const deleteModal = function (e) {
  let id = e.target.dataset.id;
  acceptDeleteButton.id = id;
  overlay.classList.remove('hidden');
  editNoteDisplay.classList.add('hidden')
  addNoteDisplay.classList.add('hidden')
  viewNoteDisplay.classList.add('hidden')
  buttonAddNote.classList.add('hidden')  
  deleteNoteModal.classList.remove('hidden')
}

const deleteNote = function(id) {
  notes = notes.filter(n => n.id !== +id);
  localStorage.setItem('notes', JSON.stringify(notes))
  notesContainer.innerHTML = "";
  overlay.classList.add('hidden');
  deleteNoteModal.classList.add('hidden')
  buttonAddNote.classList.remove('hidden')
  if (notes.length > 0) {
    notes.forEach(n => displayNote(n))
  }
}

deleteNoteModal.addEventListener('click', function(e) {
  let clicked = e.target;
  if (clicked.classList.contains('delete-note-modal__yes')) deleteNote(clicked.id);
  if (clicked.classList.contains('delete-note-modal__no')) {
    overlay.classList.add('hidden');
    deleteNoteModal.classList.add('hidden');
    buttonAddNote.classList.remove('hidden');
  }
});

overlay.addEventListener('click', function(e) {
  let clicked = e.target;
  if (clicked === e.currentTarget) {
    overlay.classList.add('hidden');
    buttonAddNote.classList.remove('hidden')
  }
})

const viewNote = function (e) {
  let clicked = e.target;
  if (clicked === e.currentTarget || clicked.classList.contains('note__title')) {
    deleteNoteModal.classList.add('hidden')
    addNoteDisplay.classList.add('hidden')
    editNoteDisplay.classList.add('hidden')
    overlay.classList.remove('hidden')
    buttonAddNote.classList.add('hidden');
    viewNoteDisplay.classList.remove('hidden');
    let [toBeViewed] = notes.filter(n => n.id === +clicked.dataset.id);
    viewNoteTitle.textContent = toBeViewed.title;
    viewNoteText.textContent = toBeViewed.note;
  }
}

closeButton.addEventListener('click', function(){
  overlay.classList.add('hidden');
  buttonAddNote.classList.remove('hidden')
})


if (localStorage.getItem('notes')) {
  notes = JSON.parse(localStorage.getItem('notes'));
  notes.forEach(note => displayNote(note));
}