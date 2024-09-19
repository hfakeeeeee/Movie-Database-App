import React, { useState, useEffect } from "react";
import { FaSearch, FaHeart, FaStar, FaShareAlt } from "react-icons/fa";
import axios from "axios";

const MovieWebsite = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2U3YWRhNjk0YTdlNzY5YmZmYjg4ODc3Mjg2ZDI2MiIsIm5iZiI6MTcyNjczNzAwMy42Mzc1OTEsInN1YiI6IjY2ZWE3NGVjYjY2NzQ2ZGQ3OTBiMWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPGfk8xBk2clpb_42et7YLHabVDGZy3NSiBbTlSw3_Y",
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${e.target.value}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2U3YWRhNjk0YTdlNzY5YmZmYjg4ODc3Mjg2ZDI2MiIsIm5iZiI6MTcyNjczNzAwMy42Mzc1OTEsInN1YiI6IjY2ZWE3NGVjYjY2NzQ2ZGQ3OTBiMWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPGfk8xBk2clpb_42et7YLHabVDGZy3NSiBbTlSw3_Y",
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    }
  };

  const addToWatchlist = (movie) => {
    setWatchlist([...watchlist, movie]);
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(watchlist.filter((m) => m.id !== movieId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Movie App</h1>
          {user ? (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-8">
          <div className="flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
            <input
              className="text-base text-gray-400 flex-grow outline-none px-2"
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-2">{movie.release_date?.split("-")[0]} • {movie.genre?.join(", ")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 flex items-center">
                    <FaStar className="mr-1" /> {movie.vote_average?.toFixed(1)}
                  </span>
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
          {watchlist.length === 0 ? (
            <p>Your watchlist is empty. Start adding movies!</p>
          ) : (
            <ul className="space-y-4">
              {watchlist.map((movie) => (
                <li
                  key={movie.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <span>{movie.title}</span>
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MovieApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MovieWebsite;
