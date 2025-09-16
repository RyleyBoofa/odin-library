// The Odin Project - Project: Library

class Book {
    static validate(title, author, pages, read) {
        return (
            typeof title === "string" &&
            typeof author === "string" &&
            Number.isInteger(pages) &&
            pages > 0 &&
            typeof read === "boolean"
        );
    }

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
        return this.read;
    }
}

class Library {
    #books = [];
    #editing = null;
    #booksContainer = document.querySelector(".books-container");
    #newBookBtn = document.querySelector("#new-book-button");
    #newBookDialog = document.querySelector(".new-book-dialog");
    #newBookForm = document.querySelector(".new-book-form");
    #confirmBtn = document.querySelector("#confirm");
    #newTitle = document.querySelector("#title");
    #newAuthor = document.querySelector("#author");
    #newPages = document.querySelector("#pages");
    #newRead = document.querySelector("#read");
    #newCover = document.querySelector("#cover");
    #bookCount = document.querySelector(".book-count");
    static noImgPath = "./assets/img/no-image.svg";

    constructor(books) {
        this.#newBookBtn.addEventListener("click", () => {
            this.#editing = null;
            this.#showModalDialog();
        });

        this.#confirmBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.#editing !== null) {
                this.#editExistingBook();
            } else {
                this.#createNewBook();
            }
            this.#newBookDialog.close();
        });

        if (books) {
            books.forEach((book) => {
                this.#createNewBook(book);
            });
        }
    }

    #showModalDialog(book) {
        if (book === undefined) {
            this.#newBookForm.reset();
        } else {
            this.#newTitle.value = book.title;
            this.#newAuthor.value = book.author;
            this.#newPages.value = String(book.pages);
            this.#newRead.selectedIndex = book.read ? 1 : 0;
            this.#newCover.value = book.cover;
        }
        this.#newBookDialog.showModal();
    }

    #createNewBook(book) {
        const newTitle = book ? book.title : this.#newTitle.value;
        const newAuthor = book ? book.author : this.#newAuthor.value;
        const newPages = Number(book ? book.pages : this.#newPages.value);
        const newRead = book ? book.read : this.#newRead.value === "yes" ? true : false;
        const newCover = book ? book.cover : this.#newCover.value;

        const newBook = this.#addBookToLibrary(newTitle, newAuthor, newPages, newRead, newCover);
        if (newBook === null) {
            alert("Failed to add new book, please ensure that required fields are filled out.");
            return;
        }

        this.#createNewBookElement(newBook);
    }

    #editExistingBook() {
        const bookObj = this.#books.find((book) => book.id === this.#editing);
        bookObj.title = this.#newTitle.value;
        bookObj.author = this.#newAuthor.value;
        bookObj.pages = Number(this.#newPages.value);
        bookObj.read = this.#newRead.value === "yes" ? true : false;
        bookObj.cover = this.#newCover.value;

        const bookElem = document.querySelector(`[data-id="${bookObj.id}"]`);
        bookElem.querySelector(".book-title").textContent = bookObj.title;
        bookElem.querySelector(".book-author").textContent = bookObj.author;
        bookElem.querySelector(".book-pages").textContent = `${bookObj.pages} pages`;
        bookElem.querySelector(".book-read").textContent = bookObj.read ? "Read" : "Not read";
        bookElem.querySelector(".book-cover-art img").setAttribute("src", bookObj.cover);
    }

    #addBookToLibrary(title, author, pages, read, cover) {
        if (!Book.validate(title, author, pages, read)) {
            console.error(
                "ERROR: Books must be added with: title <string>, author <string>, pages <int>, read <bool>"
            );
            return null;
        }

        const id = crypto.randomUUID();
        const book = new Book(title, author, pages, read, id, cover);
        this.#books.push(book);
        return book;
    }

    #createNewBookElement(book) {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.classList.add("shadow");
        bookElement.setAttribute("data-id", book.id);

        const cover = document.createElement("div");
        cover.classList.add("book-cover-art");
        cover.classList.add("shadow");
        const img = document.createElement("img");
        img.setAttribute("src", book.cover !== "" ? book.cover : Library.noImgPath);
        img.onerror = () => {
            img.setAttribute("src", Library.noImgPath); // use no-image.svg if faulty URL provided
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
        readButton.addEventListener("click", () => this.#updateBookRead(book));

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("book-button");
        deleteButton.textContent = "Delete Book";
        buttons.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => this.#deleteBook(bookElement));

        bookElement.appendChild(heading);
        bookElement.appendChild(info);
        bookElement.appendChild(buttons);

        // allow users to edit book by clicking on it
        bookElement.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return; // don't open modal if button clicked
            this.#editing = book.id;
            this.#showModalDialog(book);
        });

        this.#booksContainer.appendChild(bookElement);

        this.#updateBookCount();
    }

    #deleteBook(book) {
        const id = book.getAttribute("data-id");
        this.#books = this.#books.filter((book) => id !== book.id); // remove object from array
        book.remove(); // remove element from page
        this.#updateBookCount();
    }

    #updateBookCount() {
        if (this.#books.length === 1) {
            this.#bookCount.textContent = "1 book in your library";
        } else {
            this.#bookCount.textContent = `${this.#books.length} books in your library`;
        }
    }

    #updateBookRead(book) {
        const read = book.toggleRead();
        const bookEl = document.querySelector(`[data-id="${book.id}"]`);
        const readEl = bookEl.querySelector(".book-read");
        readEl.textContent = read ? "Read" : "Not read";
    }
}

new Library([
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        pages: 320,
        read: true,
        cover: "https://live.staticflickr.com/2597/4014903394_b2f4f294b7_b.jpg",
    },
    {
        title: "Harry Potter",
        author: "J.K. Rowling",
        pages: 309,
        read: true,
        cover: "https://live.staticflickr.com/8514/28640674850_527c97717e.jpg",
    },
    {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        pages: 256,
        read: false,
        cover: "https://live.staticflickr.com/65535/50148581751_845cdaff6b_b.jpg",
    },
]);
