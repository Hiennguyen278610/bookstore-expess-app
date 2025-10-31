import { createBookService, deleteBookService, findBookService, updateBookService } from '../services/BookService.js';

export const createBook = async (req, res) => {
  try {
    const Book = await createBookService(req.body, req.files);
    res.status(201).json(Book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const updateBook = async (req, res) => {
  try {
    const updateBook =await updateBookService(req.params.id, req.body, req.files);
    res.status(201).json(updateBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const findBook = async (req, res) => {
  try {
    const Book = await findBookService(req.params.id);
    res.status(200).json(Book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const deleteBook = async (req, res) => {
  try {
    const Book = await deleteBookService(req.params.id);
    res.status(200).json(Book);
  }catch (err) {
    res.status(400).json({ message: err.message });
  }
}