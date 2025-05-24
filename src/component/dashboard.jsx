import React, { useState, useEffect } from 'react';
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
 

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_APP_DEV_API
      : import.meta.env.VITE_APP_PROD_API;

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

  const [blogData, setBlogData] = useState(initialBlogState);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`${API_BASE_URL}api/blog/myBlogs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        console.log(data.blogs)

        setBlogs(data.blogs);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBlogs();
  }, [activeTab]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const onHashtagChange = (e) => {
    const hashtags = e.target.value.split(',').map(tag => tag.trim());
    setBlogData(prev => ({ ...prev, hashtag: hashtags }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setBlogData(prev => ({ ...prev, pic: file }));
  };

  const handleEditClick = (blog) => {
    setIsEditMode(true);
    setEditingBlogId(blog._id);
    setBlogData({
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
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('topic', blogData.topic);
      formData.append('category', blogData.category);
      formData.append('description', blogData.description);
      formData.append('content', blogData.content);
      formData.append('publishDate', new Date().toISOString());

      if (blogData.pic) {
        formData.append('pic', blogData.pic);
      }

      if (blogData.hashtag && blogData.hashtag.length > 0) {
        formData.append('hashtag', JSON.stringify(blogData.hashtag));
      }

      const res = await fetch(`${API_BASE_URL}api/blog/create`, {
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
      
    // Instead of using the response directly, refetch the full list
    const refreshRes = await fetch(`${API_BASE_URL}api/blog/myBlogs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!refreshRes.ok) throw new Error(`Refresh error: ${refreshRes.status}`);

    const refreshedData = await refreshRes.json();
    setBlogs(refreshedData.blogs);

      const createdBlog = await res.json();
      const normalizedBlog = {
        ...createdBlog,
        publishDate: createdBlog.publishDate || new Date().toISOString(),
        pic: createdBlog.pic || '',
        topic: createdBlog.topic || '',
        category: createdBlog.category || '',
        description: createdBlog.description || '',
        content: createdBlog.content || '',
        hashtag: createdBlog.hashtag || [],
        // Add more defaults if necessary
      };

      setBlogs(prev => [...prev, normalizedBlog]);

      setBlogData(initialBlogState);
      setActiveTab('myBlogs');
      setError(null);
    } catch (err) {
      console.error("Create error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleUpdateBlog = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setError("No token found");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('title', blogData.title);
  //     formData.append('topic', blogData.topic);
  //     formData.append('category', blogData.category);
  //     formData.append('description', blogData.description);
  //     formData.append('content', blogData.content);
  //     formData.append('publishDate', new Date().toISOString());

  //     if (blogData.pic) {
  //       formData.append('pic', blogData.pic);
  //     } else if (blogData.existingPic) {
  //       formData.append('existingPic', blogData.existingPic);
  //     }

  //     if (blogData.hashtag && blogData.hashtag.length > 0) {
  //       formData.append('hashtag', JSON.stringify(blogData.hashtag));
  //     }

  //     const res = await fetch(`${API_BASE_URL}api/blog/update/${editingBlogId}`, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || `Error: ${res.status}`);
  //     }

  //     const updatedBlog = await res.json();
  //     setBlogs(prev => prev.map(blog => (blog._id === editingBlogId ? updatedBlog : blog)));
       
  //     setBlogData(initialBlogState);
  //     setIsEditMode(false);
  //     setEditingBlogId(null);
   
  //     setActiveTab('myBlogs');
  //     setError(null);
  //   } catch (err) {
  //     console.error("Update error:", err.message);
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


//   const handleUpdateBlog = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError(null);

//   const token = localStorage.getItem("token");
//   if (!token) {
//     setError("No token found");
//     setIsLoading(false);
//     return;
//   }

//   try {
//     // Validate image before upload
  
//     const formData = new FormData();
//     formData.append('title', blogData.title);
//     formData.append('topic', blogData.topic);
//     formData.append('category', blogData.category);
//     formData.append('description', blogData.description);
//     formData.append('content', blogData.content);

//       if (blogData.pic) {
//       if (blogData.pic.size > 5 * 1024 * 1024) {
//         throw new Error("Image must be smaller than 5MB");
//       }
//       if (!blogData.pic.type.startsWith("image/")) {
//         throw new Error("Only image files are allowed");
//       }
//     }

//     if (blogData.pic) formData.append('image', blogData.pic);
//     // if (blogData.existingPic) formData.append('existingPic', blogData.existingPic);
//     if (blogData.hashtag?.length) formData.append('hashtag', JSON.stringify(blogData.hashtag));

//     const res = await fetch(`${API_BASE_URL}api/blog/update/${editingBlogId}`, {
    
//       method: "PUT",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
      
//     });
//     console.log(editingBlogId)

//     const responseText = await res.text();
//     let data;
    
//     try {
//       data = JSON.parse(responseText);
//     } catch {
//       throw new Error(`Server returned: ${responseText.substring(0, 100)}...`);
//     }

//     if (!res.ok) throw new Error(data.message || `Update failed with status ${res.status}`);

//     // Refresh data
//     const refreshRes = await fetch(`${API_BASE_URL}api/blog/myBlogs`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const refreshedData = await refreshRes.json();
    
//     setBlogs(refreshedData.blogs);
//     setIsEditMode(false);
//     setEditingBlogId(null);
//     setActiveTab('myBlogs');
    
//   } catch (err) {
//     console.error("Update error:", err);
//     setError(err.message.includes("Unexpected token") 
//       ? "Server error - please try again" 
//       : err.message);
//   } finally {
//     setIsLoading(false);
//   }
// };
const handleUpdateBlog = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  const token = localStorage.getItem("token");
  if (!token) {
    setError("No token found");
    setIsLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('topic', blogData.topic);
    formData.append('category', blogData.category);
    formData.append('description', blogData.description);
    formData.append('content', blogData.content);

    // Debug FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (blogData.pic) {
      if (blogData.pic.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5MB");
      }
      if (!blogData.pic.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }
      formData.append('pic', blogData.pic);
      console.log('Image appended to FormData');
    }

    if (blogData.existingPic) {
      formData.append('existingPic', blogData.existingPic);
    }

    if (blogData.hashtag?.length) {
      formData.append('hashtag', JSON.stringify(blogData.hashtag));
    }

    const res = await fetch(`${API_BASE_URL}api/blog/update/${editingBlogId}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    });

    

    console.log('Response status:', res.status);

    const responseText = await res.text();
    let data;
    console.log('Full response:', responseText); // Add this line
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Server returned: ${responseText.substring(0, 100)}...`);
    }

    if (!res.ok) throw new Error(data.message || `Update failed with status ${res.status}`);

    // Refresh data
    const refreshRes = await fetch(`${API_BASE_URL}api/blog/myBlogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const refreshedData = await refreshRes.json();
    
    setBlogs(refreshedData.blogs);
    setIsEditMode(false);
    setEditingBlogId(null);
    setActiveTab('myBlogs');
    
  } catch (err) {
    console.error("Update error:", err);
    setError(err.message.includes("Unexpected token") 
      ? "Server error - please try again" 
      : err.message);
  } finally {
    setIsLoading(false);
  }
}
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}api/blog/delete/${blogId}`, {
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
    setBlogData(initialBlogState);
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
                setBlogData(initialBlogState);
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
                {blogs.map((blog) => (
                  <div key={blog._id} className="blog-card">

                    {blog.pic && (
                      <img
                        src={`${API_BASE_URL}${blog.pic}`}
                        alt={blog.title}
                        className="blog-cover"
                      />
                    )}
                    <div className="blog-card-content">
                      <Link to={`/blog/${blog._id}`}><h3>{blog.title}</h3></Link>
                      <p className="blog-topic">{blog.topic}</p>
                      <p className="blog-category">{blog.category}</p>
                      <p className="blog-description">{blog.description}</p>
                      <p className="blog-description">{blog.content}</p>
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
              <div className="form-group">
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={blogData.title}
                  onChange={onInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="topic">Topic*</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={blogData.topic}
                  onChange={onInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={blogData.category}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Science">Science</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={blogData.description}
                  onChange={onInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content*</label>
                <textarea
                  id="content"
                  name="content"
                  value={blogData.content}
                  onChange={onInputChange}
                  required
                  rows="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pic">Cover Image</label>
                <input
                  type="file"
                  id="pic"
                  name="pic"
                  accept="image/*"
                  onChange={onImageChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hashtag">Hashtags (comma separated)</label>
                <input
                  type="text"
                  id="hashtag"
                  name="hashtag"
                  value={blogData.hashtag.join(', ')}
                  onChange={onHashtagChange}
                  placeholder="tech, ai, future"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'create' && isEditMode && (
          <BlogUpdate
            blogData={blogData}
            onSubmit={handleUpdateBlog}
            onCancel={handleCancelEdit}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onHashtagChange={onHashtagChange}
            onImageChange={onImageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;