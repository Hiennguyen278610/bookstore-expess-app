import { getSlug } from "../helper/getSlug.js";
import Category from "../models/Category.js";

export async function createCategoryService(name) {
  const isAvailable = await Category.findOne({ name: name });
  if (isAvailable) {
    throw new Error("Category already exists");
  }
  const slug = getSlug(name);
  const newCategory = await Category.create({ name, slug });
  await newCategory.save();
  return newCategory;
}
export async function updateCategoryService(_id, newName) {
  const isExisted = await Category.findOne({ _id });
  if (!isExisted) {
    throw new Error("Category not found");
  }
  const newSlug = getSlug(newName);
  return Category.findByIdAndUpdate(
    _id,
    { name: newName, slug: newSlug },
    { new: true }
  );
}
export async function deleteCategoryService(_id) {
  return Category.findByIdAndDelete(_id);
}
export async function getCategoryByIdService(_id) {
  return Category.findById(_id);
}

export async function getAllCategoryService() {
  return Category.find();
}
