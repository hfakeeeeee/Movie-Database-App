import React, { useState, useEffect } from "react";
import { FaSearch, FaHeart, FaStar, FaMoon, FaSun, FaSort } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";

const MovieWebsite = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchMoviesAndGenres = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/movie/popular", {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2U3YWRhNjk0YTdlNzY5YmZmYjg4ODc3Mjg2ZDI2MiIsIm5iZiI6MTcyNjczNzAwMy42Mzc1OTEsInN1YiI6IjY2ZWE3NGVjYjY2NzQ2ZGQ3OTBiMWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPGfk8xBk2clpb_42et7YLHabVDGZy3NSiBbTlSw3_Y",
            },
          }),
          axios.get("https://api.themoviedb.org/3/genre/movie/list", {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2U3YWRhNjk0YTdlNzY5YmZmYjg4ODc3Mjg2ZDI2MiIsIm5iZiI6MTcyNjczNzAwMy42Mzc1OTEsInN1YiI6IjY2ZWE3NGVjYjY2NzQ2ZGQ3OTBiMWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPGfk8xBk2clpb_42et7YLHabVDGZy3NSiBbTlSw3_Y",
            },
          }),
        ]);

        const moviesWithGenres = await Promise.all(
          moviesResponse.data.results.map(async (movie) => {
            const genreResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2U3YWRhNjk0YTdlNzY5YmZmYjg4ODc3Mjg2ZDI2MiIsIm5iZiI6MTcyNjczNzAwMy42Mzc1OTEsInN1YiI6IjY2ZWE3NGVjYjY2NzQ2ZGQ3OTBiMWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPGfk8xBk2clpb_42et7YLHabVDGZy3NSiBbTlSw3_Y",
                },
              }
            );
            return { ...movie, genres: genreResponse.data.genres.map(g => g.name) };
          })
        );
        setMovies(moviesWithGenres);
        setGenres(genresResponse.data.genres);
      } catch (error) {
        console.error("Error fetching movies and genres:", error);
      }
    };
    fetchMoviesAndGenres();
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
        const moviesWithGenres = await Promise.all(
          response.data.results.map(async (movie) => {
            const genreResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2U3YWRhNjk0YTdlNzY5YmZmYjg4ODc3Mjg2ZDI2MiIsIm5iZiI6MTcyNjczNzAwMy42Mzc1OTEsInN1YiI6IjY2ZWE3NGVjYjY2NzQ2ZGQ3OTBiMWMwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPGfk8xBk2clpb_42et7YLHabVDGZy3NSiBbTlSw3_Y",
                },
              }
            );
            return { ...movie, genres: genreResponse.data.genres.map(g => g.name) };
          })
        );
        setMovies(moviesWithGenres);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    if (e.target.value === "rating") {
      setMovies([...movies].sort((a, b) => b.vote_average - a.vote_average));
    } else if (e.target.value === "alphabetical") {
      setMovies([...movies].sort((a, b) => a.title.localeCompare(b.title)));
    }
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genres.includes(selectedGenre))
    : movies;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <header className={`${darkMode ? "bg-gray-800" : "bg-blue-600"} text-white p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MovieApp</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`${darkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-white"} p-2 rounded-full`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            {user ? (
              <button className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded`}>
                Logout
              </button>
            ) : (
              <button className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded`}>
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className={`flex items-center ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg overflow-hidden px-2 py-1 w-full md:w-1/1`}>
            <input
              className={`text-base ${darkMode ? "text-gray-300 bg-gray-800" : "text-gray-400 bg-white"} flex-grow outline-none px-3`}
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
              <FaSearch className={darkMode ? "text-gray-300" : "text-gray-500"} />
            </div>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="flex items-center">
              <FaSort className={`mr-2 ${darkMode ? "text-gray-300" : "text-gray-500"}`} />
              <select
                value={sortBy}
                onChange={handleSort}
                className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              >
                <option value="rating">Sort by Rating</option>
                <option value="alphabetical">Sort Alphabetically</option>
              </select>
            </div>
            <div className="flex items-center">
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden flex flex-col`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2`}>
                  {movie.release_date?.split("-")[0]} • {movie.genres?.join(", ")}
                </p>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-yellow-500 flex items-center">
                  <FaStar className="mr-1" /> {movie.vote_average?.toFixed(1)}
                </span>
                <button
                  onClick={() => isInWatchlist(movie.id) ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                  className={`${isInWatchlist(movie.id) ? (darkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700") : (darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700")} text-2xl`}
                >
                  {isInWatchlist(movie.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={`${darkMode ? "bg-gray-800" : "bg-gray-900"} text-white p-4 mt-12`}>
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MovieApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MovieWebsite;
