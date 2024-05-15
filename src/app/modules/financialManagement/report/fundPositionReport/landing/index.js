/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  businessUnitPlant_api,
  generateExcel,
  getFundPositionReportLanding,
  getInventoryAgingLanding,
  wearhouse_api,
} from "../helper";
const initData = {
  plant: "",
  wh: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
function FundPositionReport() {
  const [gridData, setGridData] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [obj, setObj] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const printRef = useRef();

  //print function
  const printDocument = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [600, 400],
      });
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("Up4-receipt.pdf");
    });
  };

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    getFundPositionReportLanding(
      selectedBusinessUnit?.value,
      setGridData,
      setLoading
    );
  }, [selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    console.log(pageNo);
  };
  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Fund Position">
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <div className="d-flex justify-content-end mt-1 mb-1 ">
                <button type="button" className="btn btn-primary mr-1">
                  <ReactToPrint
                    trigger={() => (
                      <i
                        style={{ fontSize: "18px" }}
                        className="fas fa-print"
                      ></i>
                    )}
                    content={() => printRef.current}
                  />
                </button>
              </div>
              <Form>
                {gridData?.length > 0 && (
                  <div ref={printRef}>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Particulers</th>
                            <th>Bank</th>
                            <th>Amount</th>
                            <th>Amount</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.length > 0 &&
                            gridData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>

                                <td>
                                  <div className="text-left">
                                    {item?.strType}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {item?.strBankCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {_formatMoney(item?.numBalanceA)}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {_formatMoney(item?.numBalanceB)}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {_formatMoney(item?.numTotal)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* {gridData?.length > 0 && (
                  <PaginationTable
                    count={gridData?.length > 0 && gridData[0]?.totalRows}
                    setPositionHandler={(pNo, pSize, ivalues) =>
                      setPositionHandler(pNo, pSize, ivalues)
                    }
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    rowsPerPageOptions={[10, 20, 50, 100, 500]}
                    values={values}
                  />
                )} */}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default FundPositionReport;
