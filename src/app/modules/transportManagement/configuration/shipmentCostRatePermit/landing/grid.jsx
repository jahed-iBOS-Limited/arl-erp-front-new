import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { GetAllowForModificationLanding_api } from "./../helper";

const initData = {
  shipPoint: "",
};

export function ShipmentCostRatePermitLanding() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const [loading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const girdDataFunc = (pageNo, pageSize) => {
    GetAllowForModificationLanding_api(
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setGridData
    );
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      girdDataFunc(pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize) => {
    girdDataFunc(pageNo, pageSize);
  };

  console.log(gridData?.data);
  return (
    <ICustomCard
      title="Shipment Cost Rate Permission"
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() => {
            history.push({
              pathname:
                "/transport-management/configuration/shipmentCostRatePermit/create",
            });
          }}
        >
          Create
        </button>
      )}
    >
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <div className="col-lg-12 pr-0 pl-0">
            <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th style={{ width: "450px" }}>Employee Name</th>
                    <th>Ghat Permission</th>
                    <th>TransportZone Permission</th>
                    <th>Item Permission</th>
                    <th style={{ width: "45px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.length > 0 &&
                    gridData?.data.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.employeeName}</td>
                        <td>{`${item?.ysnGhatInfo}`}</td>
                        <td>{`${item?.ysnTransportZoneInfo}`}</td>
                        <td>{`${item?.ysnItemInfo}`}</td>
                        <td className="text-center">
                          <span
                            onClick={() =>
                              history.push(
                                `/transport-management/configuration/shipmentCostRatePermit/edit/${item?.id}`
                              )
                            }
                          >
                            <IEdit />
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </div>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
