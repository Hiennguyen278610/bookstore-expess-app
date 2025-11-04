import React from 'react'
import ProductCard, { ProductCardProps } from '../common/ProductCard'


interface BookShowCaseProps {
    title: string,
    books: Array<ProductCardProps>
}  

const BookShowCase = ({title, books}: BookShowCaseProps) => {
  return (
    <div className='w-full mt-4 mb-12'>
      <h2 className='font-semibold text-2xl mb-2'>{title}</h2>
      <div className='grid lg:grid-cols-5 grid-cols-2 md:grid-cols-3'>
        {books.map((book, index) =>(
            <ProductCard 
                key={index}
                {...book}
            />
        ))}
      </div>
    </div>
  )
}

export default BookShowCase
