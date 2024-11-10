/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router";
import { Formik } from "formik";
import PaginationSearch from "../../../../../helper/_search";
import ICustomTable from "../../../../../helper/_customTable";
import IEdit from "../../../../../helper/icons/_edit";
import IView from "../../../../../helper/icons/_view";
import { activeInactiveOwner, getOwnerInfoLandingData } from "../helper";
import Loading from "../../../../../helper/loading/_loading";
import PaginationTable from "../../../../../helper/_tablePagination";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import customStyles from "../../../../../helper/common/selectCustomStyle";
// import FormikSelect from "../../../../../helper/common/formikSelect";

const initData = {
  status: "",
};

const headers = [
  { name: "SL" },
  { name: "Owner Name" },
  { name: "Company Name" },
  { name: "Company Address" },
  { name: "Owner Email" },
  { name: "Status" },
  { name: "Actions" },
];

export default function OwnerInfoTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getOwnerInfoLandingData(pageNo, pageSize, "", 0, setLoading, setGridData);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getOwnerInfoLandingData(
      pageNo,
      pageSize,
      searchValue,
      values?.status?.value || 0,
      setLoading,
      setGridData
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const changeStatus = (id, status, values) => {
    activeInactiveOwner(id, status, setLoading, () => {
      getOwnerInfoLandingData(
        pageNo,
        pageSize,
        "",
        values?.status?.value || 0,
        setLoading,
        setGridData
      );
    });
  };

  // const deleteOwner = (ownerId) => {
  //   DeleteOwnerInfo(ownerId, setLoading, () => {
  //     getOwnerInfoLandingData(pageNo, pageSize, "", setLoading, setGridData);
  //   });
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            {loading && <Loading />}
            <form className="form-card">
              <div className="form-card-heading">
                <p>Ship Owner</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary"}
                    onClick={() =>
                      history.push(
                        "/chartering/configuration/ownerInformation/create"
                      )
                    }
                    disabled={false}
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="form-card-content">
                <div className="row">
                  <div className="col-lg-3 mt-3">
                    {" "}
                    <PaginationSearch
                      placeholder="Search by Owner Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <FormikSelect
                      value={values?.status || ""}
                      isSearchable={true}
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Own Companies" },
                        { value: 2, label: "Other Companies" },
                      ]}
                      styles={customStyles}
                      name="status"
                      placeholder="Filter By"
                      label="Filter By"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        if (valueOption) {
                          getOwnerInfoLandingData(
                            pageNo,
                            pageSize,
                            "",
                            valueOption?.value,
                            setLoading,
                            setGridData
                          );
                        } else {
                          getOwnerInfoLandingData(
                            pageNo,
                            pageSize,
                            "",
                            0,
                            setLoading,
                            setGridData
                          );
                        }
                      }}
                      // isDisabled={isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                </div>
              </div>

              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.ownerName}</td>
                    <td>{item?.companyName}</td>
                    <td>{item?.companyAddress}</td>
                    <td>{item?.ownerEmail}</td>
                    <td className="text-center">
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
                              className="btn btn-primary ml-2"
                              onClick={() => {
                                changeStatus(item?.ownerId, false, values);
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
                              className="btn btn-danger ml-2"
                              onClick={() => {
                                changeStatus(item?.ownerId, true, values);
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
                              `/chartering/configuration/ownerInformation/view/${item?.ownerId}`
                            );
                          }}
                        />
                        <IEdit
                          clickHandler={() => {
                            history.push(
                              `/chartering/configuration/ownerInformation/edit/${item?.ownerId}`
                            );
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </ICustomTable>
            </form>
            {gridData?.data?.length > 0 && (
              <PaginationTable
                count={gridData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}

            <IViewModal show={show} onHide={() => setShow(false)}>
              <BankInfoForm setShow={setShow} setBankDDL={setBankDDL} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
