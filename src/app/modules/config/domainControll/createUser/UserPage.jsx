import React from 'react'
import {CreateUserCard} from './createUserCard'
import { UserUIProvider } from "./UserUIContext";


export function CreateUser({ history }) {
    const userUIEvents = {
      newUserButtonClick: () => {
        history.push("/e-commerce/user/new");
      },
      openEditUserPage: (id) => {
        history.push(`/config/domain-controll/create-user/${id}/${'e'}/edit`);
      },
      openDeleteUserDialog: (id) => {
        history.push(`/e-commerce/user/${id}/delete`);
      },
      openDeleteUsersDialog: () => {
        history.push(`/e-commerce/user/deleteUsers`);
      },
      openFetchUsersDialog: () => {
        history.push(`/e-commerce/user/fetch`);
      },
      openUpdateUsersStatusDialog: () => {
        history.push("/e-commerce/user/updateStatus");
      },
      openViewPage: (id) => {
        history.push(`/config/domain-controll/create-user/${id}/${'v'}/view`);
      }
    };
  
    return (
      <UserUIProvider userUIEvents={userUIEvents}>         
        <CreateUserCard />
      </UserUIProvider>
    );
  }
  