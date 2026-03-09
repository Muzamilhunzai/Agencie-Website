import React from 'react';
import Title from './Title';
import { teamData } from '../assets/assets'; // Correct import

const Teams = () => {
  return (
    <div className="flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-8 text-gray-800 dark:text-white">
      <Title 
        title="Meet the Team" 
        desc="A passionate team of digital experts dedicated to your brand"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {teamData.map((team, index) => (
          <div
            key={index}
            className="flex max-sm:flex-col items-center gap-5 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl dark:shadow-white/5 hover:scale-105 transition-all duration-300"
          >
            <img
              src={team.image}
              alt={team.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg">{team.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{team.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;