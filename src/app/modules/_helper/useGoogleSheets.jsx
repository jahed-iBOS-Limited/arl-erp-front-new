import { useCallback, useEffect, useReducer, useRef } from 'react';
import GoogleSheetsMapper from './GoogleSheetsMapper';

const initialState = {
  loading: true,
  error: null,
  data: [],
  called: false,
  refetch: () => {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload };
    case 'ERROR':
      return { ...state, error: action.payload };
    case 'SUCCESS':
      return { ...state, data: action.payload };
    case 'CALLED':
      return { ...state, called: action.payload };
    default:
      return state;
  }
}

const useGoogleSheets = ({
  apiKey,
  sheetId,
  sheetsOptions = [],
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sheets = useRef(sheetsOptions);

  const fetchData = useCallback(async () => {
    dispatch({ type: 'LOADING', payload: true });
    dispatch({ type: 'CALLED', payload: false });
    dispatch({ type: 'ERROR', payload: null });
    dispatch({ type: 'SUCCESS', payload: [] });
    try {
      const mappedData = await GoogleSheetsMapper.fetchGoogleSheetsData({
        apiKey,
        sheetId,
        sheetsOptions: sheets.current,
      });

      dispatch({
        type: 'SUCCESS',
        payload: mappedData,
      });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error });
    } finally {
      dispatch({ type: 'LOADING', payload: false });
      dispatch({ type: 'CALLED', payload: true });
    }
  }, [apiKey, sheetId]);

  const refetch = useCallback(() => {
    if (state.called) {
      fetchData();
    }
  }, [fetchData, state.called]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
    called: state.called,
    refetch,
  };
};


 export  default useGoogleSheets;
