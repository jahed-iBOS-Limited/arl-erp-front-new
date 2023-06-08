import React from "react";
import { ProfileSectionTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import './profileSection.css';

function ProfileSectionLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/human-capital-management/hcmconfig/profile-section/edit/${id}`
      );
    },
    openViewDialog: (id) => {
      history.push(
        `/human-capital-management/hcmconfig/profile-section/view/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <div className="hcm-config-profile-section">
        <ProfileSectionTable />
      </div>
    </UiProvider>
  );
}
export default ProfileSectionLanding;
