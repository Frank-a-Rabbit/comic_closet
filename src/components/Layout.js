import React from 'react';
import Header from './Header';
import ComicFilter from './ComicFilter';
import ComicsGrid from './ComicsGrid';

const Layout = () => {
  return (
    <>
      <Header />
      <ComicFilter />
      <ComicsGrid />
    </>
  );
};

export default Layout;
