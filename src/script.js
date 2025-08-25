// The Odin Project - Project: Library

let library = []; // not const so that it can be filtered
const booksContainer = document.querySelector(".books-container");
const newBookBtn = document.querySelector("#new-book-button");
const newBookDialog = document.querySelector(".new-book-dialog");
const confirmBtn = document.querySelector("#confirm");
const newTitle = document.querySelector("#title");
const newAuthor = document.querySelector("#author");
const newPages = document.querySelector("#pages");
const newRead = document.querySelector("#read");

newBookBtn.addEventListener("click", () => {
    newTitle.value = "";
    newAuthor.value = "";
    newPages.value = "";
    newRead.selectedIndex = 0;
    newBookDialog.showModal();
});

confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const newBook = addBookToLibrary(
        newTitle.value,
        newAuthor.value,
        Number(newPages.value),
        newRead.value === "yes" ? true : false
    );
    if (newBook === null) {
        alert(
            "Failed to add new book, please ensure form is filled out correctly. See developer console for more info."
        );
        return;
    }
    createNewBookElement(newBook);
    newBookDialog.close();
});

function Book(title, author, pages, read, id) {
    if (!new.target) {
        throw Error("Book constructor must be called with the 'new' keyword.");
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
    const book = document.querySelector(`[data-id="${this.id}"]`);
    const read = book.querySelector(".book-read");
    read.textContent = this.read ? "Read" : "Not read";
};

function addBookToLibrary(title, author, pages, read) {
    if (
        typeof title != "string" ||
        typeof author != "string" ||
        !Number.isInteger(pages) ||
        pages <= 0 ||
        typeof read != "boolean"
    ) {
        console.error(
            "ERROR: Books must be added with: title <string>, author <string>, pages <int>, read <bool>"
        );
        return null;
    }

    const id = crypto.randomUUID();
    const book = new Book(title, author, pages, read, id);
    library.push(book);
    return book;
}

function createNewBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const cover = document.createElement("div");
    cover.classList.add("book-cover-art");
    cover.textContent = "Cover art";
    bookElement.appendChild(cover);

    const title = document.createElement("h2");
    title.classList.add("book-title");
    title.textContent = `${book.title}`;
    bookElement.appendChild(title);

    const author = document.createElement("p");
    author.classList.add("book-author");
    author.textContent = `${book.author}`;
    bookElement.appendChild(author);

    const pages = document.createElement("p");
    pages.classList.add("book-pages");
    pages.textContent = `${book.pages} pages`;
    bookElement.appendChild(pages);

    const read = document.createElement("p");
    read.classList.add("book-read");
    read.textContent = book.read ? "Read" : "Not read";
    bookElement.appendChild(read);

    const id = document.createElement("p");
    id.classList.add("book-id");
    id.textContent = `ID: ${book.id}`;
    bookElement.appendChild(id);
    bookElement.setAttribute("data-id", book.id);

    const readButton = document.createElement("button");
    readButton.classList.add("book-read-button");
    readButton.textContent = "Toggle Read";
    bookElement.appendChild(readButton);
    readButton.addEventListener("click", () => book.toggleRead());

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("book-delete-button");
    deleteButton.textContent = "Delete Book";
    bookElement.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => deleteBook(bookElement));

    booksContainer.appendChild(bookElement);
}

function deleteBook(book) {
    const id = book.getAttribute("data-id");
    library = library.filter((book) => id !== book.id);
    book.remove();
}

function displayLibrary() {
    library.forEach((book) => {
        createNewBookElement(book);
    });
}

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 320, false);
addBookToLibrary("Harry Potter", "J.K. Rowling", 309, true);

displayLibrary();
