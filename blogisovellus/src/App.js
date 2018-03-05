import React from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/blogForm";
import LoginForm from "./components/loginForm";
import TogglableText from "./components/TogglableText";
import OneBlog from "./components/blogItem";
import UsersForm from "./components/usersForm";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      users: [],
      comment: "",
      title: "",
      author: "",
      url: "",
      message: "",
      username: "",
      password: "",
      user: null,
      visible: false
    };
  }
  sortLikes=(array) => {
    return array.sort(function(a, b) {
      return b.likes - a.likes;
    });
  };
  componentWillMount() {
    console.log("did mount");
    blogService.getAll().then(response => {
      console.log("promise fulfilled");
      const blogsInOrder = this.sortLikes(response);
      this.setState({ blogs: blogsInOrder });
    });
    userService.getAll().then(response => {
      this.setState({ users: response });
    });

    console.log("BLOGS LENGTH " + this.state.blogs.length);

    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      this.setState({ user });
      blogService.setToken(user.token);
    }
  }

  handleLoginFieldChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    this.setState({
      user: null
    });
  };

  handleBlogChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCommentChange = event => {
    this.setState({ comment: event.target.value });
  };

  login = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      this.setState({ username: "", password: "", user: user });
    } catch (exception) {
      this.setState({
        message: "käyttäjätunnus tai salasana virheellinen"
      });
      setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
    }
  };
  likeBlog = async (title, author, url, likes, user, id) => {
    console.log(title);
    console.log(author);
    console.log(url);
    console.log(likes);
    console.log(user);
    console.log(id);
    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: likes + 1,
      user: user
    };
    await blogService.update(id, newBlog);
    var newBlogs = await blogService.getAll();
    var blogsInOrder = this.sortLikes(newBlogs);
    this.setState({
      blogs: blogsInOrder
    });
  };

  commentBlog = async (blog, comment) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user,
      comments: blog.comments.concat(comment)
    };
    await blogService.update(blog.id, newBlog);
    var newBlogs = await blogService.getAll();
    this.setState({
      blogs: newBlogs,
      comment: ""
    });
  };

  getUsers = () => {
    userService.getAll().then(response => {
      this.setState({ users: response });
      console.log(this.state.users.length);
    });
  };

  addBlog = async event => {
    event.preventDefault();
    const newBlog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
      user: this.state.user,
      comments:[],
    };
    await blogService.create(newBlog);
    this.setState({
      message: `A new blog '${newBlog.title}' by ${
        newBlog.author
      } has been added`
    });
    setTimeout(() => {
      this.setState({
        message: "",
        author: "",
        url: "",
        title: ""
      });
    }, 5000);
    this.state.blogs = this.state.blogs.concat(newBlog);
  };

  render() {
    const loginForm = () => {
      return (
        <div>
          <LoginForm
            handleSubmit={this.login}
            handleChange={this.handleLoginFieldChange}
            username={this.state.username}
            password={this.state.password}
          />
        </div>
      );
    };

    const blogForm = () => {
      return (
        <Togglable buttonLabel="Add a new blog">
          <BlogForm
            onSubmit={this.addBlog}
            title={this.state.title}
            author={this.state.author}
            url={this.state.url}
            handleChange={this.handleBlogChange}
          />
        </Togglable>
      );
    };
    const Notify = () => {
      if (this.state.message === "") {
        return <div />;
      } else {
        return <Notification message={this.state.message} />;
      }
    };
    const Home = () => {
   return(
    <BlogForm
            onSubmit={this.addBlog}
            title={this.state.title}
            author={this.state.author}
            url={this.state.url}
            handleChange={this.handleBlogChange}
      />
   )
   }
       
     
   
    const Blogs = () => {
      return (
        <div>
          <ul>
            {this.state.blogs.map(blog => (
              <li key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    };
    const Blog = ({ blog }) => {
      if (blog === undefined) {
        return <div> </div>;
      } else {
        return (
          <div>
            <h2>{blog.title}</h2>
            <a href={blog.url}>{blog.url} </a>
            <p> Author {blog.author}</p>
            <p>Added by {blog.user.name} </p>
            <p>Likes: {blog.likes}</p>
            <h3> Comments: </h3>
            <ul>
              {blog.comments
                .filter(c => c.length > 0)
                .map(b => <li key={getId()}>{b}</li>)}
            </ul>
            <div>
              <form onSubmit={() => this.commentBlog(blog, this.state.comment)}>
                {" "}
                Comment{" "}
                <input
                  value={this.state.comment}
                  onChange={this.handleCommentChange}
                />
                <button type="submit"> Save </button>{" "}
              </form>
            </div>
          </div>
        );
      }
    };
    const UserList = () => {
      return (
        <div>
          <ul>
            {this.state.users.map(u => (
              <li key={u.id}>
                {" "}
                <Link to={`/users/${u.id}`}> {u.name} </Link> Blogs added:{" "}
                {u.blogs.length}
              </li>
            ))}
          </ul>
        </div>
      );
    };
    const UserView = ({ user }) => {
      if (user === undefined) {
        return <div />;
      }
      console.log("user:" + user.name);
      console.log("user blogs:" + user.blogs.length);
      return (
        <div>
          <h2>{user.name}</h2>
          <h4>Added blogs </h4>
          <ul>{user.blogs.map(b => <li key={b.title}>{b.title} </li>)}</ul>
        </div>
      );
    };
    const blogById = id => this.state.blogs.find(b => b.id === id);
    const userById = id => this.state.users.find(u => u.id === id);
    const getId = () => (1000000 * Math.random()).toFixed(0);
    const BlogItem = ({ blogitem }) => {
      const TitleAndAuthor = blogitem.title + " by " + blogitem.author;
      return (
        <TogglableText textLabel={TitleAndAuthor}>
          <OneBlog
            title={blogitem.title}
            author={blogitem.author}
            url={blogitem.url}
            likes={blogitem.likes}
            user={blogitem.user}
            blogId={blogitem.id}
            handleClick={this.likeBlog}
          />
        </TogglableText>
      );
    };
    return (
      <div>
        <h1>Blogs</h1>
        <Notify />
        {this.state.user === null ? (
          loginForm()
        ) : (
          <div>
            <p>
              {this.state.user.name} logged in<button onClick={this.logout}>
                Logout{" "}
              </button>
            </p>

            <div>
              <Router>
                <div>
                  <div>
                    <Link to="/">home</Link> &nbsp;
                    <Link to="/blogs">blogs</Link> &nbsp;
                    <Link to="/users">users</Link>
                  </div>
                  <Route exact path="/" render={() => <Home />} />
                  <Route exact path="/blogs" render={() => <Blogs />} />

                  <Route
                    exact
                    path="/blogs/:id"
                    render={({ match }) => (
                      <Blog blog={blogById(match.params.id)} />
                    )}
                  />

                  <Route exact path="/users" render={() => <UserList />} />
                  <Route
                    exact
                    path="/users/:id"
                    render={({ match }) => (
                      <UserView user={userById(match.params.id)} />
                    )}
                  />
                </div>
              </Router>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
