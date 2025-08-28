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
const newCover = document.querySelector("#cover");
const bookCount = document.querySelector(".book-count");
const noImgPath = "./assets/img/no-image.svg";

newBookBtn.addEventListener("click", () => {
    newTitle.value = "";
    newAuthor.value = "";
    newPages.value = "";
    newRead.selectedIndex = 0;
    newCover.value = "";
    newBookDialog.showModal();
});

confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const newBook = addBookToLibrary(
        newTitle.value,
        newAuthor.value,
        Number(newPages.value),
        newRead.value === "yes" ? true : false,
        newCover.value
    );
    if (newBook === null) {
        alert("Failed to add new book, please ensure that required fields are filled out.");
        return;
    }
    createNewBookElement(newBook);
    newBookDialog.close();
});

function Book(title, author, pages, read, id, cover) {
    if (!new.target) {
        throw Error("Book constructor must be called with the 'new' keyword.");
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id;
    this.cover = cover;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
    const book = document.querySelector(`[data-id="${this.id}"]`);
    const read = book.querySelector(".book-read");
    read.textContent = this.read ? "Read" : "Not read";
};

function addBookToLibrary(title, author, pages, read, cover) {
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
    const book = new Book(title, author, pages, read, id, cover);
    library.push(book);
    return book;
}

function createNewBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.classList.add("shadow");
    bookElement.setAttribute("data-id", book.id);

    const cover = document.createElement("div");
    cover.classList.add("book-cover-art");
    cover.classList.add("shadow");
    const img = document.createElement("img");
    img.setAttribute("src", book.cover !== "" ? book.cover : noImgPath);
    img.setAttribute("alt", `${book.title} cover art`);
    cover.appendChild(img);
    bookElement.appendChild(cover);

    const heading = document.createElement("div");
    heading.classList.add("book-heading");

    const title = document.createElement("h3");
    title.classList.add("book-title");
    title.textContent = `${book.title}`;
    heading.appendChild(title);

    const author = document.createElement("p");
    author.classList.add("book-author");
    author.textContent = `by ${book.author}`;
    heading.appendChild(author);

    const info = document.createElement("div");
    info.classList.add("book-info");

    const read = document.createElement("p");
    read.classList.add("book-read");
    read.textContent = book.read ? "Read" : "Not read";
    info.appendChild(read);

    const pages = document.createElement("p");
    pages.classList.add("book-pages");
    pages.textContent = `${book.pages} pages`;
    info.appendChild(pages);

    const buttons = document.createElement("div");
    buttons.classList.add("book-buttons");

    const readButton = document.createElement("button");
    readButton.classList.add("book-button");
    readButton.textContent = "Toggle Read";
    buttons.appendChild(readButton);
    readButton.addEventListener("click", () => book.toggleRead());

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("book-button");
    deleteButton.textContent = "Delete Book";
    buttons.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => deleteBook(bookElement));

    bookElement.appendChild(heading);
    bookElement.appendChild(info);
    bookElement.appendChild(buttons);

    booksContainer.appendChild(bookElement);

    updateBookCount();
}

function deleteBook(book) {
    const id = book.getAttribute("data-id");
    library = library.filter((book) => id !== book.id);
    book.remove();
    updateBookCount();
}

function displayLibrary() {
    library.forEach((book) => {
        createNewBookElement(book);
    });
}

function updateBookCount() {
    if (library.length === 1) {
        bookCount.textContent = "1 book in your library";
    } else {
        bookCount.textContent = `${library.length} books in  your library`;
    }
}

addBookToLibrary(
    "The Hobbit",
    "J.R.R. Tolkien",
    320,
    true,
    "https://live.staticflickr.com/2597/4014903394_b2f4f294b7_b.jpg"
);
addBookToLibrary(
    "Harry Potter",
    "J.K. Rowling",
    309,
    true,
    "https://live.staticflickr.com/8514/28640674850_527c97717e.jpg"
);
addBookToLibrary(
    "Fahrenheit 451",
    "Ray Bradbury",
    256,
    false,
    "https://live.staticflickr.com/65535/50148581751_845cdaff6b_b.jpg"
);

displayLibrary();
