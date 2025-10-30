import Author from '../models/Author.js';


export async function createAuthorService(name) {
  const isAvailable = await Author.findOne({name: name});
  if (isAvailable) {
    throw new Error("Author already exists");
  }
  const newAuthor = await Author.create({name: name})
  await newAuthor.save();
  return newAuthor;
}
export async function updateAuthorService(_id, newName) {
  const isAvailable = await Author.findOne({name: newName});
  if (!isAvailable) {
    throw new Error("Author not found");
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