"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videoSrc } from "@/utils/variables";
import ContactButton from "@/components/global/ContactButton";
import { CldVideoPlayer } from "next-cloudinary";
// @ts-expect-error: no type declarations for this side-effect CSS import
import "next-cloudinary/dist/cld-video-player.css";

// Loading Component
const LoadingSpinner = () => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-600 via-green-600 to-gray-600 z-20"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="flex flex-col items-center space-y-6">
      {/* Animated Spinner */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h3 className="text-xl md:text-3xl font-semibold text-white mb-2">
          Loading..
        </h3>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-300 text-sm"
        >
          Your drone solutions...
        </motion.div>
      </motion.div>

      <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-white rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      </div>
    </div>
  </motion.div>
);

export default function VideoSection() {
  const endRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleExploreClick = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fake loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Add custom CSS for video coverage */}
      <style jsx>{`
        .video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .video-container :global(.cld-video-player) {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: cover;
        }

        .video-container :global(.cld-video-player video) {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: cover;
        }
      `}</style>

      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden">
        {/* Background Video */}
        <div className="video-container">
          <CldVideoPlayer
            src={videoSrc}
            width={1920}
            height={1080}
            autoplay
            loop
            muted
            controls={false}
            playsinline
          />
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>{isLoading && <LoadingSpinner />}</AnimatePresence>

        {/* Main Content */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-3xl md:text-5xl font-bold max-w-3xl drop-shadow-lg"
              >
                India&apos;s Future Leader in Advanced Drone Solutions and
                Impact
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="mt-8 flex flex-col md:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExploreClick}
                  className="inline-flex items-center justify-center gap-2 font-medium text-black transition-all duration-300 hover:shadow-lg hover:bg-gray-100 rounded-lg px-6 py-3 text-base bg-white"
                >
                  Explore
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ContactButton />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={endRef} className="w-full h-1" />
      </section>
    </>
  );
}
