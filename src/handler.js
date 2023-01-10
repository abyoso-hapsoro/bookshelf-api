const {nanoid} = require('nanoid');
const books = require('./books');

const addNewBook = (request, h) => {
    const bookshelfCount = books.length;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;

    // validate name is defined
    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    // validate readPage is less than or equal to pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    // prepare server-side properties
    const id = nanoid(16);
    const finished = (readPage === pageCount);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // add new book
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }
    books.push(newBook);
    const newBookshelfCount = books.length;

    // book was not added
    if (newBookshelfCount === bookshelfCount) {
        return h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
        }).code(500);
    }

    // book was added
    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    }).code(201);
};

const getBookshelf = (request, h) => {
    const {name, reading, finished} = request.query;
    var filteredBooks = books;

    // filter by name
    if (name !== undefined) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    // filter by reading
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(book => Number(book.reading) === Number(reading));
    }

    // filter by finished
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(book => Number(book.finished) === Number(finished));
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    }).code(200);
};

const getBookByID = (request, h) => {
    const {id} = request.params;
    const book = books.find(book => book.id === id);

    // book is not found
    if (book === undefined) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        }).code(404);
    }

    // book is found
    return h.response({
        status: 'success',
        data: {book}
    }).code(200);
};

const editBookByID = (request, h) => {
    const {id} = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;

    // validate name is defined
    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    // validate readPage is less than or equal to pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const index = books.findIndex(book => book.id === id);
    
    // book is not found
    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }

    // book is found
    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
    }

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    }).code(200);
};

const deleteBookByID = (request, h) => {
    const {id} = request.params;
    const index = books.findIndex(book => book.id === id);
    
    // book is not found
    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
    }

    // book is found
    books.splice(index, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    }).code(200);
};

module.exports = {
    addNewBook,
    getBookshelf,
    getBookByID,
    editBookByID,
    deleteBookByID
};
