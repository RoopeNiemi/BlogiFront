import React from 'react'
import PropTypes from 'prop-types'

const OneBlog =({title,author,url,likes,user,blogId,handleClick})=>{
   
return(
    <div>
        <div>
        <a href ={url}> {url}: </a>
        <p> Likes:{likes} </p>
        <p> Added by {user.name} </p>
        <button onClick={(e)=>handleClick(title,author,url,likes,user,blogId)}> Like </button>
        </div>
        </div>
)
}

export default OneBlog;