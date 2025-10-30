import Book from '../models/Book.js';
import BookAuthor from '../models/BookAuthor.js';

export async function createBookService(book){
  const { name, categoryId, publisherId, frontImage, quantity, price, authors } = book;
  try {
    const newBook = await Book.create({
      name: name,
      categoryId: categoryId,
      publisherId: publisherId,
      frontImage: frontImage,
      quantity: quantity,
      price: price,
    })
    if (authors && authors.length > 0) {
      await Promise.all(
        authors.map(async item => {
          return await BookAuthor.create({
            bookId: newBook._id,
            authorId: item.authorId
          });
        }));
    }
    const populatedBook = await Book.findById(newBook._id)
      .populate('categoryId', 'name')
      .populate('publisherId', 'name')
      .lean();
    populatedBook.authors = await BookAuthor.find({ bookId: newBook._id })
      .populate('authorId', 'name');
    return populatedBook;
  } catch (err) {
    throw new Error(err.message);
  }
}
export async function updateBookService(id, data){
  const { name, categoryId,publisherId, frontImage, quantity, price, authors } = data;
  const book = await Book.findByIdAndUpdate(
      id,
      { name: name,categoryId: categoryId,publisherId: publisherId,frontImage: frontImage,quantity: quantity,price: price },
      { new: true }
    );
  if (!book) {
    throw new Error(`Book with id ${id} not found`);
  }
  if (Array.isArray(authors)) {
    await BookAuthor.deleteMany({ bookId: book._id });
    if (authors.length > 0) {
      const newAuthors = [];
      for (const author of authors) {
        newAuthors.push({
          bookId: book._id,
          authorId: author.authorId
        });
      }
      await BookAuthor.insertMany(newAuthors);
    }
  }
  const populatedBook = await Book.findById(book._id)
    .populate('categoryId', 'name')
    .populate('publisherId', 'name')
    .lean();
  populatedBook.authors = await BookAuthor.find({ bookId: book._id })
    .populate('authorId', 'name');
  return populatedBook;
}
export async function findBookService(_id){
  const book = await Book.findById(_id)
    .populate('categoryId', 'name')
    .populate('publisherId', 'name')
    .lean()
  if (!book){
    throw new Error(`Book with id ${_id} not found`);
  }
  book.authors = await BookAuthor.find({ bookId: book._id })
    .populate('authorId', 'name');
  return Book.findById(_id);
}

export async function deleteBookService(id){
  const book = await Book.findById(id)
  if (!book){
    throw new Error(`Book with id ${_id} not found`);
  }
  await BookAuthor.deleteMany({ bookId: book._id });
  await Book.findByIdAndDelete(book._id);
  return book;
}