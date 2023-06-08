/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import printIcon from "../../../../../_helper/images/print-icon.png";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import { getMultipleFileView_Action } from "../../../../../_helper/_redux/Actions";
import { BillApproved_api } from "../../../approvebillregister/helper";
import { getG2GCarrierBillById } from "../../helper";

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

function ViewMotherVesselBill({
  landingValues,
  gridItem,
  setDataFunc,
  setModalShow,
}) {
  console.log(gridItem, "gridItem");
  // get profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const printRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    getG2GCarrierBillById(
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
            <CardHeader title={`Mother Vessel Bill View (Approve Bill)`}>
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
                      <h3>Mother Vessel Bill</h3>
                      <button
                        style={{
                          padding: "4px 4px",
                          position: "absolute",
                          top: "2px",
                          right: "70px",
                        }}
                        onClick={() => {
                          dispatch(
                            getMultipleFileView_Action(gridData?.images)
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
                            <th>Ship Point Name</th>
                            <th>Lighter Vessel Name</th>
                            <th>Mother Vessel Name</th>
                            <th>Unload Date</th>
                            <th>Quantity(MT)</th>
                            <th>Carrier Rate</th>
                            <th>Commission Rate</th>
                            <th>Bill Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.rows?.map((item, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td
                                    style={{ width: "30px" }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{item?.shipPointName}</td>
                                  <td>{item?.lighterVesselName}</td>
                                  <td>{item?.motherVesselName}</td>
                                  <td>
                                    {_dateFormatter(item?.unLoadCompleteDate)}
                                  </td>
                                  <td>{item?.receiveQnt}</td>
                                  <td className="text-right">
                                    {item?.carrierRate || 0}
                                  </td>
                                  <td className="text-right">
                                    {item?.carrierCommissionRate || 0}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.billAmount)}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                          <tr>
                            <td className="text-right" colSpan="8">
                              <b>Total:</b>
                            </td>
                            <td className="text-right">
                              <b>
                                {_fixedPoint(
                                  gridData?.rows?.reduce(
                                    (acc, cur) => (acc += cur?.billAmount),
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

export default ViewMotherVesselBill;
