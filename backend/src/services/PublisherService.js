import Author from '../models/Author.js';
import Publisher from '../models/Publisher.js';


export async function createPublisherService(name) {
  const isAvailable = await Publisher.findOne({name: name});
  if (isAvailable) {
    throw new Error("Publisher already exists");
  }
  const newPublisher = await Publisher.create({name: name})
  await newPublisher.save();
  return newPublisher;
}
export async function updatePublisherService(_id, newName) {
  const isAvailable = await Publisher.findOne({name: newName});
  if (!isAvailable) {
    throw new Error("Publisher not found");
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