import { Formik, Form } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import Loading from "../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import {
  getCashFlowStatement,
  // getSbuDDLAction,
} from "./helper";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import {SetFinancialManagementReportCashFlowStatementAction} from "../../../_helper/reduxForLocalStorage/Actions"
export function CashFlowStatement() {

  const dispatch = useDispatch();
  const {financialManagementReportCashFlowStatement} = useSelector(state=>state?.localStorage)
  console.log(financialManagementReportCashFlowStatement)
  const initData = {
    fromDate: financialManagementReportCashFlowStatement?.fromDate || _firstDateofMonth(),
    toDate: financialManagementReportCashFlowStatement?.toDate || _todayDate(),
  };


  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const { registerReport } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );
  // const history = useHistory();
  // const [sbuDDL, setSbuDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [generalLedger, setGeneralLedger] = useState([]);
  // const [isShowModal, setIsShowModal] = useState(false);
  // const [tableItem, setTableItem] = useState("");
  // const [partnerLedgerModalStatus, setPartnerLedgerModalStatus] = useState(false)
  // const [partnerLedgerModalData, setPartnerLedgerModalData] = useState(null)

  useEffect(() => {
    // getSbuDDLAction(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   setSbuDDL
    // );

    // if (registerReport?.sbu?.value) {
    //   getRegisterReportAction(
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value,
    //     registerReport,
    //     setRowDto,
    //     setLoading
    //   );
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  const printRef = useRef();




  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...registerReport }}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Cash Flow Statement">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form align-items-end">
                    {/* <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={e=>{
                          setFieldValue("fromDate",e.target.value)
                          dispatch(SetFinancialManagementReportCashFlowStatementAction({
                            ...values,
                            fromDate:e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={e=>{
                          setFieldValue("toDate",e.target.value)
                          dispatch(SetFinancialManagementReportCashFlowStatementAction({
                            ...values,
                            toDate:e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className="col-lg-1">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getCashFlowStatement(
                            selectedBusinessUnit?.value,
                            0,
                            values?.fromDate,
                            values?.toDate,
                            setRowDto,
                            setLoading
                          );
                          // dispatch(setRegisterReportAction(values));
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                    <div className="col-auto">
                      {
                        rowDto?.length>0 &&    <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                        }
                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                          >
                          
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />

                      }
                 
                    </div>
                  </div>
                  {
                    rowDto?.length > 0 &&
                    <div className="d-flex flex-column align-items-center" ref={printRef}>
                      <div className="text-center">
                        <p className="mb-0" style={{fontWeight:"bold"}}>{selectedBusinessUnit?.label}</p>
                        <h4 className="text-primary">Cash Flow Statement</h4>
                        <p className="mt-4" style={{fontWeight:"bold"}}>{`For the period of: ${_dateFormatter(values?.fromDate)}  to  ${_dateFormatter(values?.toDate)}`} </p>
                      </div>

                      <table style={{ width: "65%" }} className="cashFlowStatement">
                        <tr>
                          <td colSpan="2" className="pr-5 text-right">Opening Cash & Cash Equivalent</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{ numberWithCommas( parseInt(rowDto[0]["numOpening"]))}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: "15px" }}></td>
                        </tr>
                        {
                          rowDto?.map((item, index) => {
                            switch (item.intFSId) {
                              case 9999:
                                return (<tr style={{background:"#e6ecff"}}>
                                  <td colSpan="3">{item?.strName}</td>
                                </tr>)
                              case 0:
                                if (item.strName.startsWith("Net")) {
                                  return (<tr style={{ background: "#f0f0f5" }}>
                                    <td colSpan="2">{item?.strName}</td>
                                    <td className="text-right" style={{width:"120px"}}>{ numberWithCommas( parseInt(item?.numAmount))}</td>
                                  </tr>)

                                } else if (index === rowDto.length - 1) {
                                  return (<tr style={{ background: "#e6ecff" }}>
                                    <td colSpan="2">{item?.strName}</td>
                                    <td className="text-right" style={{ width:"120px"}}>{ numberWithCommas( parseInt(item?.numAmount))}</td>
                                  </tr>)
                                }
                                return (<tr>
                                  <td colSpan="3">{item?.strName}</td>
                                </tr>)
                              case null:
                                return (<tr>
                                  <td colSpan="3" style={{ height: "15px" }}></td>
                                </tr>)

                              default:
                                return (<tr>
                                  <td style={{padding:"0 0 0 40px",fontWeight:"normal"}}>{item?.strName}</td>
                                  <td></td>
                                  <td style={{
                                    border: "1px solid black",
                                    textAlign: "right",
                                    width:"120px",
                                    padding:"0",
                                    fontWeight:"normal"
                                  }}>{ numberWithCommas( parseInt(item?.numAmount))}</td>
                                </tr>)

                            }
                          })
                        }

                        {/*                       
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Customers</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{rowDto[2]["numAmount"]}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>Other Operations</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{rowDto[3]["numAmount"]}</td>
                        </tr>
                        <tr>
                          <td colSpan="3">Cash Paid for</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Inventory Purchases</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{rowDto[5]["numAmount"]}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >General operating and aministrative expense</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{rowDto[6]["numAmount"]}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>wage expenses</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{rowDto[7]["numAmount"]}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>interest</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Income taxes</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                       
                        <tr>
                          <td colSpan="3" style={{ height: "15px" }}></td>
                        </tr>
                        <tr className="bg-primary">
                          <td colSpan="3">Investing Activities</td>
                        </tr>
                        <tr>
                          <td colSpan="3">Cash receipts from</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Sale of property and euipment</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>{rowDto[13]["numAmount"]}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>collection of principal on loans</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>sale od investment securities</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td colSpan="3">Cash Paid for</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Purchase of propertyt and equipment</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Making loans to other entities</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>Purchases of investment securities</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr style={{ background: "#f0f0f5" }}>
                          <td colSpan="2">Net Cash Flow from Investing Activities</td>
                          <td >693200</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: "15px" }}></td>
                        </tr>
                        <tr className="bg-primary">
                          <td colSpan="3">Financing Activities</td>
                        </tr>
                        <tr>
                          <td colSpan="3">Cash receipts from</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Issuance of stock</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>Borrowing</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td colSpan="3">Cash Paid for</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Repurchase of stock(treasury stock)</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td >Repayment of loans</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}></td>
                          <td>Dividends</td>
                          <td style={{
                            border: "1px solid black",
                            textAlign: "right"
                          }}>693200</td>
                        </tr>
                        <tr style={{ background: "#f0f0f5" }}>
                          <td colSpan="2">Net Cash Flow from Financing Activities</td>
                          <td >693200</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: "15px" }}></td>
                        </tr>
                        <tr style={{ background: "#f0f0f5" }}>
                          <td colSpan="2">Net Increase in Cash</td>
                          <td >693200</td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: "15px" }}></td>
                        </tr>
                        <tr style={{ background: "#f0f0f5" }}>
                          <td colSpan="2">Cash at End of Year</td>
                          <td >693200</td>
                        </tr> */}
                      </table>
                    </div>

                  }

                  {/* {rowDto?.length > 0 && values?.generalLedger?.value && (
                    <GeneralLedgerTable rowDto={rowDto} />
                  )} */}
                  {/* <IViewModal
                    title=""
                    show={isShowModal}
                    onHide={() => setIsShowModal(false)}
                  >
                    <RegisterDetailsModal
                      tableItem={tableItem}
                      values={values}
                    />
                  </IViewModal> */}
                  {/* <IViewModal
                    title=""
                    show={partnerLedgerModalStatus}
                    onHide={() => setPartnerLedgerModalStatus(false)}
                  >
                    <PartnerLedger
                      modalData={partnerLedgerModalData}
                    />
                  </IViewModal> */}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
