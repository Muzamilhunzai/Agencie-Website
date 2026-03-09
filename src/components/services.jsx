import React from 'react';
import assets from '../assets/assets';
import Title from './title';
import ServiceCard from './ServiceCard';

const Services = () => {
  const services = [
    {
      title: "Advertising",
      description: "Building responsive and user-friendly websites that drive results.",
      icon: assets.marketing_icon
    },
    {
      title: "Branding",
      description: "Crafting compelling brand identities that resonate with your audience.",
      icon: assets.content_icon
    },
    {
      title: "Content Creation",
      description: "Producing engaging content that captivates and converts.",
      icon: assets.social_icon
    },
     {
      title: "Content Creation",
      description: "Producing engaging content that captivates and converts.",
      icon: assets.social_icon
    }
  ];

  return (
    <div
      id='services'
      className='relative flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'
    >
      <img
        src={assets.bgImage2}
        alt=""
        className='absolute -top-110 -left-70 -z-10 dark:hidden'
      />

      <Title title="How can we help" desc='From strategy' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>

    </div>
  );
};

export default Services;  