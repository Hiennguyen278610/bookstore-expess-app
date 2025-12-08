import {
  createAuthorService,
  deleteAuthorService,
  getAuthorByIdService,
  updateAuthorService,
  getAllAuthorsService
} from '../services/AuthorService.js';

export async function createAuthor(req, res) {
  try {
    const {name} = req.body;
    const publisher = await createAuthorService(name);
    if (!publisher) {
      res.status(404).json({message:"Author not found"})
    }
    res.status(201).json(publisher);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
export async function updateAuthor(req, res) {
  try {
    const {name} = req.body;
    const author = await updateAuthorService(req.params.id, name);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
    }
    res.status(201).json(author);
  }catch (err) {
    res.status(400).json({ message: err.message });
  }
}
export async function deleteAuthor(req, res) {
  try {
    const author = await deleteAuthorService(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
    }
    res.status(201).json(author);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
export async function getAuthorById(req, res) {
  try {
    const author = await getAuthorByIdService(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}


export async function getAllAuthors(req, res) {
  try {
    const authors = await getAllAuthorsService();
    res.status(200).json(authors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
