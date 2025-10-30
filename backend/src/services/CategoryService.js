import Category from '../models/Category.js';


export async function createCategoryService(name) {
  const isAvailable = await Category.findOne({name: name});
  if (isAvailable) {
    throw new Error("Category already exists");
  }
  const newCategory = await Category.create({name: name})
  await newCategory.save();
  return newCategory;
}
export async function updateCategoryService(_id, newName) {
  const isAvailable = await Category.findOne({name: newName});
  if (!isAvailable) {
    throw new Error("Category not found");
  }
  return Category.findByIdAndUpdate(
    _id,
    { name: newName },
    { new: true }
  );
}
export async function deleteCategoryService(_id) {
  return Category.findByIdAndDelete(_id);
}
export async function getCategoryByIdService(_id) {
  return Category.findById(_id);
}