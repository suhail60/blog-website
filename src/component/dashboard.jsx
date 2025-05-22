import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';
import BlogUpdate from '../component/blogupdate';
import "./dashboard.css";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('myBlogs');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const initialBlogState = {
    title: '',
    topic: '',
    category: '',
    description: '',
    content: '',
    pic: null,
    existingPic: null,
    hashtag: []
  };

  const [newBlog, setNewBlog] = useState(initialBlogState);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch("http://localhost:5000/api/blog/myBlogs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        const decoded = jwtDecode(token);
        const loggedUserId = decoded.userId || decoded.id || decoded._id;

        const userBlogs = Array.isArray(data)
          ? data.filter(blog => {
              const createdBy = blog.createdBy;
              return typeof createdBy === "object"
                ? createdBy._id === loggedUserId
                : createdBy === loggedUserId;
            })
          : [];

        setBlogs(userBlogs);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleHashtagChange = (e) => {
    const hashtags = e.target.value.split(',').map(tag => tag.trim());
    setNewBlog(prev => ({ ...prev, hashtag: hashtags }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBlog(prev => ({ ...prev, pic: file }));
  };

  const handleEditClick = (blog) => {
    setIsEditMode(true);
    setEditingBlogId(blog._id);
    setNewBlog({
      title: blog.title,
      topic: blog.topic,
      category: blog.category,
      description: blog.description,
      content: blog.content,
      pic: null,
      existingPic: blog.pic,
      hashtag: blog.hashtag || []
    });
    setActiveTab('create');
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setIsLoading(false);
      return;
    }

    try {
      const url = "http://localhost:5000/api/blog/create";
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('topic', newBlog.topic);
      formData.append('category', newBlog.category);
      formData.append('description', newBlog.description);
      formData.append('content', newBlog.content);
      formData.append('publishDate', new Date().toISOString());

      if (newBlog.pic) {
        formData.append('pic', newBlog.pic);
      }

      if (newBlog.hashtag && newBlog.hashtag.length > 0) {
        formData.append('hashtag', JSON.stringify(newBlog.hashtag));
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error: ${res.status}`);
      }

      const blogData = await res.json();
      setBlogs(prev => [...prev, blogData]);

      setNewBlog(initialBlogState);
      setActiveTab('myBlogs');
      setError(null);
    } catch (err) {
      console.error("Blog error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setIsLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5000/api/blog/update/${editingBlogId}`;
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('topic', newBlog.topic);
      formData.append('category', newBlog.category);
      formData.append('description', newBlog.description);
      formData.append('content', newBlog.content);
      formData.append('publishDate', new Date().toISOString());

      if (newBlog.pic) {
        formData.append('pic', newBlog.pic);
      } else if (newBlog.existingPic) {
        formData.append('existingPic', newBlog.existingPic);
      }

      if (newBlog.hashtag && newBlog.hashtag.length > 0) {
        formData.append('hashtag', JSON.stringify(newBlog.hashtag));
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error: ${res.status}`);
      }

      const blogData = await res.json();
      setBlogs(prev => prev.map(blog => (blog._id === editingBlogId ? blogData : blog)));

      setNewBlog(initialBlogState);
      setIsEditMode(false);
      setEditingBlogId(null);
      setActiveTab('myBlogs');
      setError(null);
    } catch (err) {
      console.error("Update error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/blog/delete/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      setError(null);
    } catch (err) {
      console.error("Delete error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setActiveTab('myBlogs');
    setIsEditMode(false);
    setEditingBlogId(null);
    setNewBlog(initialBlogState);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2>Blog Dashboard</h2>
        <ul className="sidebar-nav">
          <li>
            <button
              className={`sidebar-button ${activeTab === 'myBlogs' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('myBlogs');
                setIsEditMode(false);
                setEditingBlogId(null);
              }}
            >
              My Blogs
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('create');
                setIsEditMode(false);
                setEditingBlogId(null);
                setNewBlog(initialBlogState);
              }}
            >
              Create New Blog
            </button>
          </li>
        </ul>
      </div>

      <div className="dashboard-content">
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {activeTab === 'myBlogs' && (
          <div className="my-blogs">
            <div className="blog-list-header">
              <h1>My Blog Posts</h1>
              <button
                className="action-button"
                onClick={() => {
                  setActiveTab('create');
                  setIsEditMode(false);
                  setEditingBlogId(null);
                }}
              >
                Create New
              </button>
            </div>

            {blogs.length === 0 ? (
              <div className="empty-state">You haven't created any blogs yet.</div>
            ) : (
              <div className="blog-grid">
                {blogs.map((blog, idx) => (
                  <div key={idx} className="blog-card">
                    {blog.pic && (
                      <img 
                        src={`http://localhost:5000${blog.pic}`} 
                        alt={blog.title} 
                        className="blog-cover" 
                      />
                    )}
                    <div className="blog-card-content">
                      <Link to={`/blog/${blog._id}`}><h3>{blog.title}</h3></Link>
                      <p className="blog-topic">{blog.topic}</p>
                      <p className="blog-category">{blog.category}</p>
                      <p className="blog-description">{blog.description}</p>
                      <p className="blog-description">
                        {blog.content?.split(" ").slice(0, 30).join(" ")}
                        {blog.content?.split(" ").length > 30 && '...'}
                      </p>
                      <p className="blog-date">
                        {new Date(blog.publishDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="blog-card-footer">
                      <button
                        className="blog-action"
                        onClick={() => handleEditClick(blog)}
                      >
                        Edit
                      </button>
                      <button
                        className="blog-action delete"
                        onClick={() => handleDeleteBlog(blog._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && !isEditMode && (
          <div className="create-blog">
            <div className="blog-list-header">
              <h1>Create New Blog Post</h1>
              <button
                className="action-button secondary-button"
                onClick={() => {
                  setActiveTab('myBlogs');
                  setIsEditMode(false);
                  setEditingBlogId(null);
                }}
              >
                Back to My Blogs
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="blog-form">
              {/* ... (keep the create form fields same as before) ... */}
            </form>
          </div>
        )}

        {activeTab === 'create' && isEditMode && (
          <BlogUpdate
            blogData={newBlog}
            onSubmit={handleUpdateBlog}
            onCancel={handleCancelEdit}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onHashtagChange={handleHashtagChange}
            onImageChange={handleImageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;