/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getSBUDDL } from "../../../../transportManagement/report/productWiseShipmentReport/helper";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import TextArea from "../../../../_helper/TextArea";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IClose from "../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import { salesReturnApprove_api, salesReturnCancel } from "../helper";
import EditAndApprove from "./editAndApprove";

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  status: { value: 0, label: "All" },
  viewAs: "",
  narration: "",
  returnType: "",
  sbu: "",
};

const viewers = (values) => {
  // const returnTypeId = values?.returnType?.value;
  const DDL = [
    { value: 1, label: "Supervisor" },
    { value: 2, label: "Accountant" },
  ];
  // returnTypeId === 1
  //   ? [
  //       { value: 1, label: "Supervisor" },
  //       { value: 2, label: "Accountant" },
  //     ]
  //   : [{ value: 1, label: "Supervisor" }];
  return DDL;
};

const SalesReturn = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [, landingActions, loader] = useAxiosGet();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  // get user data from store
  const {
    profileData: { accountId: accId, userId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getSBUDDL(accId, buId, setSbuDDL);
  }, [accId, buId]);

  const salesReturnLandingActions = (values, _pageNo = 0, _pageSize = 15) => {
    const url = `/oms/SalesReturnAndCancelProcess/GetSalesReturnLandingPaginationNew?Type=${values?.viewAs?.value}&accId=${accId}&status=${values?.status?.value}&BusuinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}&SalesReturnType=${values?.returnType?.value}&viewOrder=desc`;

    landingActions(url, (resData) => {
      setGridData({
        ...resData?.data,
        data: resData?.data?.data?.map((item) => ({
          ...item,
          tempQty: item?.quantity,
        })),
      });
    });
  };

  const getRows = (item) => {
    landingActions(
      `/oms/SalesReturnAndCancelProcess/GetSalesReturnDetails?SalesReturnId=${item?.salesReturnId}&AccountId=${accId}&BusinessUnitId=${buId}`,
      (resData) => {
        setRows(resData);
        setOpen(true);
      }
    );
  };

  const dataChangeHandler = (index, key, value) => {
    let _data = [...gridData?.data];
    _data[index][key] = value;
    setGridData({ ...gridData, data: _data });
  };

  const cancelHandler = (item, values) => {
    const payload = {
      head: {
        intSalesReturnId: item?.salesReturnId,
        intActionBy: userId,
      },
      row: [
        {
          intRowId: item?.rowId,
          intSalesReturnId: item?.salesReturnId,
        },
      ],
    };
    salesReturnCancel(payload, setLoading, () => {
      salesReturnLandingActions(values, pageNo, pageSize);
      // viewHandler(values);
    });
  };

  const salesReturnApprove = (values, item) => {
    let url = "";
    let payload = {};
    if ([1].includes(values?.viewAs?.value)) {
      if ([1].includes(values?.returnType?.value)) {
        payload = [
          {
            header: {
              salesReturnId: item?.salesReturnId,
              intApproveBySupervisor: employeeId,
            },
            row: [],
          },
        ];

        url = `/oms/SalesReturnAndCancelProcess/SalesReturnApprovalBySupervisor`;
      }
    } else if ([2].includes(values?.viewAs?.value)) {
      if (!values?.narration) {
        return toast.warning("Narration is required");
      }
      url = `/oms/SalesInformation/SalesChallanReturnApprove?salesReturnId=${
        item?.salesReturnId
      }&collectionDate=${_todayDate()}&businessUnitId=${buId}&actionBy=${userId}&isWastedItem=false`;
      // url = `/oms/SalesInformation/SalesChallanReturnApprove?Challan=${item?.deliveryChallan}&unitid=${buId}&intpartid=3&strNarration=${values?.narration}&intInactiveBy=${userId}&intCustomerid=${item?.businessPartnerId}`;
    }

    salesReturnApprove_api(
      url,
      payload,
      () => {
        salesReturnLandingActions(values, pageNo, pageSize);
      },
      setLoading
    );
  };

  const setPaginationHandler = (pageNo, pageSize, values) => {
    salesReturnLandingActions(values, pageNo, pageSize);
    // viewHandler(values, pageNo, pageSize);
  };

  return (
    <>
      {(loading || loader) && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <ICustomCard
              title="Sales Return"
              createHandler={() => {
                history.push(
                  `/sales-management/ordermanagement/salesreturn/entry`
                );
              }}
            >
              <form>
                <div className="row global-form">
                  <div className="col-lg-2">
                    <NewSelect
                      name="returnType"
                      options={[
                        { value: 1, label: "Full Challan" },
                        { value: 2, label: "Partial Challan" },
                      ]}
                      value={values?.returnType}
                      label="Return Type"
                      onChange={(valueOption) => {
                        setFieldValue("returnType", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Return Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="viewAs"
                      options={viewers(values)}
                      value={values?.viewAs}
                      label="View As"
                      onChange={(valueOption) => {
                        setFieldValue("viewAs", valueOption);
                        setGridData([]);
                      }}
                      placeholder="View As"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.returnType}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Approved" },
                        { value: 2, label: "Pending" },
                        { value: 3, label: "Canceled" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <FromDateToDateForm
                    obj={{ values, setFieldValue, colSize: "col-lg-2" }}
                  />

                  {values?.viewAs?.value === 2 && (
                    <>
                      <div className="col-md-2">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL || []}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                          }}
                          placeholder="Select SBU"
                        />
                      </div>{" "}
                      <div className="col-lg-4">
                        <label>Narration</label>
                        <TextArea
                          name="narration"
                          value={values?.narration}
                          label="Narration"
                          placeholder="Narration"
                        />
                      </div>
                    </>
                  )}
                  <IButton
                    onClick={() => {
                      salesReturnLandingActions(values, pageNo, pageSize);
                    }}
                    disabled={
                      !values?.viewAs ||
                      (values?.viewAs?.value === 2 && !values?.sbu)
                    }
                  />
                </div>

                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Challan No</th>
                          <th>Customer Name</th>
                          <th>Customer Code</th>
                          <th style={{ width: "120px" }}>Quantity</th>
                          <th style={{ width: "120px" }}>Amount</th>
                          <th>Entry Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center"> {index + 1}</td>
                            <td> {item?.deliveryChallan}</td>
                            <td> {item?.businessPartnerName}</td>
                            <td> {item?.businessPartnerCode}</td>

                            <td className="text-right">
                              {item?.editMode
                                ? values?.returnType?.value === 2 &&
                                  values?.viewAs?.value === 1 && (
                                    <InputField
                                      value={item?.tempQty}
                                      name="tempQty"
                                      placeholder="Quantity"
                                      type="number"
                                      onChange={(e) => {
                                        dataChangeHandler(
                                          index,
                                          "tempQty",
                                          e?.target?.value
                                        );
                                      }}
                                      onBlur={(e) => {
                                        if (
                                          e?.target?.value >
                                          item?.numDeliveryQnt
                                        ) {
                                          toast.warn(
                                            "Damage qty can not be greater than delivery qty"
                                          );
                                        }
                                      }}
                                    />
                                  )
                                : _fixedPoint(
                                    item?.quantity || item?.totalReturnQty,
                                    true
                                  )}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(
                                item?.returnAmount || item?.totalReturnAmount,
                                true
                              )}
                            </td>
                            <td> {_dateFormatter(item?.returnDateTime)}</td>
                            <td>
                              {item?.isApprovedBySupervisor &&
                              item?.isApprovedByAccount
                                ? "Approved by Supervisor and Account"
                                : item?.isApprovedBySupervisor
                                ? "Approved by Supervisor"
                                : !item?.isActive
                                ? "Canceled"
                                : "Pending"}
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                {(!item?.isApprovedByAccount ||
                                  !item?.isApprovedBySupervisor) &&
                                  item?.isActive && (
                                    <>
                                      {values?.returnType?.value === 2 &&
                                        [1].includes(values?.viewAs?.value) &&
                                        !item?.isApprovedByAccount &&
                                        !item?.isApprovedBySupervisor && (
                                          <span
                                            onClick={() => {
                                              getRows(item);
                                            }}
                                          >
                                            <IEdit title="Update and Approve" />
                                          </span>
                                        )}
                                      {(([1].includes(values?.viewAs?.value) &&
                                        !item?.isApprovedBySupervisor) ||
                                        ([2].includes(values?.viewAs?.value) &&
                                          !item?.isApprovedByAccount)) && (
                                        <span
                                          className="cursor-pointer"
                                          onClick={() => {
                                            cancelHandler(item, values);
                                          }}
                                        >
                                          <IClose title="Cancel Sales Return" />
                                        </span>
                                      )}
                                      {[2, 0].includes(values?.status?.value) &&
                                        ([1].includes(
                                          values?.returnType?.value
                                        ) ||
                                          ([2].includes(
                                            values?.returnType?.value
                                          ) &&
                                            [2].includes(
                                              values?.viewAs?.value
                                            ))) && (
                                          <span
                                            onClick={() => {
                                              salesReturnApprove(values, item);
                                            }}
                                          >
                                            <IApproval title="Approve the Sales Return" />
                                          </span>
                                        )}
                                    </>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                          <td colSpan={4} className="text-right">
                            <b>Total</b>
                          </td>
                          <td>
                            {_fixedPoint(
                              gridData?.data?.reduce(
                                (a, b) => a + b?.totalReturnQty,
                                0
                              ),
                              true,
                              0
                            )}
                          </td>
                          <td>
                            {_fixedPoint(
                              gridData?.data?.reduce(
                                (a, b) => a + b?.totalReturnAmount,
                                0
                              ),
                              true
                            )}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tbody>
                    </table>{" "}
                  </div>
                )}
              </form>
              <IViewModal
                show={open}
                onHide={() => {
                  setOpen(false);
                }}
              >
                <EditAndApprove
                  rows={rows}
                  setRows={setRows}
                  setOpen={setOpen}
                  getLanding={salesReturnLandingActions}
                  preValues={values}
                />
              </IViewModal>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPaginationHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default SalesReturn;
