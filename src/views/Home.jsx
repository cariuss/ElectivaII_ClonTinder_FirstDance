import React, { useState, useEffect } from 'react';
import TinderCardComponent from '../components/TinderCardComponent';

const Home = () => {
  const [people, setPeople] = useState([]);

  // Simulate fetching from MongoDB
  useEffect(() => {
    setPeople([
      {
        name: 'Alice',
        age: 25,
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        name: 'Bob',
        age: 30,
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        name: 'Clara',
        age: 28,
        photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    ]);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen relative">
      <div className="relative w-full max-w-md h-[75vh]">
        {people.map((person, index) => (
          <TinderCardComponent key={index} person={person} />
        ))}
      </div>
    </div>
  );
};

export default Home;