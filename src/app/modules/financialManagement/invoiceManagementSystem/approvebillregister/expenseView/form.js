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
import {
  BillApproved_api,
  getExpanseBillDetail,
  GetExpensesByBill_api,
} from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import InputField from "./../../../../_helper/_inputField";
import IView from "./../../../../_helper/_helperIcons/_view";
import ClearExpenseViewModel from "./../../billregister/internalExpense/clearExpenseViewModel";
import { getMultipleFileView_Action } from "../../../../_helper/_redux/Actions";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { IInput } from "../../../../_helper/_input";
import { toast } from "react-toastify";
const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
};

const validationSchema = Yup.object().shape({
  approveAmount: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Approve amount required")
    // .test("approveAmount", "invalid number ", function(value) {
    //   return this.parent.approveAmountMax >= value;
    // })
    ,
    netAmount: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Net amount required"),
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
  const [expGridItem, setExpGridItem] = useState("");
  const [expModalShow, setExpModalShow] = useState(false);
  // const [total, setTotal] = useState(0);
  const [expanseBillDetail, setExpanseBillDetail] = useState(null);
  const dispatch = useDispatch();
  const printRef = useRef();
  useEffect(() => {
    if (gridItem?.billRegisterId)
      GetExpensesByBill_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        gridItem?.billRegisterId,
        setSingleData,
        setDisabled
      );
    getExpanseBillDetail({
      buId: selectedBusinessUnit?.value,
      billId: gridItem?.billRegisterId,
      setter: setExpanseBillDetail,
      setLoading: setDisabled,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, gridItem]);

  const saveHandler = (values) => {
    if (values?.approveAmount < 0) {
      return toast.warning("Net amount Invalid amount ");
    }
    if (+values?.approveAmount > gridItem?.monTotalAmount) {
      return toast.warning("Invalid amount");
    }
    const modifyGridData = {
      bill: [
        {
          billId: gridItem?.billRegisterId,
          unitId: selectedBusinessUnit?.value,
          billTypeId: gridItem?.billType,
          approvedAmount:
            +values?.approveAmount - (gridItem?.adjustmentAmount || 0),
          remarks: values?.remarks || "",
        },
      ],
      row: expanseBillDetail.map((itm) => ({
        rowId: itm?.expenseRowId,
        headerId: itm?.expenseId,
        requestAmount: itm?.requestAmount || 0,
        approvedAmount: +itm?.lineManagerAmount || 0,
        remarks: "",
      })),
    };
    const payload = modifyGridData;
    BillApproved_api(
      profileData?.userId,
      payload,
      setDisabled,
      girdDataFunc,
      laingValues,
      setModalShow
    );
  };

  // useEffect(() => {
  //   if (singleData?.length > 0) {
  //     let totalApprovedAmount = 0;
  //     singleData.forEach((itm) => {
  //       totalApprovedAmount += +itm?.numTotalAmount - +itm?.adjustAmount || 0;
  //     });
  //     setTotal(totalApprovedAmount);
  //   }
  // }, [singleData]);
  // /fino/Expense/ExpanseBillDetail?BillId=26893&BusinessUnitId=4

  const requestAmountTotal = expanseBillDetail?.reduce(
    (acc, cur) => (acc += cur?.requestAmount),
    0
  );
  const lineManagerAmount = expanseBillDetail?.reduce(
    (acc, cur) => (acc += cur?.lineManagerAmount),
    0
  );

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl, setFieldValue, item) => {
    let data = [...expanseBillDetail];
    if(+value < (+item?.adjustmentAmount || 0)){
      return toast.warn("Line Manager amount can not be less than Adjustment amount");
    }
    if(+value > (+item?.lineManagerAmountForCondition || 0)){
      return toast.warn("Line Manager amount can not be greater than Line Manager Approval amount");
    }
    if (+value > item?.requestAmount) {
      return toast.warning("Invalid amount", { toastId: "requestAmount" });
    }
    let _sl = data[sl];
    _sl[name] = +value;
    const lineManagerAmount = data?.reduce(
      (acc, cur) => (acc += +cur?.lineManagerAmount || 0),
      0
    );
    setFieldValue("approveAmount", lineManagerAmount);
    setExpanseBillDetail(data);
  };
  const netAmount =
    (+lineManagerAmount || 0) - (gridItem?.adjustmentAmount || 0);
  return (
    <div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            approveAmount: lineManagerAmount,
            approveAmountMax:
              requestAmountTotal - (gridItem?.adjustmentAmount || 0),
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
                <CardHeader title={"Expense View (Approve Bill)"}>
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
                        <div className="col-lg-3">
                          <label>Remarks</label>
                          <InputField
                            value={values?.remarks}
                            name="remarks"
                            placeholder="Remarks"
                            type="text"
                          />
                        </div>

                        <div className="col-lg-3 ">
                          <label>Adjustment Amount</label>
                          <InputField
                            value={gridItem?.adjustmentAmount}
                            name="ajustmentAmount"
                            placeholder="Adjustment Amount"
                            type="number"
                            disabled
                          />
                        </div>
                        <div className="col-lg-3 ">
                          <label>Approve Amount</label>
                          <InputField
                            value={values?.approveAmount}
                            name="approveAmount"
                            placeholder="Approve Amount"
                            type="number"
                            disabled
                          />
                        </div>
                        <div className="col-lg-3 ">
                          <label>Net Amount</label>
                          <InputField
                            value={netAmount}
                            name="totalAmount"
                            placeholder="Total Amount"
                            type="number"
                            disabled
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
                          <h3>Internal Expense</h3>
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
                        <div className="d-flex justify-content-between">
                          <p className="m-0 ">
                            <b>Bill Code:</b> {singleData?.[0]?.billCode}
                          </p>
                          <p className="m-0">
                            <b>Bill Date:</b>{" "}
                            {_dateFormatter(gridItem?.billRegisterDate)}
                          </p>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table">
                            <thead>
                              <tr>
                                <th style={{ width: "25px" }}>Sl</th>
                                <th style={{ width: "150px" }}>Code</th>
                                <th style={{ width: "150px" }}>For Name</th>
                                <th style={{ width: "150px" }}>From Date</th>
                                <th style={{ width: "150px" }}>To Date</th>
                                <th style={{ width: "150px" }}>
                                  Disbursement Center
                                </th>
                                <th style={{ width: "150px" }}>Payment Type</th>

                                <th style={{ width: "150px" }}>
                                  Total Expense
                                </th>
                                <th style={{ width: "150px" }}>
                                  Adjust Amount
                                </th>
                                <th
                                  style={{ width: "150px" }}
                                  className="printSectionNone"
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {singleData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.expenseCode}</td>
                                  <td>{item?.expenseForName}</td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.fromDate)}
                                  </td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.toDate)}
                                  </td>
                                  <td>{item?.disbursementCenterName}</td>
                                  <td>{item?.paymentType}</td>

                                  <td className="text-right">
                                    {item?.numTotalAmount}
                                  </td>
                                  <td className="text-right">
                                    {item?.adjustAmount}
                                  </td>
                                  <td className="text-center printSectionNone">
                                    <span className="view ">
                                      <IView
                                        clickHandler={() => {
                                          setExpModalShow(true);
                                          setExpGridItem(item);
                                        }}
                                      />
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td className="text-right" colspan="7">
                                  Total
                                </td>

                                <td className="text-right">
                                  {singleData?.reduce(
                                    (acc, cur) => (acc += cur?.numTotalAmount),
                                    0
                                  )}
                                </td>
                                <td className="text-right">
                                  {singleData?.reduce(
                                    (acc, cur) => (acc += cur?.adjustAmount),
                                    0
                                  )}
                                </td>
                                <td className="text-right"></td>
                              </tr>
                            </tbody>
                          </table>
                          {laingValues?.status?.value === 2 && (
                            <p className="mt-2 text-right">
                              <b>Bill Approved Amount:</b>{" "}
                              {singleData?.[0]?.numTotalApprovedAmount}
                            </p>
                          )}
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="m-0 ">
                            <b>Detail:</b>
                          </p>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table">
                            <thead>
                              <tr>
                                <th style={{ width: "25px" }}>Sl</th>
                                <th style={{ width: "150px" }}>Code</th>
                                <th style={{ width: "150px" }}>
                                  Business Transaction Name
                                </th>
                                <th style={{ width: "150px" }}>Employee</th>
                                <th style={{ width: "150px" }}>
                                  Expense Group
                                </th>
                                <th style={{ width: "150px" }}>
                                  Line Manager Req. Amount
                                </th>
                                <th style={{ width: "150px" }}>
                                  Adjustment Amount
                                </th>
                                <th style={{ width: "150px" }}>
                                  Line Manager Amount
                                </th>
                                <th style={{ width: "150px" }}>Remarks</th>
                                <th
                                  style={{ width: "150px" }}
                                  className="printSectionNone"
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {expanseBillDetail?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.expenseCode}</td>
                                  <td>{item?.businessTransactionName}</td>
                                  <td>{item?.employeeFullName}</td>
                                  <td>{item?.expenseGroup}</td>
                                  <td>{item?.requestAmount}</td>
                                  <td>{item?.adjustmentAmount}</td>
                                  <td>
                                    <IInput
                                      value={item?.lineManagerAmount}
                                      name="lineManagerAmount"
                                      type="number"
                                      placeholder="Amount"
                                      required
                                      onChange={(e) => {
                                        rowDtoHandler(
                                          "lineManagerAmount",
                                          e.target.value,
                                          index,
                                          setFieldValue,
                                          item
                                        );
                                      }}
                                      min="0"
                                      disabled={
                                        laingValues?.status?.value === 2
                                      }
                                    />
                                  </td>
                                  <td>{item?.comments}</td>
                                  <td className="text-center printSectionNone">
                                    <span className="view ">
                                      <IView />
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td className="text-right" colspan="7">
                                  Total
                                </td>

                                <td className="text-right">
                                  {expanseBillDetail?.reduce(
                                    (acc, cur) =>
                                      (acc += cur?.lineManagerAmount),
                                    0
                                  )}
                                </td>
                                <td className="text-right"></td>
                                <td className="text-right"></td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-2 text-right">
                            <b>Total Expense Amount:</b> {lineManagerAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ClearExpenseViewModel
                      show={expModalShow}
                      gridRowDataClearExpViewBtn={expGridItem}
                      onHide={() => setExpModalShow(false)}
                    />
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
