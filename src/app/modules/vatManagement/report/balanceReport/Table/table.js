import React, { useEffect, useState, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getReportBalance } from '../helper'
import Loading from '../../../../_helper/_loading'
import numberWithCommas from "../../../../_helper/_numberWithCommas"
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { Formik, Form } from "formik";
import { _todayDate } from '../../../../_helper/_todayDate';
import InputField from '../../../../_helper/_inputField';
import ButtonStyleOne from '../../../../_helper/button/ButtonStyleOne';
const html2pdf = require("html2pdf.js")


const initData = {
  fromDate: _todayDate(),
}
export default function BalancerReportTable() {
  const [rowDto, setRowDto] = useState({})
  const [loading, setLoading] = useState(false)

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getReportBalance(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        _todayDate(),
        setRowDto,
        setLoading
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData])

  const pdfExport = (fileName) => {
    var element = document.getElementById('pdf-section');
    var opt = {
      margin: 1,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: 'px', hotfixes: ["px_scaling"], orientation: 'p' },
    };
    html2pdf().set(opt).from(element).save();
  }

  const printRef = useRef();

  const equityAndLiaTotal = (rowDto) => {
    let a = (+rowDto?.equityTotalBalance || 0).toFixed(2)
    let b = (+rowDto?.nonCurrentLiabilityTotalBalance || 0).toFixed(2)
    let c = (+rowDto?.currentLiabilityTotalBalance || 0).toFixed(2)
    
    let total = ((+a) + (+b) + (+c)).toFixed(2)

    return total
    
  }

  return (

    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Balance Report">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form align-items-end">
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-auto">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getReportBalance(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.fromDate,
                            setRowDto,
                            setLoading
                          )
                        }}
                      // style={{ marginTop: "19px" }}
                      />
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-primary sales_invoice_btn"
                        style={{ float: 'right', marginLeft: "5px" }}
                        onClick={() => { pdfExport("balanceReport") }}
                      >
                        Export PDF
                      </button>
                    </div>
                    <div className="col-auto">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn btn-primary sales_invoice_btn export-excel"
                        table="table-to-xlsx"
                        filename="balanceReport"
                        sheet="tablexls"
                        buttonText="Export Excel"
                      />
                    </div>
                    <div className="col-auto">
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: A4 portrait ! important; margin-top:20}}"
                        }

                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-primary sales_invoice_btn"
                            style={{ float: 'right', marginLeft: "5px" }}
                          >
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />
                    </div>
                  </div>
                </Form>
                <div className="mx-auto mt-2" id="pdf-section" ref={printRef}>
                  <div className="titleContent text-center">
                    <h3>{selectedBusinessUnit?.label}</h3>
                    <h5>Balance Sheet</h5>
                    <p className="m-0">
                      {' '}
                    </p>
                  </div>
                  <div style={{ width: 600, margin: "auto" }}>
                    <div className=" my-5">
                      <table >
                        <tr>
                          <td style={{ fontWeight: "bold" }}>Particulars</td>
                          <td style={{ fontWeight: "bold" }}>Amount</td>
                          <td className="text-right" style={{ fontWeight: "bold" }}>Amount</td>
                        </tr>
                        <tr style={{ background: "#D8D8D8" }}>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>Assets</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>Non-Current Assets</td>
                        </tr>

                        {rowDto?.nonCurrentAssets &&
                          rowDto?.nonCurrentAssets.map((itm, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-left" style={{ paddingLeft: "20px" }}>{itm.strGlName}</td>
                                <td className="text-right"
                                  style={{ border: "1px solid black" }}
                                >
                                  <span className="pr-1">
                                    {numberWithCommas(parseFloat(itm.numBalance).toFixed(2))}
                                  </span>
                                </td>
                                <td></td>
                              </tr>
                            )
                          })}
                        <tr style={{ background: "#F2F2F2" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>Total Non-Current Assets</td>
                          <td className="text-right">{numberWithCommas(parseFloat(rowDto?.nonCurrentAssetsTotalBalance).toFixed(2))}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>Current Assets</td>
                        </tr>
                        {rowDto?.currentassets &&
                          rowDto?.currentassets.map((itm, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-left" style={{ paddingLeft: "20px" }}>{itm.strGlName}</td>
                                <td className="text-right" style={{ border: "1px solid black" }}>
                                  <span className="pr-1">
                                    {numberWithCommas(parseFloat(itm.numBalance).toFixed(2))}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <tr style={{ background: "#F2F2F2" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>Total Current Assets</td>
                          <td className="text-right">{numberWithCommas(parseFloat(rowDto?.currentassetsTotalBalance).toFixed(2))}</td>
                        </tr>
                        <tr style={{ background: "#D8D8D8" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>Total Assets</td>
                          <td className="text-right" style={{ borderBottom: "3px double black" }}> {numberWithCommas(parseFloat(rowDto?.currentassetsTotalBalance + rowDto.nonCurrentAssetsTotalBalance).toFixed(2))}</td>
                        </tr>
                        <tr style={{ height: "15px" }}></tr>
                        <tr style={{ background: "#D8D8D8" }}>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>EQUITY AND LIABILITIES</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>Equity</td>
                        </tr>

                        {rowDto?.equity &&
                          rowDto?.equity.map((itm, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-left" style={{ paddingLeft: "20px" }}>{itm.strGlName}</td>
                                <td className="text-right"
                                  style={{ border: "1px solid black" }}>
                                  <span className="pr-1">
                                    {numberWithCommas(parseFloat(itm.numBalance).toFixed(2))}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <tr style={{ background: "#F2F2F2" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>Total Equity</td>
                          <td className="text-right">{numberWithCommas(parseFloat(rowDto?.equityTotalBalance).toFixed(2))}</td>
                        </tr>
                        {/* <tr key="g">
                            <td className="text-center">Total</td>
                            <td className="text-right">
                              <span clssName="pr-1">
                                {numberWithCommas(parseFloat(rowDto?.equityTotalBalance).toFixed(2))}
                              </span>
                            </td>
                          </tr> */}

                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>Non-Current Liabilities</td>
                        </tr>
                        {/* <tr key="h">
                            <th style={{ width: '60%' }}>Non-Current Liabilities</th>
                            <th>Amount</th>
                          </tr> */}
                        {rowDto?.nonCurrentLiability &&
                          rowDto?.nonCurrentLiability.map((itm, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-left" style={{ paddingLeft: "20px" }}>{itm.strGlName}</td>
                                <td className="text-right" style={{ border: "1px solid black" }}>
                                  <span className="pr-1">
                                    {numberWithCommas(parseFloat(itm.numBalance).toFixed(2))}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <tr style={{ background: "#F2F2F2" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>Total Non-Current Liability</td>
                          <td className="text-right">{numberWithCommas(parseFloat(rowDto?.nonCurrentLiabilityTotalBalance).toFixed(2))}</td>
                        </tr>
                        {/* <tr key="i">
                            <td className="text-center">Total</td>
                            <td className="text-right">
                              <span>
                                {numberWithCommas(parseFloat(rowDto?.nonCurrentLiabilityTotalBalance).toFixed(2))}
                              </span>
                            </td>
                          </tr> */}
                        <tr>
                          <td colSpan="3" style={{ fontWeight: "bold" }}>Current Liabilities</td>
                        </tr>
                        {/* <tr key="j">
                            <th style={{ width: '60%' }}>Current Liabilities</th>
                            <th>Amount</th>
                          </tr> */}
                        {rowDto?.currentLiability &&
                          rowDto?.currentLiability.map((itm, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-left" style={{ paddingLeft: "20px" }}>{itm.strGlName}</td>
                                <td className="text-right" style={{ border: "1px solid black" }}>
                                  <span className="pr-1">
                                    {numberWithCommas(parseFloat(itm.numBalance).toFixed(2))}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <tr style={{ background: "#F2F2F2" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>Total Current Liabilities</td>
                          <td className="text-right">{numberWithCommas(parseFloat(rowDto?.currentLiabilityTotalBalance).toFixed(2))}</td>
                        </tr>
                        {/* <tr key="k">
                            <td className="text-center">Total</td>
                            <td className="text-right">
                              <span className="pr-1">
                                {numberWithCommas(parseFloat(rowDto?.currentLiabilityTotalBalance).toFixed(2))}
                              </span>
                            </td>
                          </tr> */}
                        <tr style={{ background: "#D8D8D8" }}>
                          <td colSpan="2" style={{ fontWeight: "bold" }}>TOTAL EQUITY AND LIABILITIES</td>
                          <td className="text-right" style={{ borderBottom: "3px double black" }}>{numberWithCommas(equityAndLiaTotal(rowDto))}</td>
                        </tr>
                        <tr style={{ height: "15px" }}></tr>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            {/* <Card>
              <CardHeader title={"Balance Report"}>
                <CardHeaderToolbar>
            
                </CardHeaderToolbar>
              </CardHeader>
              <div className="mx-auto mt-2" id="pdf-section" ref={printRef}>
                <div className="titleContent text-center">
                  <h3>{selectedBusinessUnit?.label}</h3>
                  <h5>Balance Sheet</h5>
                  <p className="m-0">
                    {' '}
                  </p>
                </div>

                {loading && <Loading />}
           
              </div>
            </Card> */}
          </>
        )}
      </Formik>

    </>
  )
}
