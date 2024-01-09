/**
 * Global DefaultNav component. Up to the designers to decide if should live 
 * as a top-nav, fixed side, menu-prompted, etc. 
 * 
 * Recommended to select a good one from Tailwind UI that matches the brand 
 * and edit from there. 
 * https://tailwindui.com/components/application-ui/headings/page-headings
 */

// import primary libraries
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useLoggedInUser } from '../../../resources/user/authService';


import { sendLogout } from '../../../resources/user/authStore';

import NotificationDropdown from '../../../resources/notification/components/NotificationDropdown';


const DefaultNav = () => {

  // use the hook to get the loggedInUser from the authStore
  const loggedInUser = useLoggedInUser();

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = async () => {
    dispatch(sendLogout()).then(response => {
      history.push("/");
    })
  }

  return (
    <header className="border-b border-solid shadow-sm bg-white">
      <div className="p-2 flex flex-row justify-between items-center">
        <ul className="list-none p-0 flex flex-row">
          <li><NavLink to="/" className="p-2 block">Home</NavLink></li>
          <li><NavLink to="/products" className="p-2 block">Products</NavLink></li>
          <li><NavLink to="/products/mine" className="p-2 block">My Products</NavLink></li>

        </ul>
        {!loggedInUser ?
          <ul className="list-none p-0 flex flex-row">
            <li><NavLink to={{ pathname: "/user/login", state: { from: location } }} className="p-2 block">Sign in</NavLink></li>
            <li><NavLink to={{ pathname: "/user/register", state: { from: location } }} className="p-2 block">Register</NavLink></li>
          </ul>
          :
          <ul className="list-none p-0 flex flex-row">
            <li><NotificationDropdown classes="p-2 block" /></li>
            <li><NavLink to="/user/profile" className="p-2 block">My profile</NavLink></li>
            <li><button className="p-2 block" onClick={handleLogout}>Logout</button></li>
          </ul>
        }
      </div>
    </header>
  )
}

export default DefaultNav;
