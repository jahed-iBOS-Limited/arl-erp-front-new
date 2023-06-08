import { Formik, Form } from "formik";
import React, { useState, useRef, useEffect } from "react";
// import { useSelector, shallowEqual } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";

import ReactToPrint from "react-to-print";
import { useSelector } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import printIcon from "../../../_helper/images/print-icon.png";
import ICustomTable from "../../../_helper/_customTable";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";
import { getOutletWiseDueReport, getWarehouseDDL } from "../helper";


const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  wareHouse: "",
};

export default function OutletWiseDueReport() {
  const [gridData, setGridData] = useState([]);
  const [outletDDL, setOutletDDL] = useState([])
  const [loading, setLoading] = useState(false);

  const headers = [
    "SL",
    "Customer Name",
    "Enroll",
    "Bussiness Unit",
    "Department",
    "Designation",
    "Due Amount"
  ];

  const printRef = useRef();

  const getGridData = (values) => {
    getOutletWiseDueReport(values?.outlet?.value, setGridData, setLoading);
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


  const generateExcel = data => {

    const header = [
      {
        text: 'Customer Name',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'strEmployeeName',
      },
      {
        text: 'Enroll',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'intWHEnrollNo',
      },
      {
        text: 'Bussiness Unit',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'strUnit',
      },
      {
        text: 'Department',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'strDepatrment',
      },
      {
        text: 'Designation',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'strdesignation',
      },
      {
        text: 'Due Amount',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'amount',
      },
    ]
    const _data = data.map((item, index) => {
      return ({
        ...item,
        sl: index + 1,
      })
    })
    generateJsonToExcel(header, _data)


  }
  let toatalDueAmount = 0;

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
              <CardHeader title={"Warehouse Wise Due Report"}>
                <CardHeaderToolbar>
                  <ReactToPrint
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
                  />
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
                    <div className="col-lg-1">
                      <button
                        className="btn btn-primary mr-1"
                        style={{ marginTop: "18px" }}
                        type="button"
                        onClick={() => {
                          getGridData(values);
                        }}
                        disabled={!values?.outlet}
                      >
                        Show
                      </button>
                    </div>

                    <div className="col d-flex justify-content-end align-items-center mt-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          generateExcel(gridData);
                        }}
                        disabled={gridData?.length === 0}
                      >
                        Export Excel
                      </button>
                    </div>
                  </div>

                  <div ref={printRef}>
                    <ICustomTable ths={headers}>
                      {gridData?.map((item, index) => {
                        toatalDueAmount += item?.amount
                        return (
                          <tr key={index}>
                            <td>
                              <p className="text-center mb-0">{index + 1}</p>{" "}
                            </td>
                            <td>{item?.strEmployeeName}</td>
                            <td>{item?.intWHEnrollNo}</td>
                            <td>{item?.strUnit}</td>
                            <td>{item?.strDepatrment}</td>
                            <td>{item?.strdesignation}</td>
                            <td className="text-right">{item?.amount}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={6}>
                          <p className="text-right mb-0" style={{fontWeight: "bold"}}>{"Total"}</p>{" "}
                        </td>
                        <td className="text-right">{toatalDueAmount}</td>
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
