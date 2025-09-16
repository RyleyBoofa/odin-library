// The Odin Project - Project: Library

class Book {
    constructor(title, author, pages, read, id, cover) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = id;
        this.cover = cover;
    }

    toggleRead() {
        this.read = !this.read;
        const bookEl = document.querySelector(`[data-id="${this.id}"]`);
        const readEl = bookEl.querySelector(".book-read");
        readEl.textContent = this.read ? "Read" : "Not read";
    }
}

let library = []; // not const so that it can be filtered
let editing = undefined; // ID of the book being edited - undefined if new book
const booksContainer = document.querySelector(".books-container");
const newBookBtn = document.querySelector("#new-book-button");
const newBookDialog = document.querySelector(".new-book-dialog");
const newBookForm = document.querySelector(".new-book-form");
const confirmBtn = document.querySelector("#confirm");
const newTitle = document.querySelector("#title");
const newAuthor = document.querySelector("#author");
const newPages = document.querySelector("#pages");
const newRead = document.querySelector("#read");
const newCover = document.querySelector("#cover");
const bookCount = document.querySelector(".book-count");
const noImgPath = "./assets/img/no-image.svg";

newBookBtn.addEventListener("click", () => {
    editing = undefined;
    showModalDialog();
});

confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (editing !== undefined) {
        editExistingBook();
    } else {
        createNewBook();
    }
    newBookDialog.close();
});

function showModalDialog(book) {
    if (book === undefined) {
        newBookForm.reset();
    } else {
        newTitle.value = book.title;
        newAuthor.value = book.author;
        newPages.value = String(book.pages);
        newRead.selectedIndex = book.read ? 1 : 0;
        newCover.value = book.cover;
    }
    newBookDialog.showModal();
}

function editExistingBook() {
    const bookObj = library.find((book) => book.id === editing);
    bookObj.title = newTitle.value;
    bookObj.author = newAuthor.value;
    bookObj.pages = Number(newPages.value);
    bookObj.read = newRead.value === "yes" ? true : false;
    bookObj.cover = newCover.value;

    const bookElem = document.querySelector(`[data-id="${bookObj.id}"]`);
    bookElem.querySelector(".book-title").textContent = bookObj.title;
    bookElem.querySelector(".book-author").textContent = bookObj.author;
    bookElem.querySelector(".book-pages").textContent = `${bookObj.pages} pages`;
    bookElem.querySelector(".book-read").textContent = bookObj.read ? "Read" : "Not read";
    bookElem.querySelector(".book-cover-art img").setAttribute("src", bookObj.cover);
}

function createNewBook() {
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
}

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
    img.onerror = () => {
        img.setAttribute("src", noImgPath); // use no-image.svg if faulty URL provided
    };
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

    // allow users to edit book by clicking on it
    bookElement.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return; // don't open modal if button clicked
        editing = book.id;
        showModalDialog(book);
    });

    booksContainer.appendChild(bookElement);

    updateBookCount();
}

function deleteBook(book) {
    const id = book.getAttribute("data-id");
    library = library.filter((book) => id !== book.id); // remove object from array
    book.remove(); // remove element from page
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
        bookCount.textContent = `${library.length} books in your library`;
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
