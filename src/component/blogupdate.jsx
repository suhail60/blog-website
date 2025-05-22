import React from 'react';

const BlogUpdate = ({
  blogData,
  onSubmit,
  onCancel,
  isLoading,
  onInputChange,
  onHashtagChange,
  onImageChange
}) => {
  return (
    <div className="create-blog">
      <div className="blog-list-header">
        <h1>Edit Blog Post</h1>
        <button
          className="action-button secondary-button"
          onClick={onCancel}
        >
          Back to My Blogs
        </button>
      </div>

      <form onSubmit={onSubmit} className="blog-form">
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
          <label htmlFor="pic">Cover Image</label>
          <input
            type="file"
            id="pic"
            name="pic"
            accept="image/*"
            onChange={onImageChange}
          />
          {!blogData.pic && blogData.existingPic && (
            <div className="current-image">
              <p>Current Image:</p>
              <img 
                src={`http://localhost:5000${blogData.existingPic}`} 
                alt="Current cover" 
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
              <p className="image-note">Leave blank to keep current image</p>
            </div>
          )}
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

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogUpdate;