import React, { useState, useEffect } from "react";

const FeaturedMovie = ({ movies, handleMovieClick, darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalMovies = movies.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prevIndex) =>
        prevIndex === totalMovies - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(true);

      setTimeout(() => {
        setIsTransitioning(false);
        setPrevIndex(null);
      }, 1000);
    }, 4000); 

    return () => clearInterval(interval);
  }, [currentIndex, totalMovies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const prevMovie = prevIndex !== null ? movies[prevIndex] : null;

  return (
    <div className="relative w-full h-96 mb-8 cursor-pointer overflow-hidden">
      {prevMovie && (
        <img
          src={`https://image.tmdb.org/t/p/original${prevMovie.backdrop_path}`}
          alt={prevMovie.title}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      <img
        src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
        alt={currentMovie.title}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => handleMovieClick(currentMovie)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      <div className="absolute bottom-8 left-8 text-white max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">{currentMovie.title}</h2>
        <p className="text-lg mb-4 line-clamp-3">{currentMovie.overview}</p>
        <p className="text-sm">{currentMovie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
};

export default FeaturedMovie;
