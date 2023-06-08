import { useEffect, useState } from "react";
const useLocalStorage = (key = "iBoss", initialState = null) => {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key);

    return storedState ?? initialState;
  });
  useEffect(() => {
    localStorage.setItem(key, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const clearState = () => localStorage.removeItem(key);

  return [state, setState, clearState];
};
export default useLocalStorage;

//  const [value, setValue, clearValue] = useLocalStorage("sticky","");
