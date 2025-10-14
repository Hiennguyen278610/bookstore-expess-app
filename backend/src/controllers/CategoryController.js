import {
  createCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  updateCategoryService
} from '../services/CategoryService.js';

export async function createCategory(req, res) {
  try {
    const {name} = req.body;
    const category = await createCategoryService(name);
    if (!category) {
      res.status(404).json({message:"Category not found"})
    }
    res.status(201).json(category);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
export async function updateCategory(req, res) {
  try {
    const {name} = req.body;
    const category = await updateCategoryService(req.params.id, name);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(201).json(category);
  }catch (err) {
    res.status(400).json({ message: err.message });
  }
}
export async function deleteCategory(req, res) {
  try {
    const category = await deleteCategoryService(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(201).json(category);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
export async function getCategoryById(req, res) {
  try {
    const category = await getCategoryByIdService(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}