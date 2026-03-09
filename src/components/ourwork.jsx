import React from 'react'
import Title from './title'
import assets from '../assets/assets'

const OurWork = () => {

  const workData = [
    {
      img: assets.work_fitness_app,
      title: "Project Management Tool",
      desc: "A project management tool that helps teams collaborate, track progress, and meet deadlines efficiently."
    },
    {
      img: assets.work_dashboard_management,
      title: "E-commerce Platform",
      desc: "An e-commerce platform that provides a seamless shopping experience with features like product browsing, secure payments, and order tracking."
    },
    {
      img: assets.work_mobile_app,
      title: "Social Media App",
      desc: "A social media app that connects people, allowing them to share updates, photos, and engage with friends and communities."
    }
  ]

  return (
    <div
      id='our-work'
      className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'
    >

      <Title
        title="Our latest work"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus nihil magnam explicabo dolores. Harum natus, minima dolorem in nisi totam."
      />

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl'>
        {workData.map((work, index) => (
          <div
            key={index}
            className='hover:scale-105 duration-500 transition-all cursor-pointer'
          >

            <img
              src={work.img}
              className='w-full rounded-xl'
              alt={work.title}
            />

            <h3 className='mt-3 mb-2 text-lg font-semibold'>
              {work.title}
            </h3>

            <p>
              {work.desc}
            </p>

          </div>
        ))}
      </div>

    </div>
  )
}

export default OurWork