import React from 'react'
import ProductCard, { ProductCardProps } from '../collections/components/ProductCard'
import { Book } from '@/types/book.type'

interface BookShowCaseProps {
    title: string,
    books: Array<Book>
}  

const BookShowCase = ({title, books}: BookShowCaseProps) => {
  return (
    <div className='w-full mt-12 mb-20'>
      {/* Centered Title */}
      <div className='text-center mb-5'>
        <h2 className='font-semibold text-3xl text-gray-900 mb-4'>{title}</h2>
        <div className='w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full'></div>
        <p className='text-gray-600 mt-3 text-lg'>Khám phá bộ sưu tập sách đặc biệt</p>
      </div>

      {/* Book Grid */}
      <div className='grid lg:grid-cols-5 grid-cols-2 md:grid-cols-4 gap-1 px-2'>
        {books.map((book, index) =>(
            <ProductCard 
                key={index}
                _id={book._id}
                imgSrc={book.imageUrl[0]}
                name={book.name}
                price={book.price}
                />
        ))}
      </div>
    </div>
  )
}

export default BookShowCase