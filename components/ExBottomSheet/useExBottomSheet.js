import { useContext } from 'react';
import ExBottomSheetContext from './ExBottomSheetContext';

function useExBottomSheet() {
  const { isOpen, open, close } = useContext(ExBottomSheetContext);
  return { isOpen, open, close };
}

export default useExBottomSheet;
