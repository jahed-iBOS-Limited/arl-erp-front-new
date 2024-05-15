import React, { useEffect, useState } from "react";
import IViewModal from "../../../_helper/_viewModal";
import { getExpenseById } from "../helper";
import { Formik, Form } from "formik";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
import IView from "../../../_helper/_helperIcons/_view";
import { _fixedPoint } from '../../../_helper/_fixedPoint';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import Loading from "../../../_helper/_loading";
import ReactToPrint from "react-to-print";
import printIcon from "../../../_helper/images/print-icon.png";
import { useRef } from "react";

const initData = {
  expenseCategory: "",
  projectName: "",
  expenseFrom: _todayDate(),
  expenseTo: _todayDate(),
  costCenter: "",
  quantity: "",
  reference: "",
  comments1: "",
  expenseDate: _todayDate(),
  transaction: "",
  expenseAmount: "",
  location: "",
  comments2: "",
  disbursmentCenter: "",
  paymentType: "",
};

export default function ViewForm({ id, show, onHide }) {
  // data from redux
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { selectedBusinessUnit } = storeData;

  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [loading, setLaoding] = useState(false);
  const [total, setTotal] = useState({
    totalAmount: 0,
    totalSupAmount: 0,
    totalLinAmount: 0,
  });
  const printRef = useRef();

  useEffect(() => {
    if (id) {
      getExpenseById(id, setSingleData, setRowDto, setLaoding);
    }
  }, [id]);

  // location
  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalSupAmount = 0;
    let totalLinAmount = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalAmount += +rowDto?.[i]?.amount || 0;
        totalSupAmount += +rowDto?.[i]?.supervisorAmount || 0;
        totalLinAmount += +rowDto?.[i]?.linemanagerAmount || 0;
      }
    }
    setTotal({ totalAmount, totalSupAmount, totalLinAmount });
  }, [rowDto]);

  const dispatch = useDispatch();

  return (
    <>
      <div className="adjustment-journal-modal">
        <IViewModal
          show={show}
          onHide={onHide}
          isShow={rowDto && false}
          title={"Internal Expense View"}
          style={{ fontSize: "1.2rem !important" }}
          btnText="Close"
        >
          <div>
            {loading && <Loading />}
            <Formik
              enableReinitialize={true}
              initialValues={id ? singleData?.objHeader : initData}
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
                <>
                  <Form
                    className="form form-label-right"
                    componentRef={printRef}
                    ref={printRef}
                  >
                    <div className="row mr-2 ml-1">
                      <div className="col-lg-12 mt-5">
                        <div
                          className="text-center "
                          style={{ position: "relative" }}
                        >
                          <h2>{selectedBusinessUnit?.label}</h2>
                          <h5> {selectedBusinessUnit?.address}</h5>
                          <h3>Internal Expense</h3>

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

                      <div
                        className="col-lg-12 mt-6 d-flex flex-wrap"
                        style={{ fontSize: "15px" }}
                      >
                        <p className="pr-4">
                          <b>Disbursement Center:</b>{" "}
                          {values?.disbursmentCenter?.label}
                        </p>
                        <p className="pr-4">
                          <b>From:</b> {values?.expenseFrom}
                        </p>
                        <p className="pr-4">
                          <b>To:</b> {values?.expenseTo}
                        </p>
                        <p className="pr-4">
                          <b>Project Name:</b> {values?.projectName?.label}
                        </p>
                        <p className="pr-4">
                          <b>Expense Group:</b> {values?.expenseGroup?.label}
                        </p>

                        <p className="pr-4">
                          <b>Cost Center:</b> {values?.costCenter?.label}
                        </p>
                        <p className="pr-4">
                          <b>Payment Type:</b> {values?.paymentType?.label}
                        </p>
                        <p className="pr-4">
                          <b>Vehicle No. (Optional):</b> {values?.reference}
                        </p>
                        <p className="pr-4">
                          <b>Comments:</b> {values?.comments1}
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-12 pr-0 ">
                          <div className="table-responsive">
                            <table className={"table mt-1 bj-table border"}>
                              <thead className={rowDto.length < 1 && "d-none"}>
                                <tr>
                                  <th
                                    style={{
                                      width: "20px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    SL
                                  </th>
                                  <th
                                    style={{
                                      width: "100px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Expense Date
                                  </th>
                                  <th
                                    style={{
                                      width: "150px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Expense Type
                                  </th>

                                  <th
                                    style={{
                                      width: "100px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Applicant Amount
                                  </th>
                                  <th
                                    style={{
                                      width: "100px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Supervisor Amount
                                  </th>
                                  <th
                                    style={{
                                      width: "100px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Line Manager Amount
                                  </th>
                                  <th
                                    style={{
                                      width: "150px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Expense Place
                                  </th>
                                  <th
                                    style={{
                                      width: "150px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Expense Description
                                  </th>
                                  <th
                                    style={{
                                      width: "100px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Driver Name
                                  </th>
                                  <th
                                    style={{
                                      width: "50px",
                                      fontSize: "14px",
                                    }}
                                    className="printSectionNone "
                                  >
                                    Attachment
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td
                                      style={{
                                        textAlign: "center",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <span className="pl-2">
                                        {_dateFormatter(item?.expenseDate)}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "15px",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.transaction?.label}
                                      </div>
                                    </td>

                                    <td
                                      style={{
                                        textAlign: "right",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <span className="pr-2">
                                        {_fixedPoint(item?.amount)}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "right",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <span className="pr-2">
                                        {_fixedPoint(item?.supervisorAmount)}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        textAlign: "right",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <span className="pr-2">
                                        {_fixedPoint(item?.linemanagerAmount)}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "15px",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.location}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "15px",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.comments2}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "15px",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.driverName}
                                      </div>
                                    </td>
                                    <td
                                      className="text-center printSectionNone "
                                      style={{
                                        fontSize: "15px",
                                      }}
                                    >
                                      {item?.attachmentLink && (
                                        <IView
                                          clickHandler={() => {
                                            dispatch(
                                              getDownlloadFileView_Action(
                                                item?.attachmentLink
                                              )
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            </div>
                            <div className="d-flex flex-column justify-content-end align-items-end">
                              <p className="m-0" style={{ fontSize: "15px" }}>
                                <b>Total Expense : {_fixedPoint(total?.totalAmount)}</b>
                              </p>
                              {total?.totalSupAmount ? (
                                <p className="m-0" style={{ fontSize: "15px" }}>
                                  <b>
                                    Total Supervisor Expense :{" "}
                                    {_fixedPoint(total?.totalSupAmount)}
                                  </b>
                                </p>
                              ) : null}
                              {total?.totalLinAmount ? (
                                <p className="m-0" style={{ fontSize: "15px" }}>
                                  <b>
                                    Total Line Manager Expense :{" "}
                                    {_fixedPoint(total?.totalLinAmount)}
                                  </b>
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </IViewModal>
      </div>
    </>
  );
}
