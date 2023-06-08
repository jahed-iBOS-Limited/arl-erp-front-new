import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./uIHelpers";

const UiContext = createContext();

export function useUIContext() {
  return useContext(UiContext);
}

export const UiConsumer = UiContext.Consumer;

export function UiProvider({ uIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    openEditPage: uIEvents?.openEditPage,
    openViewDialog: uIEvents?.openViewDialog,
    openExtendPage: uIEvents?.openExtendPage,
    openChartPage: uIEvents?.openChartPage,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}
