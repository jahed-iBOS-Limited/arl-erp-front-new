import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import {
  ZoneCostRateLandingPagination,
  deleteZoneCostSetup,
  getShipPointDDL,
} from "../helper";

const initData = {
  shipPoint: "",
};

export function ZoneCostRateLanding() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [shipPointDDL, setShipPointDDL] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  useEffect(() => {
    getShipPointDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShipPointDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    ZoneCostRateLandingPagination(
      profileData?.accountId,
      profileData?.userId,
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  const deleteHandler = (id, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to delete?`,
      yesAlertFunc: () => {
        deleteZoneCostSetup(id, profileData?.userId, setLoading, () => {
          ZoneCostRateLandingPagination(
            profileData?.accountId,
            profileData?.userId,
            selectedBusinessUnit?.value,
            values?.shipPoint?.value,
            pageNo,
            pageSize,
            setGridData,
            setLoading
          );
        });
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    if (
      shipPointDDL[0] &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      ZoneCostRateLandingPagination(
        profileData?.accountId,
        profileData?.userId,
        selectedBusinessUnit?.value,
        shipPointDDL[0].value,
        pageNo,
        pageSize,
        setGridData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipPointDDL[0], profileData?.accountId, selectedBusinessUnit?.value]);

  return (
    <ICustomCard
      title="Zone Cost Rate"
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() => {
            history.push({
              pathname:
                "/transport-management/configuration/zoneCostRate/create",
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
        initialValues={{ ...initData, shipPoint: shipPointDDL[0] }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // console.log("object");
        }}
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
            <Form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                    value={values?.shipPoint}
                    label="Select ShipPoint"
                    onChange={(valueOption) => {
                      setGridData([]);
                      setFieldValue("shipPoint", valueOption);
                      ZoneCostRateLandingPagination(
                        profileData?.accountId,
                        profileData?.userId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        pageNo,
                        pageSize,
                        setGridData,
                        setLoading
                      );
                    }}
                    placeholder="Select Shippoint"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </Form>
            <div className="col-lg-12 pr-0 pl-0 table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Shippoint Name</th>
                    <th>Zone Name</th>
                    <th>Number Of Distance</th>
                    <th style={{ width: "70px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.shippointName}</td>
                        <td>{item?.zoneName}</td>
                        <td>
                          <div className="text-right">
                            {item?.numberOfDistance}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push(
                                    `/transport-management/configuration/zoneCostRate/view/${item?.zoneCostId}`
                                  );
                                }}
                              />
                            </span>
                            {item?.permission && (
                              <>
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/transport-management/configuration/zoneCostRate/edit/${item?.zoneCostId}`
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span>
                                <span
                                  className="edit"
                                  onClick={() => {
                                    deleteHandler(item?.zoneCostId, values);
                                  }}
                                >
                                  <i
                                    className="fa fa-trash deleteBtn text-danger"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
            </div>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
