import React from "react";
import { motion } from "framer-motion";
import { FiLoader, FiFilm, FiVideo, FiAward } from "react-icons/fi";

const MovieLoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-6 relative"
        >
          <FiLoader className="w-full h-full text-white animate-spin" />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FiFilm className="w-12 h-12 text-yellow-300" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center space-x-4 mb-4"
        >
          <FiVideo className="w-8 h-8 text-white" />
          <h1 className="text-4xl font-bold text-white">Loading Movie</h1>
          <FiAward className="w-8 h-8 text-yellow-300" />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white text-opacity-90 text-lg"
        >
          Preparing a cinematic experience just for you...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default MovieLoadingPage;