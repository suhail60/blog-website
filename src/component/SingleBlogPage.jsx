import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SingleBlogPage() {
      const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_API
    : import.meta.env.VITE_APP_PROD_API;

  useEffect(() => {
    fetch(`${API_BASE_URL}api/blog/read/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error('Error:', err));
  }, [id]);
//   console.log(blog)

 

  if (!blog) return <p>Loading...</p>;
  return (
    <>



     <div className="blog-post-container">
         <div className="blog-header">
            <span className="blog-category">{blog.category}</span>
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-meta">
                <div className="blog-author">
                    <img  src={blog.pic?.startsWith('http') ? blog.pic : `${API_BASE_URL}${blog.pic}`} alt="Sarah Johnson"/>
                    <span>{blog.author}</span>
                </div>
                <div className="blog-date">
                    <i className="far fa-calendar-alt"></i>
                    <span>{blog.publishDate}</span>
                </div>
            </div>
        </div>

        <div className="featured-image">
        <img   src={blog.pic?.startsWith('http') ? blog.pic : `${API_BASE_URL}${blog.pic}`}alt="" />
        </div>

        <div className="blog-content">
            {blog.content}
        </div> 

        <div className="blog-tags">
            {/* <a href="#" className="blog-tag">{blog.hashtag}</a>
            <a href="#" className="blog-tag">{blog.hashtag}</a>
            <a href="#" className="blog-tag">{blog.hashtag}</a>
            <a href="#" className="blog-tag">{blog.hashtag}</a>
            <a href="#" className="blog-tag">{blog.hashtag}</a> */}
         {blog.hashtag && blog.hashtag.map((tag, index) => (
          <span className="blog-tag" key={index} style={{ marginRight: "8px" }}>
            {tag}
          </span>
        ))}

        </div>

        <div className="blog-footer">
            <div className="social-share">
                <a href="#" aria-label="Share on Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="Share on Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Share on LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" aria-label="Share via Email"><i className="far fa-envelope"></i></a>
            </div>
            <a href="/" className="back-to-blog" id="backButton"><i className="fas fa-arrow-left"></i> Back to Blog</a>
        </div>
    </div> 
    
</>
  )
}

export default SingleBlogPage