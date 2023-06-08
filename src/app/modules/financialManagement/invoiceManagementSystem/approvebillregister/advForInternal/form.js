import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "./../../../../_helper/_loading";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { BillApproved_api, GetInternalAdvancesByBill_api } from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import InputField from "./../../../../_helper/_inputField";
import { getMultipleFileView_Action } from "../../../../_helper/_redux/Actions";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
};

const validationSchema = Yup.object().shape({
  approveAmount: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Approve amount required")
    .test("approveAmount", "invalid number ", function(value) {
      return this.parent.approveAmountMax >= value;
    }),
});
function _Form({ gridItem, laingValues, girdDataFunc, setModalShow }) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [disabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const printRef = useRef();
  useEffect(() => {
    if (gridItem?.billRegisterId)
      GetInternalAdvancesByBill_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        gridItem?.billRegisterId,
        setSingleData,
        setDisabled
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, gridItem]);

  const saveHandler = (values) => {
    const modifyGridData = {
      remarks: values?.remarks || "",
      billId: gridItem?.billRegisterId,
      unitId: selectedBusinessUnit?.value,
      billTypeId: gridItem?.billType,
      approvedAmount: +values?.approveAmount,
    };
    const payload = {
      bill: [modifyGridData],
      row: [],
    };
    BillApproved_api(
      profileData?.userId,
      payload,
      setDisabled,
      girdDataFunc,
      laingValues,
      setModalShow
    );
  };

  useEffect(() => {
    if (singleData?.length > 0) {
      let totalApprovedAmount = 0;
      singleData.forEach((itm) => {
        totalApprovedAmount += itm?.requestedAmmount;
      });
      setTotal(totalApprovedAmount);
    }
  }, [singleData]);

  return (
    <div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            approveAmount: total,
            approveAmountMax: total,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
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
            <div className="">
              {disabled && <Loading />}
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Advance For Internal Expense View"}>
                  <CardHeaderToolbar>
                    {laingValues?.status?.value !== 2 && (
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        isDisabled={disabled}
                      >
                        Save
                      </button>
                    )}
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <Form
                    className="form form-label-right approveBillRegisterView"
                    componentRef={printRef}
                    ref={printRef}
                  >
                    {laingValues?.status?.value !== 2 && (
                      <div className="row global-form printSectionNone">
                        <div className="col-lg-3 offset-lg-6">
                          <label>Remarks</label>
                          <InputField
                            value={values?.remarks}
                            name="remarks"
                            placeholder="Remarks"
                            type="text"
                          />
                        </div>

                        <div className="col-lg-3 ">
                          <label>Approve Amount</label>
                          <InputField
                            value={values?.approveAmount}
                            name="approveAmount"
                            placeholder="Approve Amount"
                            type="number"
                            max={total}
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    <div className="row">
                      <div className="col-lg-12 ">
                        <div
                          className="text-center"
                          style={{ position: "relative" }}
                        >
                          <h2>{selectedBusinessUnit?.label}</h2>
                          <h5>{selectedBusinessUnit?.address} </h5>
                          <h3>Advance For Internal Expense</h3>
                          <button
                            style={{
                              padding: "4px 4px",
                              position: "absolute",
                              top: "2px",
                              right: "70px",
                            }}
                            onClick={() => {
                              dispatch(
                                getMultipleFileView_Action(
                                  singleData?.[0]?.billImages
                                )
                              );
                            }}
                            className="btn btn-primary ml-2 printSectionNone"
                            type="button"
                          >
                            Preview <i class="far fa-images"></i>
                          </button>
                          <ReactToPrint
                            pageStyle={
                              "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                            }
                            trigger={() => (
                              <button
                                type="button"
                                className="btn btn-primary printSectionNone"
                                style={{
                                  padding: "2px 5px",
                                  position: "absolute",
                                  top: "0",
                                  right: "0",
                                }}
                              >
                                <img
                                  style={{
                                    width: "25px",
                                    paddingRight: "5px",
                                  }}
                                  src={printIcon}
                                  alt="print-icon"
                                />
                                Print
                              </button>
                            )}
                            content={() => printRef.current}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-12 ">
                        <div className="d-flex justify-content-between">
                          <p className="m-0 ">
                            <b>Bill Code:</b> {singleData?.[0]?.billCode}
                          </p>
                          <p className="m-0">
                            <b>Bill Date: </b>
                            {_dateFormatter(gridItem?.billRegisterDate)}
                          </p>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table">
                            <thead>
                              <tr>
                                <th style={{ width: "25px" }}>Sl</th>
                                <th style={{ width: "150px" }}>Advance Code</th>
                                <th style={{ width: "150px" }}>Request Date</th>
                                <th style={{ width: "150px" }}>Due Date</th>

                                <th style={{ width: "150px" }}>
                                  Disbursement Center Name
                                </th>
                                <th style={{ width: "150px" }}>
                                  Employee Name
                                </th>

                                <th style={{ width: "150px" }}>
                                  Approved Amount
                                </th>
                                <th style={{ width: "150px" }}>Narration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {singleData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.advanceCode}</td>
                                  <td>{_dateFormatter(item?.requestDate)}</td>
                                  <td>{_dateFormatter(item?.dueDate)}</td>
                                  <td>{item?.disbursementCenterName}</td>
                                  <td>{item?.employeeName}</td>
                                  <td>{item?.requestedAmmount}</td>
                                  <td>{item?.comments}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {laingValues?.status?.value === 2 && (
                            <p className="text-right pr-1">
                              <b>Bill Approved Amount: </b>
                              {singleData?.[0]?.approvedAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          )}
        </Formik>
      </>
    </div>
  );
}

export default _Form;
