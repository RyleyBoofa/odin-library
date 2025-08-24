// The Odin Project - Project: Library

const library = [];

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

function addBookToLibrary(title, author, pages, read) {
    if (
        typeof title != "string" ||
        typeof author != "string" ||
        !Number.isInteger(pages) ||
        pages <= 0 ||
        typeof read != "boolean"
    ) {
        throw Error(
            "Books must be added with: addBookToLibrary(title <string>, author <string>, pages <int>, read <bool>)"
        );
    }

    const id = crypto.randomUUID();
    const book = new Book(title, author, pages, read, id);
    library.push(book);
}

function displayBooks() {
    library.forEach((book) => {
        console.log(book);
    });
}

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 320, false);
addBookToLibrary("Harry Potter", "J.K. Rowling", 309, true);

displayBooks();
