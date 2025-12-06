import Book from '../models/Book.js';
import BookAuthor from '../models/BookAuthor.js';
import { deleteImageIntoCloudinary, uploadToCloudinary } from '../middlewares/uploadImage.js';

export async function createBookService(book, files) {
  try {
    let { name, categoryId, publisherId, quantity, price, authors } = book;
    authors = JSON.parse(authors);
    if (!name || !categoryId || !publisherId || !authors) { // chan do phai fetch len neu du lieu loi
      throw new Error('Can\'t upload image to cloudinary!');
    }
    const imageUrl = await uploadToCloudinary(files);
    const newBook = await Book.create({
      name: name,
      categoryId: categoryId,
      publisherId: publisherId,
      imageUrl: imageUrl,
      quantity: quantity,
      price: price,
    })
    if (authors && authors.length > 0) {
      await Promise.all(
        authors.map(async item => {
          return await BookAuthor.create({
            bookId: newBook._id,
            authorId: item.authorId
          });
        }));
    }
    const populatedBook = await Book.findById(newBook._id)
      .populate('categoryId', 'name')
      .populate('publisherId', 'name')
      .lean();
    populatedBook.authors = await BookAuthor.find({ bookId: newBook._id })
      .populate('authorId', 'name');
    return populatedBook;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function updateBookService(id, data, files) {
  const { name, categoryId, publisherId, quantity, price, authors } = data;
  const book = await Book.findById(id);
  if (!book) {
    throw new Error(`Book with id ${id} not found`);
  }
  book.name = name;
  book.categoryId = categoryId;
  book.publisherId = publisherId;
  book.quantity = quantity;
  book.price = price;
  if (Array.isArray(authors)) {
    await BookAuthor.deleteMany({ bookId: book._id });
    if (authors.length > 0) {
      const newAuthors = [];
      for (const author of authors) {
        newAuthors.push({
          bookId: book._id,
          authorId: author.authorId
        });
      }
      await BookAuthor.insertMany(newAuthors);
    }
  }
  await deleteImageIntoCloudinary(book.imageUrl)
  const imageUrl = await uploadToCloudinary(files);
  book.imageUrl = imageUrl;
  await book.save()
  const populatedBook = await Book.findById(book._id)
    .populate('categoryId', 'name')
    .populate('publisherId', 'name')
    .lean();
  populatedBook.authors = await BookAuthor.find({ bookId: book._id })
    .populate('authorId', 'name');
  return populatedBook;
}
export async function findBookService(_id){
  const book = await Book.findById(_id)
    .populate('categoryId', 'name')
    .populate('publisherId', 'name')
    .lean()
  if (!book){
    throw new Error(`Book with id ${_id} not found`);
  }
  const authors = await BookAuthor.find({ bookId: book._id })
    .populate('authorId', 'name');
  book.authors = authors.map(a => a.authorId.name);
  return book;
}

export async function deleteBookService(id){
  const book = await Book.findById(id)
  if (!book){
    throw new Error(`Book with id ${_id} not found`);
  }
  await BookAuthor.deleteMany({ bookId: book._id });
  await Book.findByIdAndDelete(book._id);
  return book;
}

export async function getAllBooksService(query) {
  // 1. Lấy tham số (mặc định page 1, limit 12 cho đẹp giao diện lưới)
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 12;
  const search = query.search || '';
  const categoryId = query.categoryId || null

  // 2. Tạo filter tìm kiếm
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if(categoryId) {
    filter.categoryId = categoryId
  }

  const skip = (page - 1) * limit;

  // 3. Query DB (Song song: Lấy data + Đếm tổng)
  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate('categoryId', 'name')   // Chỉ lấy tên Category
      .populate('publisherId', 'name')  // Chỉ lấy tên NXB

      // --- TỐI ƯU HÓA (Theo lời khuyên của bạn ông) ---
      // Loại bỏ field 'description' (mô tả dài) và '__v'
      // Nếu field mô tả của bạn tên là 'content' hay 'detail' thì đổi tên tương ứng nhé
      .select('-description -__v')

      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất
      .lean(),                 // Chuyển về Object thường để xử lý nhanh hơn

    Book.countDocuments(filter)
  ]);

  // 4. Gắn tác giả vào sách (Vì dùng bảng trung gian)
  const booksWithAuthors = await Promise.all(books.map(async (book) => {
    // Tìm các record trong bảng trung gian BookAuthor
    const authorsRel = await BookAuthor.find({ bookId: book._id })
      .populate('authorId', 'name'); // Chỉ lấy tên tác giả

    return {
      ...book,
      // Trả về mảng tác giả gọn gàng
      authors: authorsRel.map(a => a.authorId),
      // Mẹo nhỏ: Frontend muốn hiển thị 1 hình thì cứ lấy imageUrl[0]
    };
  }));
  // 5. Trả về kết quả
  return {
    data: booksWithAuthors,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit: limit
    }
  };
}