/**
 * Will act as the default wrapper for all module states within the application
 * that call it within their own Layouts
 */

// import primary libraries
import React, { useEffect } from 'react';
// TODO: Maybe find an alternative to react-helmet since it's out of date and causes react to throw warnings
// import { Helmet }  from 'react-helmet'

// import nav components
import DefaultTopNav from '../navigation/DefaultTopNav.jsx';


const DefaultLayout = ({ ...props }) => {
  const {
    children
    , title
  } = props;
  
  // this can replace react-helmet if all we need to do is set the page title.
  useEffect(() => {
    document.title = title || "Yote App";
  }, [title])

  return (
    <div>
      {/* <Helmet title={props.title || "Yote App"}/> */}
      <DefaultTopNav />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg leading-6 font-semibold text-gray-900">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DefaultLayout;
