export function getSlug(categoryName) {
  const slug = categoryName
    .trim()
    .toLowerCase()
    
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    

    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  
  return slug;
}