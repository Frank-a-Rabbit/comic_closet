import React from 'react';
import Header from './Header';
import ComicFilter from './ComicFilter';
import ComicsGrid from './ComicsGrid';
import { useSelector } from 'react-redux';

const Layout = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Header />
      {user.user && (
        <>
          <ComicFilter />
          <ComicsGrid />
        </>
      )}
    </>
  );
};

export default Layout;
