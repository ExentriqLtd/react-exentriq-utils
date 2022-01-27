import { useContext } from 'react';
import ExTabButtonContext from './ExTabButtonContext';

function useExTabButton() {
  const { test } = useContext(ExTabButtonContext);
  return { test };
}

export default useExTabButton;
