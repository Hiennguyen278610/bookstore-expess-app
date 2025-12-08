import Author from '../models/Author.js';
import Publisher from '../models/Publisher.js';


export async function createPublisherService(name) {
  const isAvailable = await Publisher.findOne({ name: name });
  if (isAvailable) {
    throw new Error("Publisher already exists");
  }
  const newPublisher = await Publisher.create({ name: name })
  await newPublisher.save();
  return newPublisher;
}
export async function updatePublisherService(_id, newName) {
  const publisher = await Publisher.findById(_id);
  if (!publisher) {
    throw new Error("Publisher not found");
  }

  // Check if new name already exists (exclude current publisher)
  const existingPublisher = await Publisher.findOne({ name: newName, _id: { $ne: _id } });
  if (existingPublisher) {
    throw new Error("Publisher name already exists");
  }

  return Publisher.findByIdAndUpdate(
    _id,
    { name: newName },
    { new: true }
  );
}
export async function deletePublisherService(_id) {
  return Publisher.findByIdAndDelete(_id);
}
export async function getPublisherByIdService(_id) {
  return Publisher.findById(_id);
}

export async function getAllPublishersService() {
  return Publisher.find()
}