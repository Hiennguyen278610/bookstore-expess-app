import Book from "../models/Book.js";
import BookAuthor from "../models/BookAuthor.js";
import {
  deleteImageIntoCloudinary,
  uploadToCloudinary,
} from "../middlewares/uploadImage.js";

export async function createBookService(book, files) {
  try {
    let { name, categoryId, publisherId, quantity, price, authors } = book;
    authors = JSON.parse(authors);
    if (!name || !categoryId || !publisherId || !authors) {
      // chan do phai fetch len neu du lieu loi
      throw new Error("Can't upload image to cloudinary!");
    }
    const imageUrl = await uploadToCloudinary(files);
    const newBook = await Book.create({
      name: name,
      categoryId: categoryId,
      publisherId: publisherId,
      imageUrl: imageUrl,
      quantity: quantity,
      price: price,
    });
    if (authors && authors.length > 0) {
      await Promise.all(
        authors.map(async (item) => {
          return await BookAuthor.create({
            bookId: newBook._id,
            authorId: item.authorId,
          });
        })
      );
    }
    const populatedBook = await Book.findById(newBook._id)
      .populate("categoryId", "name")
      .populate("publisherId", "name")
      .lean();
    populatedBook.authors = await BookAuthor.find({
      bookId: newBook._id,
    }).populate("authorId", "name");
    return populatedBook;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function updateBookService(id, data, files) {
  const { name, categoryId, publisherId, quantity, price, authors, existingImages } = data;
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
          authorId: author.authorId,
        });
      }
      await BookAuthor.insertMany(newAuthors);
    }
  }

  // Only update images if new files are provided
  if (files && files.length > 0) {
    await deleteImageIntoCloudinary(book.imageUrl);
    const imageUrl = await uploadToCloudinary(files);
    book.imageUrl = imageUrl;
  } else if (existingImages && Array.isArray(existingImages)) {
    // Keep existing images if provided
    book.imageUrl = existingImages;
  }
  // If neither files nor existingImages, keep current book.imageUrl

  await book.save();
  const populatedBook = await Book.findById(book._id)
    .populate("categoryId", "name")
    .populate("publisherId", "name")
    .lean();
  populatedBook.authors = await BookAuthor.find({ bookId: book._id }).populate(
    "authorId",
    "name"
  );
  return populatedBook;
}
export async function findBookService(_id) {
  const book = await Book.findById(_id)
    .populate("categoryId", "name")
    .populate("publisherId", "name")
    .lean();
  if (!book) {
    throw new Error(`Book with id ${_id} not found`);
  }
  const authors = await BookAuthor.find({ bookId: book._id }).populate(
    "authorId",
    "name"
  );
  book.authors = authors.map((a) => a.authorId.name);
  return book;
}

export async function deleteBookService(id) {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error(`Book with id ${_id} not found`);
  }
  await BookAuthor.deleteMany({ bookId: book._id });
  await Book.findByIdAndDelete(book._id);
  return book;
}

export async function getAllBooksService(query) {
  try {
    // 1. Parse query parameters
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 12));
    const search = query.search?.trim() || "";
    const categoryId = query.categoryId || null;
    const minPrice = query.minPrice ? Number(query.minPrice) : null;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : null;
    const sortBy = query.sortBy || "newest";

    let publisherIds = [];

    if (query.publishers) {
      if (typeof query.publishers === "string") {
        publisherIds = query.publishers.split(",").filter((id) => id.trim());
      } else if (Array.isArray(query.publishers)) {
        publisherIds = query.publishers.filter((id) => id && id.trim());
      }
    } else if (query.publisherId) {
      publisherIds = [query.publisherId];
    }

    // 2. Build filter
    const filter = { isDeleted: false };

    // Search filter
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Category filter
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (publisherIds.length > 0) {
      filter.publisherId = { $in: publisherIds };
    }

    // Price range filter
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};

      if (minPrice !== null) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== null) {
        filter.price.$lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    // 3. Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "name_asc":
        sortOptions = { name: 1 };
        break;
      case "name_desc":
        sortOptions = { name: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // 4. Query database
    const [books, total] = await Promise.all([
      Book.find(filter)
        .populate("categoryId", "name")
        .populate("publisherId", "name")
        .skip(skip)
        .limit(limit)
        .sort(sortOptions)
        .lean(),
      Book.countDocuments(filter),
    ]);

    // 5. Get authors for all books in one query
    if (books.length > 0) {
      const bookIds = books.map((book) => book._id);

      const allAuthorsRel = await BookAuthor.find({
        bookId: { $in: bookIds },
      })
        .populate("authorId", "name")
        .lean();

      // Group authors by bookId
      const authorsByBookId = {};
      allAuthorsRel.forEach((rel) => {
        const bookId = rel.bookId.toString();
        if (!authorsByBookId[bookId]) {
          authorsByBookId[bookId] = [];
        }
        authorsByBookId[bookId].push(rel.authorId);
      });

      // Attach authors to books
      const booksWithAuthors = books.map((book) => ({
        ...book,
        authors: authorsByBookId[book._id.toString()] || [],
        mainImage: book.imageUrl?.[0] || "https://placehold.co/400x600/e2e8f0/64748b?text=No+Image",
      }));

      return {
        success: true,
        message: "Get all books successfully",
        data: booksWithAuthors,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit: limit,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        filtersApplied: {
          publishers: publisherIds,
          hasCategory: !!categoryId,
          hasPriceFilter: minPrice !== null || maxPrice !== null,
          hasSearch: !!search,
        },
      };
    }

    // 6. Return empty result
    return {
      success: true,
      message: "Get all books successfully",
      data: [],
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNext: false,
        hasPrev: false,
      },
      filtersApplied: {
        publishers: publisherIds,
        hasCategory: !!categoryId,
        hasPriceFilter: minPrice !== null || maxPrice !== null,
        hasSearch: !!search,
      },
    };
  } catch (error) {
    console.error("Error in getAllBooksService:", error);
    throw error;
  }
}

export async function getMaxPriceService() {
  try {
    const maxPriceBook = await Book.findOne({ isDeleted: false })
      .sort({ price: -1 })
      .select("price")
      .lean();

    return maxPriceBook?.price || 0;
  } catch (error) {
    console.error("Error getting max price:", error);
    return 0;
  }
}
