import React from 'react';
import { useEffect, useState } from 'react';
import { useContext } from "react";
import { BlogContext } from "../context/blog";
import { Link } from 'react-router-dom';
import Pagination from './Pagination';

function Layout() {
  const { filteredData, loading, error,  } = useContext(BlogContext);
  const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_API
    : import.meta.env.VITE_APP_PROD_API;
  
       if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;
  console.log(filteredData)
  return (
  

    <>

      <div id="blogbody" className="blog-container ">
        {filteredData.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        filteredData.map((item) => (
          <Link to={`/blog/${item._id}`} key={item._id}  className="blog-card " style={{textDecoration:"none"}}>
            <div className="card-image">
              <img src={item.pic?.startsWith('http') ? item.pic : `${API_BASE_URL}${item.pic}`} alt={item.title} />
            </div>
            <div className="card-content">
              <span className="category">{item.category}</span>
              <h3 className="title">{item.title}</h3>
              <p className="excerpt">  {item.content.split(" ").slice(0, 30).join(" ")}{item.content.split(" ").length > 30 && '...'}</p>
              <div className="meta">
                <div className="author">
                  <img src={item.pic?.startsWith('http') ? item.pic : `${API_BASE_URL}/${item.pic}`} alt={item.author} />
                  <span>{item.author}</span>
                </div>
                <span>{item.publishDate}</span>
              </div>
              <span href="/home" className="read-more">
                Read more <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </Link>
        ))
      )}


        {/* Blog Post Card 1 (you can add your content here) */}

        {/* Blog Post Card 2 */}
         {/* <div className="blog-card">
          <div className="card-image">
            <img
              src="https://source.unsplash.com/random/600x400/?science"
              alt="Science Discovery"
            />
          </div>
          <div className="card-content">
            <span className="category">Science</span>
            <h3 className="title">
              Breakthrough in Quantum Computing: What This Means for Encryption
            </h3>
            <p className="excerpt">
              Researchers have made a significant leap in quantum computing
              that could revolutionize data security. Learn about the
              implications for cybersecurity.
            </p>
            <div className="meta">
              <div className="author">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Author"
                />
                <span>David Chen</span>
              </div>
              <span>May 10, 2023</span>
            </div>
            <a href="#" className="read-more">
              Read more <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div> */}

        {/* Blog Post Card 3 */}
        {/* <div className="blog-card">
          <div className="card-image">
            <img
              src="https://source.unsplash.com/random/600x400/?health"
              alt="Health Wellness"
            />
          </div>
          <div className="card-content">
            <span className="category">Health</span>
            <h3 className="title">
              The Gut-Brain Connection: How Your Microbiome Affects Mental Health
            </h3>
            <p className="excerpt">
              New research reveals surprising links between gut bacteria and
              conditions like anxiety and depression. Explore the science behind
              this connection.
            </p>
            <div className="meta">
              <div className="author">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Author"
                />
                <span>Maria Rodriguez</span>
              </div>
              <span>May 5, 2023</span>
            </div>
            <a href="#" className="read-more">
              Read more <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>  */}
      </div>

      {/* <div className="pagination">
        <li className="page-item">
          <a href="#" className="page-link prev-next disabled">
            <i className="fas fa-chevron-left"></i>
            <span>Previous</span>
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link active">
            1
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link">
            2
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link">
            3
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link">
            4
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link">
            5
          </a>
        </li>
        <li className="page-item">
          <a href="#" className="page-link prev-next">
            <span>Next</span>
            <i className="fas fa-chevron-right"></i>
          </a>
        </li>
      </div> */}
      <Pagination/>
    </>
  );
}

export default Layout;
