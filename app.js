// Book constructor 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI constructor
class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // Create a tr
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    clearFields() {
        document.getElementById('title').value = '',
        document.getElementById('author').value = '',
        document.getElementById('isbn').value = '';
    }

    showAlert(message, className) {
        // Create a div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div, form);
        // Timeout after 3s
        setTimeout(function() {
            document.querySelector('.alert').remove()
        }, 3000);
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
}

// Local storage class

class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    };

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui  = new UI;
      
            // Add book to UI
            ui.addBookToList(book);
        });
    };

    static addBook(book) {
        const books = Store.getBooks();
    
        books.push(book);
    
        localStorage.setItem('books', JSON.stringify(books));
    };

    static removeBook(isbn) {
        const books = Store.getBooks();
    
        books.forEach(function(book, index){
         if(book.isbn === isbn) {
          books.splice(index, 1);
         }
        });
    
        localStorage.setItem('books', JSON.stringify(books));
      };
};

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener for add book
document.getElementById('book-form').addEventListener('submit',
    function(e) {
        // Get form values
        const title = document.getElementById('title').value,
                author = document.getElementById('author').value,
                isbn = document.getElementById('isbn').value;
        
        // Instantiate a book
        const book = new Book(title, author, isbn);

        // Instantiate UI
        const ui = new UI();

        if(title === '' || author === '' || isbn === '') {

            ui.showAlert('Please fill in all fields', 'error')
        } else {
            // Add book to list
            ui.addBookToList(book);

            // Add to local storage
            Store.addBook(book);

            // Sucess 
            ui.showAlert('Book added', 'sucess')

            // Clear fields
            ui.clearFields();
        }

        e.preventDefault();
    });

    // Event listener for delete
    document.getElementById('book-list').addEventListener('click', function(e) {

        // Instantiate UI
        const ui = new UI();

        // Delete book
        ui.deleteBook(e.target);

        // Remove from LS
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

        // Show message
        ui.showAlert('Book removed', 'sucess')

        e.preventDefault();
    })
