/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationSearch from "../../../_chartinghelper/_search";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import { activeInactiveVessel, GetVesselLandingData } from "../helper";

const initData = {
  filterBy: "",
  status: "",
};

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Owner Name" },
  { name: "Flag" },
  { name: "Dead Weight" },
  { name: "Status" },
  { name: "Actions" },
];

export default function VesselTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetVesselLandingData(profileData?.accountId,
      selectedBusinessUnit?.value,pageNo, pageSize, "", "", 0, setLoading, setGridData);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    GetVesselLandingData(profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      searchValue,
      values?.status?.value || "",
      values?.filterBy?.value || 0,
      setLoading,
      setGridData
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const changeStatus = (id, status, values) => {
    activeInactiveVessel(id, status, setLoading, () => {
      GetVesselLandingData(profileData?.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        "",
        values?.status ? values?.status?.value : "",
        values?.filterBy ? values?.filterBy?.value : 0,
        setLoading,
        setGridData
      );
    });
  };

  // const deleteHandler = (id) => {
  //   IConfirmModal({
  //     title: `Delete Vessel`,
  //     message: `Are you sure you want to delete this vessel?`,
  //     yesAlertFunc: () => {
  //       DeleteVessel(id, setLoading, () => {
  //         GetVesselLandingData(
  //           pageNo,
  //           pageSize,
  //           "",
  //           "",
  //           setLoading,
  //           setGridData
  //         );
  //       });
  //     },
  //     noAlertFunc: () => {},
  //   });
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values) => {}}
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
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Vessel</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push("/chartering/configuration/vessel/create")
                    }
                    disabled={false}
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3 mt-5">
                    <PaginationSearch
                      placeholder="Search by Vessel Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.status || ""}
                      isSearchable={true}
                      options={[
                        { value: "", label: "All" },
                        { value: true, label: "Active" },
                        { value: false, label: "Inactive" },
                      ]}
                      styles={customStyles}
                      name="status"
                      placeholder="Status"
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        GetVesselLandingData(profileData?.accountId,
                          selectedBusinessUnit?.value,
                          pageNo,
                          pageSize,
                          "",
                          valueOption ? valueOption?.value : "",
                          values?.filterBy?.value || 0,
                          setLoading,
                          setGridData
                        );
                      }}
                      // isDisabled={isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.filterBy || ""}
                      isSearchable={true}
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Own Vessels" },
                        { value: 2, label: "Other Vessels" },
                      ]}
                      styles={customStyles}
                      name="filterBy"
                      placeholder="Filter By"
                      label="Filter By"
                      onChange={(valueOption) => {
                        setFieldValue("filterBy", valueOption);
                        GetVesselLandingData(profileData?.accountId,
                          selectedBusinessUnit?.value,
                          pageNo,
                          pageSize,
                          "",
                          values?.status?.value || "",
                          valueOption?.value || 0,
                          setLoading,
                          setGridData
                        );
                      }}
                      // isDisabled={isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ width: "40px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td>{item?.vesselName}</td>
                    <td>{item?.ownerName}</td>
                    <td>{item?.flag}</td>
                    <td>{item?.deadWeight}</td>
                    <td style={{ width: "80px" }} className="text-center">
                      {item?.active ? (
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">
                              {"Click here to Inactive"}
                            </Tooltip>
                          }
                        >
                          <span>
                            <button
                              type="button"
                              className="btn btn-success ml-2 px-2 py-1"
                              onClick={() => {
                                changeStatus(item?.vesselId, false, values);
                              }}
                            >
                              Active
                            </button>
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">
                              {"Click here to Active"}
                            </Tooltip>
                          }
                        >
                          <span>
                            <button
                              type="button"
                              className="btn btn-danger ml-2 px-2 py-1"
                              onClick={() => {
                                changeStatus(item?.vesselId, true, values);
                              }}
                            >
                              Inactive
                            </button>
                          </span>
                        </OverlayTrigger>
                      )}
                    </td>
                    <td style={{ width: "50px" }} className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push(
                              `/chartering/configuration/vessel/view/${item?.vesselId}`
                            );
                          }}
                        />
                        <IEdit
                          clickHandler={() => {
                            history.push(
                              `/chartering/configuration/vessel/edit/${item?.vesselId}`
                            );
                          }}
                        />
                        {/* <IDelete remover={deleteHandler} id={item?.vesselId} /> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </ICustomTable>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
