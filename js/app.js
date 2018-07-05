// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

UI.prototype.showAlert = function(message, className) {
  const container =  document.querySelector('.container'),
        form = document.getElementById('book-form');

  // Create dive element
  const div = document.createElement('div');

  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(message));

  container.insertBefore(div, form);

  // Timeout after 3s
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 3000)
}

// Add book to list function
UI.prototype.addBookToList = function(book) {
  const list = document.getElementById('book-list');

  // Create tr element
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;

  list.appendChild(row);
}

// Delete book

UI.prototype.deleteBook = function(target) {
  if(target.className === 'delete') {
    target.parentNode.parentNode.remove();
  }
}

UI.prototype.clearFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// LS Constructor 
function Store() {}

Store.prototype.getBooks = function() {
  let books;
  if(localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }

  return books;
}

Store.prototype.displayBooks = function() {
  const store = new Store(),
        books = store.getBooks();
  
  books.forEach(function(book) {
    const ui = new UI();

    ui.addBookToList(book);
  });
}

Store.prototype.addBook = function(book) {
  const store = new Store(),
        books = store.getBooks();
  
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
}

Store.prototype.removeBook = function(isbn) {
  const store = new Store(),
        books = store.getBooks();
  
  books.forEach(function(book, i) {
    if(book.isbn === isbn) {
      books.splice(i, 1);
    }
  });

  localStorage.setItem('books', JSON.stringify(books));
}

// Event Listeners
//DOM load event
document.addEventListener('DOMContentLoaded', function() {
  const store = new Store();
  store.displayBooks();
});
// Event listener for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
  //Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  const book = new Book(title, author, isbn);

  const ui = new UI(),
        store = new Store();

  // Validate

  if (title === '' || author === '' || isbn === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    store.addBook(book);

    // showSuccess
    ui.showAlert('Book added', 'success');
  
    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event listener for delete book

document.getElementById('book-list').addEventListener('click', function(e) {
  const ui = new UI(),
        store = new Store();

  ui.deleteBook(e.target);

  // Delete from LS
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert('Book removed', 'success');

  e.preventDefault();
});