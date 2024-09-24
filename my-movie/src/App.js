import React, { useState, useEffect } from "react";
import { FaSearch, FaHeart, FaStar, FaMoon, FaSun, FaSort, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";

const MovieWebsite = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState("");
  const moviesPerPage = 18;

  const API = "";

  useEffect(() => {
    fetchMoviesAndGenres();
  }, [currentPage, sortBy, selectedGenre]);

  const fetchMoviesAndGenres = async () => {
    try {
      const [moviesResponse, genresResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: API,
            sort_by: `${sortBy}.desc`,
            page: currentPage,
            with_genres: selectedGenre,
          },
        }),
        axios.get("https://api.themoviedb.org/3/genre/movie/list", {
          params: {
            api_key: API,
          },
        }),
      ]);

      const moviesWithGenres = await Promise.all(
        moviesResponse.data.results.slice(0, moviesPerPage).map(async (movie) => {
          const genreResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              params: {
                api_key: API,
              },
            }
          );
          return { ...movie, genres: genreResponse.data.genres.map((g) => g.name) };
        })
      );

      setMovies(moviesWithGenres);
      setGenres(genresResponse.data.genres);
      setTotalPages(Math.ceil(moviesResponse.data.total_results / moviesPerPage));
    } catch (error) {
      console.error("Error fetching movies and genres:", error);
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: API,
              query: e.target.value,
              page: 1,
            },
          }
        );
        const moviesWithGenres = await Promise.all(
          response.data.results.slice(0, moviesPerPage).map(async (movie) => {
            const genreResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}`,
              {
                params: {
                  api_key: API,
                },
              }
            );
            return { ...movie, genres: genreResponse.data.genres.map((g) => g.name) };
          })
        );
        setMovies(moviesWithGenres);
        setCurrentPage(1);
        setTotalPages(Math.ceil(response.data.total_results / moviesPerPage));
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      fetchMoviesAndGenres();
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
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputPage("");
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <header className={`${darkMode ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-blue-500 to-indigo-600"} text-white py-6 shadow-lg`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-extrabold tracking-tight">MovieApp</h1>
            <span className="hidden md:inline-block text-sm font-medium bg-opacity-20 bg-white px-3 py-1 rounded-full">Discover & Watch</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              className={`${darkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-white"} p-2 rounded-full transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>
            {user ? (
              <button className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white text-blue-600 hover:bg-blue-50"} font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}>
                Logout
              </button>
            ) : (
              <button className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white text-blue-600 hover:bg-blue-50"} font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}>
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
                <option value="popularity">Sort by Popularity</option>
                <option value="vote_average">Sort by Rating</option>
                <option value="release_date">Sort by Release Date</option>
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
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
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

        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FaChevronLeft />
          </button>
          <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Page
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0 && value <= totalPages) {
                  setCurrentPage(value);
                }
              }}
              className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} border border-gray-300 rounded-md px-2 py-1 w-16 ml-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FaChevronRight />
          </button>
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
