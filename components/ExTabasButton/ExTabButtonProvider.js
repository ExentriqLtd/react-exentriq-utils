import React from 'react';
import PropTypes from 'prop-types';
import ExTabButtonContext from './ExTabButtonContext';
function ExTabsButtonProvider({ children }) {
  return (
    <ExTabButtonContext.Provider value={{ test: "prova" }}>
      {children}
    </ExTabButtonContext.Provider>
  );
}

ExTabsButtonProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExTabsButtonProvider;
