// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

// import form components
import { EmailInput, PasswordInput } from '../../../global/components/forms'

const UserRegisterForm = ({
  handleFormChange
  , handleFormSubmit
  , user
}) => {
  const location = useLocation();


  return (
    <div className="border border-solid bg-white shadow-sm rounded-sm mx-auto max-w-lg p-4 mt-16">
      <form name="userForm" onSubmit={handleFormSubmit}>
        <h1 className="px-2">Register</h1>
        <EmailInput
          name="username"
          label="Email Address"
          value={user.username}
          change={handleFormChange}
          required={true}
        />
        <PasswordInput
          name="password"
          label="Password"
          value={user.password}
          change={handleFormChange}
          required={true}
        />
        <div className="p-2">
          <button className="text-sm p-2 px-8 rounded-full border border-solid bg-white text-gray-800 border border-gray-800 cursor-pointer no-underline font-semibold" type="submit" >Register</button>
        </div>
      </form>
      <p className="p-2 text-sm">
        Already have an account? 
        <Link
          to={{
            pathname: "/user/login"
            , state: location.state
          }}
          className="mx-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

UserRegisterForm.propTypes = {
  handleFormChange: PropTypes.func.isRequired
  , handleFormSubmit: PropTypes.func.isRequired
  , user: PropTypes.object.isRequired
}

export default UserRegisterForm;
