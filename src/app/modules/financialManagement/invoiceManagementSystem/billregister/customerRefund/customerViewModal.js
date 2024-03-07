import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
    ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { APIUrl } from "../../../../../App";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import printIcon from "../../../../_helper/images/print-icon.png";

export default function CustomerViewModal({
  gridItem,
  landingValues,
  isView = true,
}) {
  const [disabled, setDisabled] = useState(false);
  const [singleData, getSingleData] = useAxiosGet("");
  const printRef = useRef();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...landingValues,
          // approveAmount: singleData?.monTotalAmount,
          // remarks: singleData?.strRemarks,
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
            {false && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Customer Refund View"}>
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
                  {/* {!isView &&
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
                    )} */}

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
                              <h3>Customer Refund</h3>

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
                          <div className="col-3">
                            <p>
                              <b>SBU: </b> {landingValues?.sbu?.label}
                            </p>
                          </div>
                          <div className="col-3">
                            <p>
                              <b>Plant: </b> {landingValues?.plant?.label}
                            </p>
                          </div>

                          <div className="col-3">
                            <p>
                              <b>Bill Code: </b>{" "}
                              {singleData?.header?.strBillRegisterCode}
                            </p>
                          </div>
                          <div className="col-3">
                            <p>
                              <b>Payment Amount: </b>
                              {singleData?.header?.monTotalAmount}
                            </p>
                          </div>
                          <div className="col-3">
                            <p>
                              <b>Bill Date: </b>
                              {_dateFormatter(
                                singleData?.header?.dteBillRegisterDate
                              )}
                            </p>
                          </div>
                          <div className="col-3">
                            <p>
                              <b>Narration: </b>{" "}
                              {singleData?.header?.strRemarks}
                            </p>
                          </div>
                          <div className="col-3 hidden-part">
                            <span
                             
                              //   onClick={(e) => {
                              //     dispatch(
                              //       getMultipleFileView_Action(
                              //         singleData?.image?.length > 0
                              //           ? singleData?.image?.map(
                              //               (item) => item?.strAttatchment
                              //             )
                              //           : []
                              //       )
                              //     );
                              //   }}
                            >
                              <i className="fa fa-eye"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row">
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
                  </div> */}
                </Form>
              </CardBody>
            </Card>
            
          </div>
        )}
      </Formik>
     
    </>
  );
}
