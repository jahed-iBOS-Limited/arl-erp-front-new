import { Formik, Form } from "formik";
import React, { useState, useEffect, useRef } from "react";
import { _todayDate } from "../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import ICustomTable from "../../../_helper/_customTable";
import Loading from "../../../_helper/_loading";
import {
  getCashBookData,
  getWarehouseDDL
} from "../helper";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  wareHouse: "",
};

export default function CashBookReport() {
  const [gridData, setGridData] = useState([]);
  const [gridData1, setGridData1] = useState([]);
  const [outletDDL, setOutletDDL] = useState([])
  const [loading, setLoading] = useState(false);

  const headers1 = [
    "SL",
    "Date",
    "Code",
    "Description",
    "Debit",
    "Credit"
  ];
  const headers2 = [
    "SL",
    "Openning Balance",
    "Receive Amount",
    "Cost Amount",
    "Cash In Hand"
  ];

  const printRef = useRef();

  const getGridData = (values) => {
    getCashBookData(
      values?.fromDate,
      values?.toDate,
      values?.outlet?.value,
      1,
      setGridData,
      setLoading
    );
    getCashBookData(
      values?.fromDate,
      values?.toDate,
      values?.outlet?.value,
      2,
      setGridData1,
      setLoading
    );
  };

  const { profileData, selectedBusinessUnit } = useSelector(state => state?.authData)

  useEffect(() => {
    getWarehouseDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setOutletDDL
    );
  }, [profileData, selectedBusinessUnit])

  let totalDebit = 0;
  let totalCredit = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        //validationSchema={validationSchema}
        onSubmit={() => { }}
      >
        {({ setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Cash Book Report"}>
                <CardHeaderToolbar>
                  {/* <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                      >
                        <img
                          style={{ width: "20px", paddingRight: "5px" }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  /> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <Form className="form form-label-right incomestatementTable">
                  <div className="row global-form incomestatementTablePrint">
                    <div className="col-lg-3">
                      <NewSelect
                        name="outlet"
                        value={values?.outlet}
                        label="Warehouse"
                        options={outletDDL}
                        onChange={(valueOption) => {
                          setFieldValue("outlet", valueOption);
                        }}
                        placeholder="Warehouse"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mt-5"
                        type="button"
                        onClick={() => {
                          getGridData(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div ref={printRef} style={{ width: "600px", margin: "auto" }}>
                    <ICustomTable ths={headers2}>
                      {gridData1?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <p className="text-center mb-0">{index + 1}</p>{" "}
                            </td>
                            <td className="text-right">{item?.ops}</td>
                            <td className="text-right">{item?.receive}</td>
                            <td className="text-right">{item?.cost}</td>
                            <td className="text-right">{item?.cashInHand}</td>
                          </tr>
                        );
                      })}
                    </ICustomTable>
                    <ICustomTable ths={headers1}>
                      {gridData?.map((item, index) => {
                        totalDebit += item?.mondebit
                        totalCredit += item?.moncredit
                        return (
                          <tr key={index}>
                            <td>
                              <p className="text-center mb-0">{index + 1}</p>{" "}
                            </td>
                            <td>{_dateFormatter(item?.dtedate)}</td>
                            <td>{item?.code}</td>
                            <td>{item?.discribtion}</td>
                            <td className="text-right">{item?.mondebit}</td>
                            <td className="text-right">{item?.moncredit}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td></td>
                        <td className="text-center" colSpan="3">
                          <span style={{fontWeight:"bold"}}>Total</span>
                        </td>
                        <td className="text-right">{totalDebit}</td>
                        <td className="text-right">{totalCredit}</td>
                      </tr>
                    </ICustomTable>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
