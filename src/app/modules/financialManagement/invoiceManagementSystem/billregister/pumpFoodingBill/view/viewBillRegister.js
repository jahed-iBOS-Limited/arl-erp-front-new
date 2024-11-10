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
// import ViewModalForTransportBill from "./viewModal";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
import printIcon from "../../../../../_helper/images/print-icon.png";
import IView from "../../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../../_helper/_viewModal";
import { getTransportBillById } from "../../helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import RentalVehicleEdit from "../../../../../transportManagement/routeCostManagement/rentalVehilceCost/Form/addEditForm";
import { useHistory } from "react-router";
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

function ViewTransportBill({
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
  // const [rowDto, setRowDto] = useState([]);
  const [show, setShow] = useState(false);
  const [shipmentId, setShipmentId] = useState("");
  const [disabled, setDisabled] = useState(false);
  const printRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    getTransportBillById(
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
            <CardHeader title={`Transport Bill View (Approve Bill)`}>
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
                      <h3>{"Transport Bill"}</h3>
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
                            <th>Supplier Name</th>
                            <th>Shipment Date</th>
                            <th>Shipment Code</th>
                            <th>Shipment Name</th>
                            <th>Challan No</th>
                            <th>Total Quantity</th>
                            <th style={{ minWidth: "40px" }}>Rate</th>
                            <th>Vehicle Name</th>
                            <th>Driver Name</th>
                            <th>Route Name</th>
                            <th>Net Payable</th>
                            <th
                              style={{ width: "100px" }}
                              className="printSectionNone"
                            >
                              Action
                            </th>
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
                                  <td>{item?.supplierName}</td>
                                  <td>{_dateFormatter(item?.shipmentDate)}</td>
                                  <td>{item?.shippmentCode}</td>
                                  <td>{item?.shippointName}</td>
                                  <td>{item?.chllanCode}</td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.totalQty)}
                                  </td>
                                  <td className="text-right">{item?.rent}</td>
                                  <td>{item?.vehicleNo}</td>
                                  <td>{item?.driver}</td>
                                  <td>{item?.routeName}</td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.netPayable)}
                                  </td>
                                  <td className="text-center printSectionNone">
                                    <span>
                                      <IView
                                        clickHandler={() => {
                                          // GetSalesCommissionById(
                                          //   item?.secondaryDeliveryId,
                                          //   setRowDto
                                          // );
                                          history.push({
                                            state: {
                                              data: {
                                                ...item,
                                                rentAmount: 0,
                                              },
                                            },
                                          });
                                          setShipmentId(item?.shipmentId);
                                          setShow(true);
                                        }}
                                      />
                                    </span>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                          <tr>
                            <td className="text-right" colSpan="11">
                              {" "}
                              <b>Total:</b>
                            </td>
                            <td className="text-right">
                              {" "}
                              <b>
                                {_fixedPoint(
                                  gridData?.rows?.reduce(
                                    (acc, cur) => (acc += cur?.netPayable),
                                    0
                                  )
                                )}
                              </b>
                            </td>
                            <td> </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </form>
              <IViewModal
                show={show}
                onHide={() => {
                  setShow(false);
                }}
              >
                {" "}
                <RentalVehicleEdit
                  isBtnHide={true}
                  billId={shipmentId}
                  // initData={rowDto}
                ></RentalVehicleEdit>{" "}
              </IViewModal>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default ViewTransportBill;
