import React from 'react'
import PropTypes from 'prop-types'
const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
    return (
      <div>
        <h2>Log in</h2>
  
        <form onSubmit={handleSubmit}>
          <div>
            Username: 
            <input
              value={username}
              onChange={handleChange}
              name="username"
            />
          </div>
          <div>
            Password: 
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    )
  }

  LoginForm.propTypes={
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }
  export default LoginForm;