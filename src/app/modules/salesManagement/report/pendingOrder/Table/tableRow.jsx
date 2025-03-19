import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getPendingOrderGridDataAction,
  getShippointDDL_Action,
} from "../_redux/Actions";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { setPendingOrderGridDataEmptyAction } from "./../_redux/Actions";

import { setPendingOrderShippointLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
export function TableRow({ initData, initialData, saveHandler }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { userId: actionBy } = profileData;

  // get emplist ddl from store
  const shippointDDL = useSelector((state) => {
    return state?.pendingOrder?.shippointDDL;
  }, shallowEqual);
  const pendingOrderShippointLanding = useSelector((state) => {
    return state?.localStorage?.pendingOrderShippointLanding;
  }, shallowEqual);

  //Dispatch Get shippoint list action for get shippoint ddl
  useEffect(() => {
    if (actionBy && profileData) {
      dispatch(
        getShippointDDL_Action(
          actionBy,
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionBy, profileData]);

  // get controlling unit list  from store
  const pendingOrderGridData = useSelector((state) => {
    return state.pendingOrder?.pendingOrderGridData;
  }, shallowEqual);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    dispatch(
      getPendingOrderGridDataAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        values?.shipPoint?.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  useEffect(() => {
    if (pendingOrderShippointLanding?.shipPoint?.value) {
      dispatch(
        getPendingOrderGridDataAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          pendingOrderShippointLanding?.shipPoint?.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }

    return () => {
      dispatch(setPendingOrderGridDataEmptyAction());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          ...pendingOrderShippointLanding,
          // shipPoint: shippointDDL[6]?.value
          //   ? {
          //       value: shippointDDL[6]?.value,
          //       label: shippointDDL[6]?.label,
          //     }
          //   : "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialData);
          });
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12 p-0 m-0">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3 mb-2">
                        <NewSelect
                          name="shipPoint"
                          options={shippointDDL}
                          value={values?.shipPoint}
                          label="Select Ship Point"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                            dispatch(setPendingOrderGridDataEmptyAction());
                          }}
                          placeholder="Select Ship Point"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-1">
                        <button
                          type="button"
                          className="btn btn-primary mt-5"
                          onClick={() => {
                            dispatch(
                              getPendingOrderGridDataAction(
                                profileData.accountId,
                                selectedBusinessUnit.value,
                                values?.shipPoint?.value,
                                setLoading,
                                pageNo,
                                pageSize
                              )
                            );
                            dispatch(
                              setPendingOrderShippointLandingAction(values)
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            {loading && <Loading />}
            <div className="row cash_journal">
              <div className="col-lg-12 pr-0 pl-0">
                {pendingOrderGridData?.data?.length >= 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th style={{ width: "90px" }}>Customer Id</th>
                          <th>Customer Name</th>
                          <th>Address</th>
                          <th style={{ width: "90px" }}>Quantity</th>
                          <th style={{ width: "90px" }}>Amount</th>
                          <th style={{ width: "190px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingOrderGridData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{++index}</td>
                            <td>
                              <div className="text-right pr-2">
                                {td.soldToPartnerId}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{td.soldToPartnerName}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td.soldToPartnerAddress}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {td.pendingQty}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {td.pendingAmount}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <button
                                  onClick={() => {
                                    history.push({
                                      pathname: `/inventory-management/warehouse-management/delivery/add`,
                                      state: {
                                        sbu: {
                                          value: td?.subID,
                                          label: td?.subName,
                                        },
                                        shipPoint: {
                                          value: td?.shippointId,
                                          label: td?.shippointName,
                                        },
                                        distributionChannel: {
                                          value: td?.distributionChannelId,
                                          label: td?.distributionChannelName,
                                        },
                                        soldToParty: {
                                          value: td?.soldToPartnerId,
                                          label: td?.soldToPartnerName,
                                        },
                                      },
                                    });
                                  }}
                                  style={{
                                    padding: "3px 15px",
                                    marginBottom: "1px",
                                  }}
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Create Delivery
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {pendingOrderGridData?.data?.length > 0 && (
              <PaginationTable
                count={pendingOrderGridData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}
          </>
        )}
      </Formik>
    </>
  );
}
