import Author from '../models/Author.js';


export async function createAuthorService(name) {
  const isAvailable = await Author.findOne({ name: name });
  if (isAvailable) {
    throw new Error("Author already exists");
  }
  const newAuthor = await Author.create({ name: name })
  await newAuthor.save();
  return newAuthor;
}
export async function updateAuthorService(_id, newName) {
  const author = await Author.findById(_id);
  if (!author) {
    throw new Error("Author not found");
  }

  // Check if new name already exists (exclude current author)
  const existingAuthor = await Author.findOne({ name: newName, _id: { $ne: _id } });
  if (existingAuthor) {
    throw new Error("Author name already exists");
  }

  return Author.findByIdAndUpdate(
    _id,
    { name: newName },
    { new: true }
  );
}
export async function deleteAuthorService(_id) {
  return Author.findByIdAndDelete(_id);
}
export async function getAuthorByIdService(_id) {
  return Author.findById(_id);
}

export async function getAllAuthorsService() {
  return Author.find();
}
