import React from "react";

const FeaturedMovie = ({ movie, handleMovieClick, darkMode }) => {
  if (!movie) return null;

  return (
    <div
      className="relative w-full h-96 mb-8 cursor-pointer"
      onClick={() => handleMovieClick(movie)}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
      alt={movie.title}
      className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute bottom-8 left-8 text-white">
        <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
        <p className="text-lg mb-4 max-w-xl">{movie.overview}</p>
        <p className="text-sm">{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
};

export default FeaturedMovie;
