const {
    addNewBook,
    getBookshelf,
    getBookByID,
    editBookByID,
    deleteBookByID
} = require('./handler');

const routes = [
    {method: 'POST'  , path: '/books'     , handler: addNewBook},
    {method: 'GET'   , path: '/books'     , handler: getBookshelf},
    {method: 'GET'   , path: '/books/{id}', handler: getBookByID},
    {method: 'PUT'   , path: '/books/{id}', handler: editBookByID},
    {method: 'DELETE', path: '/books/{id}', handler: deleteBookByID}
];

module.exports = routes;
