/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ReactToPrint from "react-to-print";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import Loading from "../../../../../_helper/_loading";
// import {
//   GetCommissionByBillRegisterId,
//   GetSalesCommissionById,
// } from "../helper";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
import printIcon from "../../../../../_helper/images/print-icon.png";
import { getInternalTransportBillInfo_api } from "../../helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { Formik } from "formik";
import InputField from "../../../../../_helper/_inputField";
import { BillApproved_api } from "../../../approvebillregister/helper";
import { getMultipleFileView_Action } from "../../../../../_helper/_redux/Actions";
import * as Yup from "yup";

const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
};

const validationSchema = Yup.object().shape({
  approveAmount: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Approve amount required")
    .test("approveAmount", "Max Net Payable Amount", function(value) {
      return this.parent.approveAmountMax >= value;
    }),
});

function ViewInternalTransportBill({
  billRegisterId,
  landingValues,
  gridItem,
  setDataFunc,
  setModalShow,
}) {
  // get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const printRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    getInternalTransportBillInfo_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      gridItem?.billRegisterId,
      setGridData,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values) => {
    const modifyGridData = {
      billId: gridItem?.billRegisterId,
      unitId: selectedBusinessUnit?.value,
      billTypeId: gridItem?.billType,
      approvedAmount: +values?.approveAmount,
      remarks: values?.remarks || "",
    };
    const payload = {
      bill: [modifyGridData],
      row: [],
    };

    BillApproved_api(
      profileData?.userId,
      payload,
      setDisabled,
      setDataFunc,
      landingValues,
      setModalShow
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={{
          ...initData,
          approveAmount: gridItem?.monTotalAmount,
          approveAmountMax: gridItem?.monTotalAmount,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {});
        }}
      >
        {({ handleSubmit, resetForm, values }) => (
          <Card>
            {loading && <Loading />}
            {true && <ModalProgressBar />}
            <CardHeader title={`Internal Transport Bill (Approve Bill)`}>
              <CardHeaderToolbar>
                {landingValues?.status?.value &&
                  landingValues?.status?.value !== 2 && (
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
              <form
                className="form form-label-right approveBillRegisterView"
                componentRef={printRef}
                ref={printRef}
              >
                {landingValues?.status?.value &&
                  landingValues?.status?.value !== 2 && (
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
                          max={gridItem?.monTotalAmount}
                          required
                        />
                      </div>
                    </div>
                  )}
                <div className="row">
                  <div className="col-lg-12 ">
                    <div
                      className="text-center "
                      style={{ position: "relative" }}
                    >
                      <h2>{selectedBusinessUnit?.label}</h2>
                      <h5>{selectedBusinessUnit?.address} </h5>
                      <h3>{"Internal Transport Bill"}</h3>
                      <button
                        style={{
                          padding: "4px 4px",
                          position: "absolute",
                          top: "2px",
                          right: "70px",
                        }}
                        onClick={() => {
                          dispatch(
                            getMultipleFileView_Action(gridData?.[0]?.images)
                          );
                        }}
                        className="btn btn-primary ml-2 printSectionNone"
                        type="button"
                      >
                        Preview <i class="far fa-images"></i>
                      </button>
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
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
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Shipment Date</th>
                            <th>Shipment Code</th>
                            <th>Vehicle No</th>
                            <th>Challan Quantity</th>
                            <th>Net Amount</th>
                            {/* <th>Bill Amount</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td className="text-center align-middle">
                                    {index + 1}
                                  </td>
                                  <td>
                                    {_dateFormatter(item?.DteShipmentDate)}
                                  </td>
                                  <td>{item?.strShipmentCode}</td>
                                  <td>{item?.strVehicleNumber}</td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.decChallanQnt)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numNetPayable)}
                                  </td>
                                  {/* <td className="text-right">
                                    {_fixedPoint(item?.monBillRegisterTotal)}
                                  </td> */}
                                </tr>
                              </>
                            );
                          })}
                          <tr>
                            <td className="text-right" colSpan="5">
                              {" "}
                              <b>Total:</b>
                            </td>
                            <td className="text-right">
                              {" "}
                              <b>
                                {_fixedPoint(
                                  gridData?.reduce(
                                    (acc, cur) => (acc += cur?.numNetPayable),
                                    0
                                  )
                                )}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default ViewInternalTransportBill;
