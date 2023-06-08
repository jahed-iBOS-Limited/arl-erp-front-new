/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { GetCountryDDL } from "../../../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationSearch from "../../../_chartinghelper/_search";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import {
  activeInactivePort,
  // deletePort,
  getPortLandingData,
} from "../helper";

const initData = {
  country: "",
};

const headers = [
  { name: "SL" },
  { name: "Port Name" },
  { name: "Country" },
  { name: "Port Address" },
  { name: "Status" },
  { name: "Actions" },
];

export default function PortTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryDDL, setCountryDDL] = useState([]);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getPortLandingData(pageNo, pageSize, "", "", setLoading, setGridData);
    GetCountryDDL(setCountryDDL);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getPortLandingData(
      pageNo,
      pageSize,
      searchValue,
      values?.country?.label,
      setLoading,
      setGridData
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const changeStatus = (id, status, values) => {
    activeInactivePort(id, status, setLoading, () => {
      getPortLandingData(
        pageNo,
        pageSize,
        "",
        values?.country?.label,
        setLoading,
        setGridData
      );
    });
  };

  // const deleteHandler = (id) => {
  //   deletePort(id, setLoading, () => {});
  // };

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
                <p>Port</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push("/chartering/configuration/port/create")
                    }
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3 mt-5">
                    <PaginationSearch
                      placeholder="Search by Port Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.country || ""}
                      isSearchable={true}
                      options={countryDDL || []}
                      styles={customStyles}
                      name="country"
                      placeholder="Country"
                      label="Country"
                      onChange={(valueOption) => {
                        setFieldValue("country", valueOption);
                        if (valueOption) {
                          getPortLandingData(
                            pageNo,
                            pageSize,
                            "",
                            valueOption?.label,
                            setLoading,
                            setGridData
                          );
                        } else {
                          getPortLandingData(
                            pageNo,
                            pageSize,
                            "",
                            "",
                            setLoading,
                            setGridData
                          );
                        }
                      }}
                      // isDisabled={isEdit}
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
                    <td style={{ width: "40px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td>{item?.portName}</td>
                    <td>{item?.portCountry}</td>
                    <td>{item?.portAddress}</td>
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
                                changeStatus(item?.porteId, false, values);
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
                                changeStatus(item?.porteId, true, values);
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
                        <IEdit
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/configuration/port/edit/${item?.porteId}`,
                              state: item,
                            });
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
