import React from 'react';
import TinderCard from 'react-tinder-card';

const TinderCardComponent = ({ person }) => {
  const { name, age, photo } = person;

  return (
    <TinderCard
      className="absolute w-full max-w-md h-[75vh] shadow-lg rounded-xl bg-white overflow-hidden"
      preventSwipe={['up', 'down']}
    >
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url('${photo}')` }}
      >
        <div className="bg-gradient-to-t from-black via-transparent to-transparent h-full flex items-end p-4">
          <h3 className="text-white text-2xl font-bold">
            {name}, {age}
          </h3>
        </div>
      </div>
    </TinderCard>
  );
};

export default TinderCardComponent;
