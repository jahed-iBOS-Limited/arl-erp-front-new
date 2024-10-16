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
import {
  activeInactiveStakeholder,
  GetStakeholderLandingData,
  getStakeholderType,
} from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { imarineBaseUrl } from "../../../../../App";

const initData = {
  filterBy: "",
  fromDate: "",
  toDate: "",
};

const headers = [
  { name: "SL" },
  { name: "Stakeholder Type" },
  { name: "Company Name" },
  { name: "PIC Name" },
  { name: "Country" },
  { name: "Port Name" },
  { name: "Email" },
  { name: "Status" },
  { name: "Actions" },
];

export default function BusinessPartnerTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stakeholderTypeDDL, setStakeholderTypeDDL] = useState([]);
  const history = useHistory();
  const [portDDL, getPortDDL] = useAxiosGet();


  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getStakeholderType(setStakeholderTypeDDL);
    getPortDDL(`${imarineBaseUrl}/domain/Stakeholder/GetPortDDL`);

    GetStakeholderLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      "",
      0,
      setLoading,
      setGridData
    );
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    GetStakeholderLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      searchValue,
      values?.stakeholderType?.value || 0,
      setLoading,
      setGridData
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const changeStatus = (id, status, values) => {
    activeInactiveStakeholder(id, status, setLoading, () => {
      GetStakeholderLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        "",
        values?.stakeholderType?.value || 0,
        setLoading,
        setGridData
      );
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Business Partner</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/configuration/stakeholder/create"
                      )
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
                      placeholder="Company Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.stakeholderType || ""}
                      isSearchable={true}
                      options={[
                        { value: 0, label: "All" },
                        ...stakeholderTypeDDL,
                      ]}
                      styles={customStyles}
                      name="stakeholderType"
                      placeholder="Business Partner Type"
                      label="Business Partner Type"
                      onChange={(valueOption) => {
                        setFieldValue("stakeholderType", valueOption);
                        GetStakeholderLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          pageNo,
                          pageSize,
                          "",
                          valueOption?.value || 0,
                          setLoading,
                          setGridData,
                          values?.port?.value || 0,
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.port}
                      isSearchable={true}
                      options={portDDL || []}
                      styles={customStyles}
                      name="port"
                      placeholder="Port"
                      label="Port"
                      onChange={(valueOption) => {
                        setFieldValue("port", valueOption);
                        GetStakeholderLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          pageNo,
                          pageSize,
                          "",
                          values?.stakeholderType?.value || 0,
                          setLoading,
                          setGridData,
                          values?.port?.value || 0,
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              {loading && <Loading />}
              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.stakeholderTypeName}</td>
                    <td>{item?.compnayName}</td>
                    <td>{item?.picname}</td>
                    <td>{item?.countryName}</td>
                    <td>{item?.portName}</td>
                    <td>{item?.email}</td>
                    <td style={{ width: "80px" }} className="text-center">
                      {item?.isActive ? (
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
                                changeStatus(
                                  item?.stakeholderId,
                                  false,
                                  values
                                );
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
                                changeStatus(item?.stakeholderId, true, values);
                              }}
                            >
                              Inactive
                            </button>
                          </span>
                        </OverlayTrigger>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push(
                              `/chartering/configuration/stakeholder/view/${item?.stakeholderId}`
                            );
                          }}
                        />
                        <IEdit
                          clickHandler={() => {
                            history.push(
                              `/chartering/configuration/stakeholder/edit/${item?.stakeholderId}`
                            );
                          }}
                        />
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
