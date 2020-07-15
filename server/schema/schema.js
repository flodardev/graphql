var { buildSchema } = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");

var schema = buildSchema(`
    type Query {
        hello: String
        books: [Book!]!
        book(id: ID!): Book
        authors: [Author!]!
        author(id: ID!): Author
    }

    type Mutation {
        addAuthor(name: String!, age: Int!): Author
        addBook(name: String!, genre: String!, authorId: ID!): Book
    }

    type Book {
        id: ID!
        name: String!
        genre: String!
        author: Author!
    }

    type Author {
        id: ID!
        name: String!
        age: Int!
        books: [Book]
    }
`);

var root = {
	books: async () => {
		const booksList = await Book.find({});
		const authorsList = await Author.find({});
		return booksList.map(({ id, name, genre, authorId }) => {
			const author = authorsList.find((author) => author.id === authorId);
			return {
				id,
				name,
				genre,
				author,
			};
		});
	},
	book: async (args) => {
		const booksList = await Book.find({});
		const book = booksList.find((book) => book.id === args.id);
		const { id, name, age } = await Author.findById(book.authorId);
		const books = await booksList.filter(
			(docs) => docs.authorId === book.authorId,
		);
		const author = {
			id,
			name,
			age,
			books,
		};
		return { id: book.id, name: book.name, genre: book.genre, author };
	},
	authors: async () => {
		const booksList = await Book.find({});
		const authorsList = await Author.find({});
		return authorsList.map(({ id, name, age }) => {
			const books = booksList.filter(({ authorId }) => authorId === id);
			return {
				id,
				name,
				age,
				books,
			};
		});
	},
	author: async (args) => {
		const { id, name, age } = await Author.findById(args.id);
		const books = await Book.find({ authorId: id });
		return { id, name, age, books };
	},
	addAuthor: ({ name, age }) => {
		let author = new Author({
			name,
			age,
		});
		return author.save();
	},
	addBook: ({ name, genre, authorId }) => {
		let book = new Book({
			name,
			genre,
			authorId,
		});
		return book.save();
	},
};

module.exports = { schema, root };
