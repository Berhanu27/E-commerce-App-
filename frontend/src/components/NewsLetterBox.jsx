import React from 'react'

const NewsLetterBox = () => {

    const onSubmitHandler=(even)=>{
        event.preventDefault();

    }
  return (
    <div className='text-center py-10'>

      <p className='text-2xl font-medium text-gray-800'>
        Subscribe now & get 20% off
      </p>

      <p className='text-gray-400 mt-3 max-w-xl mx-auto'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium cupiditate
        veritatis tempora magni nostrum dolorum commodi maiores ducimus id esse.
      </p>

      <form onSubmit={onSubmitHandler} className='w-fully  sm:w-1/2 flex items-center gap-3 mt-6  mx-auto  pl-3'>
        <input
          className='w-full flex-1 outline-none border border-gray-300 px-4 py-3 rounded'
          type="email"
          placeholder='Enter your email'
          required
        />

        <button
          type='submit'
          className='bg-black text-white text-xs px-10 py-3 rounded'
        >
          Subscribe
        </button>
      </form>

    </div>
  )
}

export default NewsLetterBox
