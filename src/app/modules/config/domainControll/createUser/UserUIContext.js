import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./UserUIHelpers";

const UserUIContext = createContext();

export function useUserUIContext() {
  return useContext(UserUIContext);
}

export const CreateUserUIConsumer = UserUIContext.Consumer;

export function UserUIProvider({ userUIEvents, children }) {
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
    newUserButtonClick: userUIEvents.newUserButtonClick,
    openEditUserPage: userUIEvents.openEditUserPage,
    openDeleteProductDialog: userUIEvents.openDeleteUserDialog,
    openDeleteUserDialog: userUIEvents.openDeleteUserDialog,
    openFetchUserDialog: userUIEvents.openFetchUserDialog,
    openViewPage: userUIEvents.openViewPage,
    openUpdateUserStatusDialog:
      userUIEvents.openUpdateUserStatusDialog,
  };

  return (
    <UserUIContext.Provider value={value}>
      {children}
    </UserUIContext.Provider>
  );
}
