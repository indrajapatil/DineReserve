import React, { useState } from 'react';
import { product } from '../assets/assets';
import { MenuContext } from './MenuContext';

const MenuContextProvider = ({ children }) => {
  const [products, setProducts] = useState(product);

  return (
    <MenuContext.Provider value={{ products, setProducts }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;
