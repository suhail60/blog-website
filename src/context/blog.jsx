import React, { createContext, useState, useEffect } from "react";

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 3 items per page
  const [isAuthenticated, setAuthenticated] = useState(false)
const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    // const user = localStorage.getItem("user");
    if(token){

      setAuthenticated(true);
      
    }

  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthenticated(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);


  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://blog-website-backend-ea82.onrender.com/api/blog/read");
        const blogs = await res.json();
        setData(blogs);
        setError(null);
      } catch (err) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
const filteredData = data.filter((blog) => {
  let term = searchTerm.toLowerCase();
  return (
    blog?.title?.toLowerCase().includes(term) ||
    blog?.category?.toLowerCase().includes(term) ||
    blog?.content?.toLowerCase().includes(term) ||
    blog?.author?.toLowerCase().includes(term)
  );
});


  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <BlogContext.Provider
      value={{ 
        data, 
        filteredData: currentItems, 
        searchTerm, 
        setSearchTerm, 
        loading, 
        error,
        currentPage,
        totalPages,
        paginate,
        // isLoggedIn,
        isAuthenticated,
        setAuthenticated,
        logout
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};