import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ExTabsButtonContext from './ExTabsButtonContext';

function ExTabsButtonProvider({ children }) {

  const [exTabsState, setExTabsState] = useState({
    loadingContacts: false,
    contacts: undefined,
    contactKeyword: '',
    contactPermission: true,
    listType: "everyone"
  });


  const memoValue = {
      IsTest: "true",
      onSetExTabsState: ({ field, value }) =>{
       
        if(!field && !value) return;
        setExTabsState({ [field]: value });
      },
      exTabsState
    }
  
  return (
    <ExTabsButtonContext.Provider value={memoValue}>
      {children}
    </ExTabsButtonContext.Provider>
  );
}

ExTabsButtonProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExTabsButtonProvider;
