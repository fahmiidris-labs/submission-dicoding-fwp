const RENDER_EVENT = 'render-book';

const KEY_LS = 'books';

let keyword = '';

function getId() {
  return +new Date();
}

function getData() {
  return JSON.parse(localStorage.getItem(KEY_LS)) || [];
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function searchBook() {
  const title = document.getElementById('searchBookTitle').value;

  keyword = title;

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const actions = document.createElement('div');
  actions.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, actions);

  if (isCompleted) {
    const greenButton = document.createElement('button');
    greenButton.classList.add('green');
    greenButton.innerText = 'Belum selesai di Baca';

    greenButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = 'Hapus buku';

    redButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });

    actions.append(greenButton, redButton);
  } else {
    const greenButton = document.createElement('button');
    greenButton.classList.add('green');
    greenButton.innerText = 'Selesai dibaca';

    greenButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = 'Hapus buku';

    redButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });

    actions.append(greenButton, redButton);
  }

  return container;
}

function addBook() {
  const title = document.getElementById('inputBookTitle');
  const author = document.getElementById('inputBookAuthor');
  const year = document.getElementById('inputBookYear');
  const isCompleted = document.getElementById('inputBookIsComplete');

  const books = getData();

  const id = getId();
  const bookObject = generateBookObject(
    id,
    title.value,
    author.value,
    year.value,
    isCompleted.checked
  );
  books.push(bookObject);

  localStorage.setItem(KEY_LS, JSON.stringify(books));

  document.dispatchEvent(new Event(RENDER_EVENT));

  alert('Data Berhasil ditambahkan');

  title.value = '';
  author.value = '';
  year.value = '';
  isCompleted.checked = false;
}

function addBookToCompleted(bookId) {
  const data = getData();

  if (data.length < 1) return;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === bookId) {
      data[i].isCompleted = !data[i].isCompleted;
      break;
    }
  }

  localStorage.setItem(KEY_LS, JSON.stringify(data));

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromCompleted(bookId) {
  const data = getData();

  if (data.length < 1) return;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === bookId) {
      data.splice(i, 1);
      break;
    }
  }

  localStorage.setItem(KEY_LS, JSON.stringify(data));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoBookFromCompleted(bookId) {
  const data = getData();

  if (data.length < 1) return;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === bookId) {
      data[i].isCompleted = !data[i].isCompleted;
      break;
    }
  }

  localStorage.setItem(KEY_LS, JSON.stringify(data));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('inputBook');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById(
    'incompleteBookshelfList'
  );
  const listCompleted = document.getElementById('completeBookshelfList');

  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  const data = getData();

  const booksFilter = data.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLocaleLowerCase())
  );

  for (bookItem of booksFilter) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedTODOList.append(bookElement);
    }
  }
});

window.addEventListener('load', function () {
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem(KEY_LS) !== null) {
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  } else {
    alert('Browser yang Anda gunakan tidak mendukung Web Storage');
  }
});
