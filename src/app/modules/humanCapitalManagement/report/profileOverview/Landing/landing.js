import React from "react";
import { useHistory } from "react-router-dom";

export function EmployeeLanding({ objProps }) {
  const { landingData, buId, workPlaceId } = objProps;
  const history = useHistory();
  return (
    <div className="employee-overview row">
      {landingData?.length > 0 &&
        landingData.map((item, i) => (
          <div className="col-md-3 mt-5">
            <h4 className="title">{item?.ReportTypeName}</h4>
            <div
              onClick={() => {
                history.push({
                  pathname: `/human-capital-management/Report/profileOverview/view/${item?.ReportTypeId}/${item?.ReportTypeName}`,
                  state: {
                    buId,
                    workPlaceId,
                  },
                });
              }}
              class="overview-card d-flex justify-content-center align-items-center"
            >
              <h1>{item?.ReportTypeValue}</h1>
            </div>
          </div>
        ))}
    </div>
  );
}
