import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import ExBottomSheetContext from './ExBottomSheetContext';
import ExBottomSheetComponent from './ExBottomSheetComponent';

function ExBottomSheetProvider({ children }) {
  const [show, setShow] = useReducer((_, v) => v, false);
  const [component, setComponent] = useReducer((_, v) => v, undefined);

  const memoValue = useMemo(
    () => ({
      isOpen: show,
      open: (c) => {
        setShow(true);
        setComponent(c);
      },
      close: () => {
        setComponent(null);
        setShow(false);
      },
    }),
    [setShow, show],
  );

  return (
    <ExBottomSheetContext.Provider value={memoValue}>
      {children}
      <ExBottomSheetComponent show={show} component={component} />
    </ExBottomSheetContext.Provider>
  );
}

ExBottomSheetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExBottomSheetProvider;
