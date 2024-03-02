import { useOutletContext } from 'react-router-dom';

export type LayoutOutletContextType = {
  acceptedConditions: boolean;
  setAcceptedConditions: (accepted: boolean) => void;
};

export function useLayoutOutletContext() {
  return useOutletContext() as LayoutOutletContextType;
}
