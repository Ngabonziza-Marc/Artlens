"use client";
import withAuth from "@/utlis/withauth";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaDownload, FaArrowUp } from "react-icons/fa";

const PinterestHome = () => {
  const router = useRouter(); 
  const [images, setImages] = useState([]);
  const [likes, setLikes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const bottomRef = useRef(null);


  const API_KEY = "6v8BZWtFFWIIVFsXtAskpmnTiYlHv7kSYvfbEKQvxipIEIyX62FmCW2B";

  const fetchImages = async (query = "nature", pageNum = 1, isNewSearch = false) => {
    setIsLoading(true);
    try {
      const endpoint = query === "nature"
        ? "https://api.pexels.com/v1/curated"
        : "https://api.pexels.com/v1/search";

      const response = await axios.get(endpoint, {
        headers: { Authorization: API_KEY },
        params: {
          query,
          per_page: 30,
          page: pageNum,
        },
      });

      let newPhotos = response.data.photos;

      // Apply sorting
      if (sortType === "oldest") {
        newPhotos.reverse();
      } else if (sortType === "random") {
        newPhotos = [...newPhotos].sort(() => 0.5 - Math.random());
      }

      if (isNewSearch || pageNum === 1) {
        setImages(newPhotos);
      } else {
        setImages((prev) => [...prev, ...newPhotos]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages(searchQuery || "nature", 1, true);
  }, [sortType]);

  useEffect(() => {
    fetchImages(searchQuery || "nature", page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [bottomRef, isLoading]);

  // Handle scrolling to top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim() || "nature";
    setImages([]);
    setPage(1);
    fetchImages(query, 1, true);
  };

  const toggleLike = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: !prevLikes[id],
    }));
  };

  const handleSignout = async () => {
    await signOut({ redirect: false });

    window.location.href = '/signin'
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="p-6 bg-neutral-100 min-h-screen">
      <div className="text-black flex justify-between items-center flex-wrap mb-6">
        <h1 className="text-3xl font-bold text-gray-800 w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
        <span className="font-bold text-5xl">Art</span>Lens 
        </h1>

        {/* Search and Sort */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap justify-center gap-4 w-full md:w-auto items-center"
        >
          <input
            type="text"
            placeholder="Search for images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 w-full sm:w-[400px] md:w-[350px] lg:w-[600px] border border-black rounded-2xl text-lg"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition w-full sm:w-auto"
          >
            Search
          </button>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="p-3 border border-black rounded-2xl text-lg w-full sm:w-auto"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="random">Random</option>
          </select>
        </form>

        {/* Sign out Button */}
        <button
          onClick={handleSignout}
          className="p-3 border border-black hover:border-black/30 rounded-xl transition duration-300 w-full sm:w-auto mt-4 md:mt-0"
        >
          Sign out
        </button>
      </div>

      {/* Image Gallery */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative break-inside-avoid group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <Image
              src={image.src.large}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Hover Controls */}
            <div className="absolute top-2 right-2 flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-2">
              {/* Like */}
              <button
                onClick={() => toggleLike(image.id)}
                className="bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white"
              >
                {likes[image.id] ? (
                  <FaHeart className="text-black" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
              </button>

              {/* Download */}
              <a
                href={image.src.original}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white"
              >
                <FaDownload className="text-gray-700" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={bottomRef} className="text-center py-6">
        {isLoading && <span className="text-gray-500">Loading more images...</span>}
      </div>

      {/* Back to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
        >
          <FaArrowUp />
        </button>
      )}
    </main>
  );
};

export default withAuth(PinterestHome);
