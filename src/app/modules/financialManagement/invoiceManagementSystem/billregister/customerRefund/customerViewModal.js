import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getMultipleFileView_Action } from "../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import printIcon from "../../../../_helper/images/print-icon.png";

export default function CustomerViewModal({
  gridItem,
  landingValues,
  isView = true,
}) {
  const [disabled] = useState(false);
  const [singleData, getSingleData, loadingSingleData] = useAxiosGet([]);
  const printRef = useRef();
  const { selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    getSingleData(
      `/fino/OthersBillEntry/CustomerRefundGetById?billId=${gridItem?.billRegisterId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridItem]);
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
            {loadingSingleData && <Loading />}
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
                              onClick={(e) => {
                                dispatch(
                                  getMultipleFileView_Action(
                                    singleData?.image?.length > 0
                                      ? singleData?.image?.map(
                                          (item) => item?.strAttatchment
                                        )
                                      : []
                                  )
                                );
                              }}
                            >
                              <i className="fa fa-eye"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="table-responsive">
                        <table className="table custom-table global-table">
                          <thead>
                            <tr>
                              <th>Customer Code</th>
                              <th>Customer Name</th>
                              <th>Bank Name</th>
                              <th>Branch Name</th>
                              <th>Account No</th>
                              <th>Routing</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-center">
                                {singleData?.row?.strBusinessPartnerCode}
                              </td>
                              <td className="text-center">
                                {singleData?.row?.strBusinessPartnerName}
                              </td>
                              <td className="text-center">
                                {singleData?.row?.strBankName}
                              </td>
                              <td className="text-center">
                                {singleData?.row?.strBankBranchName}
                              </td>
                              <td className="text-center">
                                {singleData?.row?.strBankAccountNo}
                              </td>
                              <td className="text-center">
                                {singleData?.row?.strRoutingNo}
                              </td>
                              <td className="text-right">
                                {singleData?.row?.monTotalAmount}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
  );
}
