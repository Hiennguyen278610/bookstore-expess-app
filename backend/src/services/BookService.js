import Book from '../models/Book.js';

export async function createBookService(book){
  const { name, categoryId, frontImage, quantity, price } = book;
  try {
    const newBook = new Book({ name, categoryId, frontImage, quantity, price });
    return await newBook.save();
  } catch (err) {
    throw new Error(err.message);
  }
}
export async function updateBookService(id, data){
  const {name, categoryId, frontImage, quantity, price} = data;
  try {
    return await Book.findByIdAndUpdate(
      id,
      { name: name,categoryId: categoryId,frontImage: frontImage,quantity: quantity,price: price },
      { new: true }
    );
  }catch (error) {
    throw new Error(err.message);
  }
}
export async function findBookService(_id){
  return Book.findById(_id);
}

export async function deleteBookService(id){
  return Book.findByIdAndDelete(id);
}