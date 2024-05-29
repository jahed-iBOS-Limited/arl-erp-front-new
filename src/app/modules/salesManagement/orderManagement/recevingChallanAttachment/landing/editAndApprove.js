/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { editSalesReturn, salesReturnApprove_api } from "../helper";

const initData = {};

const EditAndApprove = ({ rows, setRows, setOpen, getLanding, preValues }) => {
  const [loading, setLoading] = useState(false);

  // get user data from store
  const {
    profileData: { employeeId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const dataChangeHandler = (index, key, value) => {
    let _data = [...rows?.data];
    _data[index][key] = value;
    setRows({ ...rows, data: _data });
  };

  const editHandler = () => {
    const payload = {
      head: {
        intSalesReturnId: rows?.data[0]?.salesReturnId,
      },
      row: rows?.data?.map((item) => {
        return {
          intRowId: item?.rowId,
          numReturnQty: +item?.quantity,
        };
      }),
    };
    const cb = () => {
      const payloadForApprove = {
        header: {
          salesReturnId: rows?.data[0]?.salesReturnId,
          intApproveBySupervisor: employeeId,
        },
        row: rows?.data?.map((element) => ({
          rowId: element?.rowId,
          supervisorAprvQnt: element?.quantity,
        })),
      };

      // const payload = rows?.data?.map((item) => {
      //   return {
      //     header: {
      //       salesReturnId: item?.salesReturnId,
      //       intApproveBySupervisor: employeeId,
      //     },
      //     row: rows?.data?.map((element) => ({
      //       rowId: element?.rowId,
      //       supervisorAprvQnt: element?.quantity,
      //     })),
      //   };
      // });
      salesReturnApprove_api(
        `/oms/SalesReturnAndCancelProcess/SalesReturnApprovalBySupervisor`,
        payloadForApprove,
        () => {
          getLanding(preValues);
          setOpen(false);
        },
        setLoading
      );
    };
    editSalesReturn(payload, cb, setLoading);
  };

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values }) => (
          <>
            <ICustomCard
              title="Sales Return Update and Approve"
              saveHandler={() => {
                editHandler();
              }}
            >
              <form>
                {rows?.data?.length > 0 && (
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
                          {/* <th>Status</th>
                        <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {rows?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center"> {index + 1}</td>
                            <td> {item?.deliveryChallan}</td>
                            <td> {item?.businessPartnerName}</td>
                            <td> {item?.businessPartnerCode}</td>

                            <td className="text-right">
                              <InputField
                                value={item?.quantity}
                                name="quantity"
                                placeholder="Quantity"
                                type="number"
                                onChange={(e) => {
                                  dataChangeHandler(
                                    index,
                                    "quantity",
                                    e?.target?.value
                                  );
                                }}
                                onBlur={(e) => {
                                  if (e?.target?.value > item?.numDeliveryQnt) {
                                    toast.warn(
                                      "Damage qty can not be greater than delivery qty"
                                    );
                                  }
                                }}
                              />
                            </td>
                            <td className="text-right">
                              {_fixedPoint(
                                item?.returnAmount || item?.totalReturnAmount,
                                true
                              )}
                            </td>
                            <td> {_dateFormatter(item?.returnDateTime)}</td>
                            {/* <td>
                            {item?.isApprovedBySupervisor &&
                            item?.isApprovedByAccount
                              ? "Approved by Supervisor and Account"
                              : item?.isApprovedBySupervisor
                              ? "Approved by Supervisor"
                              : !item?.isActive
                              ? "Canceled"
                              : "Pending"}
                          </td> */}
                            {/* <td></td> */}
                          </tr>
                        ))}
                        <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                          <td
                            colSpan={values?.status?.value === 2 ? 5 : 4}
                            className="text-right"
                          >
                            <b>Total</b>
                          </td>
                          <td>
                            {_fixedPoint(
                              rows?.data?.reduce(
                                (a, b) =>
                                  a + +b?.quantity || +b?.totalReturnQty,
                                0
                              ),
                              true,
                              0
                            )}
                          </td>
                          <td>
                            {_fixedPoint(
                              rows?.data?.reduce(
                                (a, b) =>
                                  a + +b?.returnAmount || +b?.totalReturnAmount,
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
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default EditAndApprove;
