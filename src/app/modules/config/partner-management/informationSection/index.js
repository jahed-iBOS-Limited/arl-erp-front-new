import React from "react";
import { InformationSectionTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import './profileSection.css';

function InformationSectionLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/config/partner-management/partner-info-section/edit/${id}`
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
        <InformationSectionTable />
      </div>
    </UiProvider>
  );
}
export default InformationSectionLanding;
