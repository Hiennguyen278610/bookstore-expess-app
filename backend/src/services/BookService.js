import Book from '../models/Book.js';
import BookAuthor from '../models/BookAuthor.js';
import { deleteImageIntoCloudinary, uploadToCloudinary } from '../middlewares/uploadImage.js';

export async function createBookService(book, files) {
  try {
    let { name, categoryId, publisherId, quantity, price, authors } = book;
    authors = JSON.parse(authors);
    if (!name || !categoryId || !publisherId || !authors) { // chan do phai fetch len neu du lieu loi
      throw new Error('Can\'t upload image to cloudinary!');
    }
    const imageUrl = await uploadToCloudinary(files);
    const newBook = await Book.create({
      name: name,
      categoryId: categoryId,
      publisherId: publisherId,
      imageUrl: imageUrl,
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

export async function updateBookService(id, data, files) {
  const { name, categoryId, publisherId, quantity, price, authors } = data;
  const book = await Book.findById(id);
  if (!book) {
    throw new Error(`Book with id ${id} not found`);
  }
  book.name = name;
  book.categoryId = categoryId;
  book.publisherId = publisherId;
  book.quantity = quantity;
  book.price = price;
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
  await deleteImageIntoCloudinary(book.imageUrl)
  const imageUrl = await uploadToCloudinary(files);
  book.imageUrl = imageUrl;
  await book.save()
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
  const authors = await BookAuthor.find({ bookId: book._id })
    .populate('authorId', 'name');
  book.authors = authors.map(a => a.authorId.name);
  return book;
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