import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { UserGroupLandingCard } from "./userGroup/userGroupLandingCard";

export function UserGroup({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/domain-controll/user-group/edit/${id}`);
    }, 
    openViewDialog: (id) =>{
      history.push(`/config/domain-controll/user-group/view/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <UserGroupLandingCard />
    </UiProvider>
  );
}
