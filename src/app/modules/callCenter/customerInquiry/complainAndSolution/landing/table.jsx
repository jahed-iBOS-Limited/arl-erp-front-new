/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { DeleteComplain } from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";

const header = [
  "SL",
  "Customer Name",
  "Supply Date",
  "Complain Date",
  "Complain Type",
  "Cause of Complain",
  "Contact Person",
  "Contact Number",
  "Site Address",
];
const statusHeader = [
  "Technical Service Dept.",
  "Production",
  "Logistic",
  "Plant Head",
  "Sales Head",
];

const initData = {
  customer: "",
};

const ComplainAndSolutionTable = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [rowData, getRowData, isLoading] = useAxiosGet([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = () => {
    getRowData(
      `/oms/Complains/GetComplainRequest?AccountId=${accId}&BusinessUnitid=${buId}`
    );
  };

  useEffect(() => {
    getData();
  }, [accId, buId]);

  const deleteComplain = (id) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Are you sure you want to delete this complain?`,
      yesAlertFunc: () => {
        DeleteComplain(id, setLoading, () => getData());
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const getColor = (status) => {
    return status
      ? { backgroundColor: "#35e635" }
      : { backgroundColor: "yellow" };
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Complain and Solution">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        history.push(
                          "/call-center-management/customer-inquiry/complainnsolution/create"
                        );
                      }}
                      className="btn btn-primary"
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(loading || isLoading) && <Loading />}
                <form className="form form-label-right">
                  {rowData?.length > 0 && (
                   <div className="table-responsive">
                     <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {header.map((th, index) => {
                            return (
                              <th rowSpan={2} key={index}>
                                {th}
                              </th>
                            );
                          })}
                          <th colSpan={5}>Approvement/Rejection Status</th>

                          <th rowSpan={2}>Actions</th>
                        </tr>
                        <tr>
                          {statusHeader.map((th, index) => {
                            return (
                              <th rowSpan={2} key={index}>
                                {th}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      {rowData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.businessPartnerName}</td>
                            <td>{_dateFormatter(item?.supplyDate)}</td>
                            <td>{_dateFormatter(item?.complainDate)}</td>
                            <td>{item?.complainTypeName}</td>
                            <td>{item?.causeofCompalinName}</td>
                            <td>{item?.contactPerson}</td>
                            <td>{item?.contactNumber}</td>
                            <td>{item?.siteAddress}</td>
                            <td style={getColor(item?.tsdapprove)}>
                              {item?.tsdapprove ? "Yes" : "No"}
                            </td>
                            <td style={getColor(item?.productionApprove)}>
                              {item?.productionApprove ? "Yes" : "No"}
                            </td>
                            <td style={getColor(item?.logisticApprove)}>
                              {item?.logisticApprove ? "Yes" : "No"}
                            </td>
                            <td style={getColor(item?.plantHeadApprove)}>
                              {item?.plantHeadApprove ? "Yes" : "No"}
                            </td>
                            <td style={getColor(item?.salesHeadApprove)}>
                              {item?.salesHeadApprove ? "Yes" : "No"}
                            </td>

                            <td
                              style={{ width: "100px" }}
                              className="text-center"
                            >
                              {
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IView
                                      title={`View ${
                                        !item?.isReject &&
                                        !item?.salesHeadApprove
                                          ? "and Approve/Reject the Complain"
                                          : ""
                                      } `}
                                      clickHandler={() => {
                                        history.push({
                                          pathname: `/call-center-management/customer-inquiry/complainnsolution/view/${item?.complainId}`,
                                          state: item,
                                        });
                                      }}
                                    />
                                  </span>
                                  {!item?.tsdapprove && !item?.isReject && (
                                    <>
                                      <span>
                                        <IEdit
                                          onClick={() => {
                                            history.push({
                                              pathname: `/call-center-management/customer-inquiry/complainnsolution/edit/${item?.complainId}`,
                                              state: item,
                                            });
                                          }}
                                        />
                                      </span>
                                      <span
                                        onClick={() => {
                                          deleteComplain(item?.complainId);
                                        }}
                                      >
                                        <IDelete title="Delete the Complain" />
                                      </span>
                                    </>
                                  )}
                                </div>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                   </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default ComplainAndSolutionTable;
