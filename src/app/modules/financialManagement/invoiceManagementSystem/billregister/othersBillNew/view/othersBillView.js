import React, { useState, useEffect, useRef } from "react";
// import { Formik, Form } from "formik";
import Loading from "../../../../../_helper/_loading";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  billApproved,
  // billRegisterGetById,
  othersBillEntriesGetById,
} from "../helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
// import { getMultipleFileView_Action } from "./../../../../_helper/_redux/Actions";
import printIcon from "../../../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import InputField from "../../../../../_helper/_inputField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ICustomTable from "../../../../../_helper/_customTable";
import { getMultipleFileView_Action } from "../../../../../_helper/_redux/Actions";
import { APIUrl } from "../../../../../../App";
// import { BillApproved_api } from "../../../approvebillregister/helper";
// import grid from "../../../clearPurchaseInvoice/table/grid";

const validationSchema = Yup.object().shape({
  approveAmount: Yup.number().required("Aprove Amount is required"),
  remarks: Yup.string().required("Code is required"),
});

function OthersBillView({
  gridItem,
  landingValues,
  isView = true,
  setModalShow,
  girdDataFunc,
}) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [disabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const dispatch = useDispatch()
  const printRef = useRef();
  useEffect(() => {
    if (gridItem.billRegisterId) {
      othersBillEntriesGetById(
        gridItem?.billRegisterId,
        setSingleData,
        setDisabled
      );
    }
  }, [gridItem]);

  const saveHandler = (values) => {
    const modifyGridData = {
      billId: gridItem?.billRegisterId,
      unitId: selectedBusinessUnit?.value,
      billTypeId: gridItem?.billType,
      approvedAmount: +values?.approveAmount,
      remarks: values?.remarks || "",
    };
    const payload = [modifyGridData];
    billApproved(profileData?.userId, payload, setDisabled, () => {
      singleData["monTotalAmount"] = values?.approveAmount;
      singleData["strRemarks"] = values?.remarks;
      setSingleData({ ...singleData });
      setModalShow(false);
      girdDataFunc(landingValues);
    });
  };

  const ths = [
    "SL",
    "Payee Name",
    "Bank Name",
    "Branch Name",
    "Account No",
    "Routing No",
    "Amount",
  ];

  return (
    <div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...landingValues,
            approveAmount: singleData?.monTotalAmount,
            remarks: singleData?.strRemarks,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values);
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
                <CardHeader title={"Others Bill View"}>
                  <CardHeaderToolbar>
                    {!isView && (
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
                    className="form form-label-right approveBillRegisterView print-source"
                    componentRef={printRef}
                    ref={printRef}
                  >
                    {!isView &&
                      gridItem?.billStatus?.toLowerCase() !== "approve" && (
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
                              value={singleData?.header?.monTotalAmount}
                              name="approveAmount"
                              placeholder="Approve Amount"
                              type="number"
                              required
                            />
                          </div>
                        </div>
                      )}

                    <div className="row">
                      <div className="col-lg-12 ">
                        <div
                          style={{
                            position: "absolute",
                            left: "15px",
                            top: "0",
                          }}
                        >
                          <img
                            style={{ width: "55px" }}
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                            alt=""
                          />
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-lg-12 ">
                              {selectedBusinessUnit?.imageId && (
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "15px",
                                    top: "0",
                                  }}
                                >
                                  <img
                                    style={{ width: "55px" }}
                                    src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                                    alt=""
                                  />
                                </div>
                              )}

                              <div
                                className="text-center"
                                style={{ position: "relative" }}
                              >
                                <h2>{selectedBusinessUnit?.label}</h2>
                                <h5>{selectedBusinessUnit?.address} </h5>
                                <h3>Others Bill</h3>
                                {/* <button
                  style={{
                    padding: "4px 4px",
                    position: "absolute",
                    top: "2px",
                    right: "70px",
                  }}
                  onClick={() => {
                    // dispatch(
                    //   getMultipleFileView_Action(
                    //     objHeaderDTO?.billImages
                    //   )
                    // );
                  }}
                  className="btn btn-primary ml-2 printSectionNone"
                  type="button"
                >
                  Preview <i class="far fa-images"></i>
                </button> */}
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
                            <div className="col-lg-3">
                              <p>
                                <b>SBU: </b> {landingValues?.sbu?.label}
                              </p>
                            </div>
                            <div className="col-lg-3">
                              <p>
                                <b>Plant: </b> {landingValues?.plant?.label}
                              </p>
                            </div>
                            {/* <div className="col-lg-3">
                              <p>
                                <b>Warehouse: </b> {singleData?.strWarehouseName}
                              </p>
                            </div> */}
                            {/* <div className="col-lg-3">
                              <p>
                                <b>Partner Name: </b>{" "}
                                {singleData?.header?.strPartnerName}
                              </p>
                            </div> */}
                            <div className="col-lg-3">
                              <p>
                                <b>Bill Code: </b>{" "}
                                {singleData?.header?.strBillRegisterCode}
                              </p>
                            </div>
                            <div className="col-lg-3">
                              <p>
                                <b>Payment Amount: </b>
                                {singleData?.header?.monTotalAmount}
                              </p>
                            </div>
                            <div className="col-lg-3">
                              <p>
                                <b>Bill Date: </b>
                                {_dateFormatter(
                                  singleData?.header?.dteBillRegisterDate
                                )}
                              </p>
                            </div>
                            <div className="col-lg-3">
                              <p>
                                <b>Narration: </b>{" "}
                                {singleData?.header?.strRemarks}
                              </p>
                            </div>
                            <div className="col-lg-3 hidden-part">
                              <span onClick={e=>{
                                   dispatch(
                                    getMultipleFileView_Action(
                                      singleData?.image?.length > 0
                                        ? singleData?.image?.map(item=>item?.strAttatchment)
                                        : []
                                    )
                                  );
                              }}>
                                <i className="fa fa-eye">

                                </i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <ICustomTable ths={ths}>
                          {singleData?.row?.map((itm, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{itm?.strPayeeName}</td>
                                <td> {itm?.strBankName}</td>
                                <td> {itm?.strBranchName}</td>
                                <td> {itm?.strBankAccountNumber}</td>
                                <td> {itm?.strRoutingNumber}</td>
                                <td className="text-right">{itm?.numAmount}</td>
                              </tr>
                            );
                          })}
                        </ICustomTable>
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

export default OthersBillView;
