import React from 'react'

const blogForm=({onSubmit,handleChange, title, author, url})=>{
    return(
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={onSubmit}>
      <div>
      Title: 
      <input 
      value={title}
      name="title"
      onChange={handleChange}
      />
      </div>
      <div>
        Author: 
      <input
      value={author}
      name="author"
      onChange={handleChange}
      />
      </div>
      <div>
        Url: 
      <input
      value={url}
      name="url"
      onChange={handleChange}
      />
      </div>
      <button type="submit"> Save </button>
      </form>
      </div>
    )
  }
  export default blogForm;