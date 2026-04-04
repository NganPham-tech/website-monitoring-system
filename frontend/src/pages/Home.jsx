import React from 'react';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Stats from '../components/home/Stats';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full">
        <Hero />
        <Features />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
