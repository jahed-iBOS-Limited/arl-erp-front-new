import { debounce } from 'lodash';

const createDebounceHandler = (delay = 3000) => {
  return debounce(({ setLoading, CB }) => {
    if (typeof setLoading === 'function') {
      setLoading(false);
    }
    CB();
  }, delay);
};

export default createDebounceHandler;
