import React from 'react';
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/blogForm'
import LoginForm from './components/loginForm'
import TogglableText from'./components/TogglableText'
import OneBlog from './components/blogItem'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      blogs:[],
      title:'',
      author: '',
      url:'',
      message:'',
      username:'',
      password:'',
      user:null,
      visible:false
    }
  }
sortLikes=(array)=>{
  return array.sort(
    function(a,b){
      return b.likes - a.likes
    }
  )
}
  componentDidMount() {
    console.log('did mount')
    blogService
    .getAll()
      .then(response => {
        console.log('promise fulfilled')
        const blogsInOrder=this.sortLikes(response)
        
        this.setState({ blogs: blogsInOrder })
      })
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if(loggedUserJSON){
        const user=JSON.parse(loggedUserJSON)
        this.setState({user})
        blogService.setToken(user.token)
      }
  }

  handleLoginFieldChange=(event)=>{
    this.setState({[event.target.name]:event.target.value})
  }

  logout=()=>{
    window.localStorage.removeItem('loggedBlogappUser')
    this.setState({
      user:null
    })
  }

  handleBlogChange=(event)=>{
    this.setState({[event.target.name]:event.target.value})
  }

  login =async (event)=>{
    event.preventDefault()
    try{
      const user=await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      window.localStorage.setItem('loggedBlogappUser',JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({username:'',password:'', user:user})

    }catch(exception){
      this.setState({
        message:'käyttäjätunnus tai salasana virheellinen'
      })
      setTimeout(()=>{
        this.setState({message:''})
      },5000)
    }
  }
  likeBlog=async(title,author,url,likes,user,id)=>{
    console.log(title)
    console.log(author)
    console.log(url)
    console.log(likes)
    console.log(user)
    console.log(id)
    const newBlog={
      title:title,
      author:author,
      url:url,
      likes:likes+1,
      user:user
    }
    await blogService.update(id, newBlog)
    var newBlogs= await blogService.getAll()
    var blogsInOrder=this.sortLikes(newBlogs)
    this.setState({
      blogs:blogsInOrder
    })

  }

  addBlog=async(event)=>{
    event.preventDefault()
    const newBlog={
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
      user: this.state.user
    }
    await blogService.create(newBlog)
      this.setState({
        message: `A new blog '${newBlog.title}' by ${newBlog.author} has been added`
      })
      setTimeout(()=>{
        this.setState({
          message:'',
          author:'',
          url:'',
          title:''
        })
      },5000)
      this.state.blogs=this.state.blogs.concat(newBlog)
  }

  render() {

    const loginForm=()=>{
      return (
        <div>
           <LoginForm handleSubmit={this.login} handleChange={this.handleLoginFieldChange}
            username={this.state.username} password={this.state.password}/>
          </div>
      )
    }

    const blogForm=()=>{
      return(
        <Togglable buttonLabel='Add a new blog'>
        <BlogForm 
          onSubmit={this.addBlog}
          title={this.state.title}
          author={this.state.author}
          url={this.state.url}
          handleChange={this.handleBlogChange}
    />
    </Togglable>
      )
    }
    const Notify=()=>{
      if(this.state.message===''){
        return (
          <div>
          </div>
        )
      }
      else{
        return (
          <Notification message={this.state.message}/>
        )
      }
    }
    const Blog =()=> {
      return (
        <div>
        {this.state.blogs.map(blog => <BlogItem key={blog.title} blogitem={blog}/>)}
        </div>
      )
    }

    const BlogItem=({blogitem})=>{
      const TitleAndAuthor=blogitem.title + ' by '+ blogitem.author
      return (
       
      <TogglableText textLabel={TitleAndAuthor}>
       <OneBlog title={blogitem.title}
            author={blogitem.author}
            url={blogitem.url}
            likes={blogitem.likes}
            user={blogitem.user}
            blogId={blogitem.id}
            handleClick={this.likeBlog}
       />
        </TogglableText>
      )
    }
    return (
     <div>
       <h1>Blogs</h1>
       <Notify />
       {this.state.user===null ? loginForm():
       <div>
         <p>{this.state.user.name} logged in<button onClick={this.logout}>Logout </button></p>
      {blogForm()} 
      <div className="blogList">
      <Blog />
      </div>
       </div>
       }
 
    </div>

       
    );
  }
}

export default App;
