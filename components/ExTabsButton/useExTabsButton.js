import { useContext } from 'react';
import ExTabsButtonContext from './ExTabsButtonContext';

function useExTabsButton() {
  const { IsTest, onSetExTabsState, exTabsState} = useContext(ExTabsButtonContext);
  return { IsTest, onSetExTabsState, exTabsState};
}

export default useExTabsButton;
