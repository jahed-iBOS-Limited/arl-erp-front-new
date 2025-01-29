/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  businessUnitPlant_api,
  generateExcel,
  getInventoryAgingLanding,
  wearhouse_api,
} from "../helper";
const initData = {
  plant: "",
  wh: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
function InventoryAgingLanding() {
  const [gridData, setGridData] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [obj, setObj] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const printRef = useRef();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //get number in date
  const getDateNumber = (date) => {
    const d = new Date(date);
    const dateNumber = d.getDate();
    if (dateNumber < 9) {
      return ` 0${dateNumber}`;
    } else {
      return ` ${dateNumber}`;
    }
  };

  //get month short name
  const getMonthShortName = (date) => {
    const d = new Date(date);
    return ` ${monthNames[d.getMonth()]} `;
  };

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
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      businessUnitPlant_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        7,
        setPlantDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    console.log(pageNo);
    getInventoryAgingLanding(
      selectedBusinessUnit.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      pageNo,
      pageSize,
      setLoading
    );
  };
  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Inventory Analysis">
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
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={
                    !values?.plant || !values?.wh || !gridData?.length > 0
                  }
                  onClick={() => {
                    getInventoryAgingLanding(
                      selectedBusinessUnit.value,
                      values?.wh?.value,
                      values?.fromDate,
                      values?.toDate,
                      (data) => {
                        generateExcel(
                          [
                            {
                              text: "SL",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Code",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Name",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Uom",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Stock Qty",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Stock Cover Day",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Avg Use Day",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Last Issue Day",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                            {
                              text: "Lead Time",
                              fontSize: 9,
                              border: "all 000000 thin",
                              alignment: "center",
                              textFormat: "text",
                              bold: true,
                            },
                          ],
                          data,
                          setLoading
                        );
                      },
                      pageNo,
                      15000,
                      setLoading
                    );
                  }}
                >
                  Export Excel
                </button>
              </div>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-2">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                        setFieldValue("wh", "");
                        wearhouse_api(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          profileData?.userId,
                          valueOption?.value,
                          setwareHouseDDL
                        );
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="wh"
                      options={wareHouseDDL || []}
                      value={values?.wh}
                      label="WareHouse"
                      onChange={(valueOption) => {
                        setFieldValue("wh", valueOption);
                      }}
                      placeholder="WareHouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>

                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getInventoryAgingLanding(
                          selectedBusinessUnit.value,
                          values?.wh?.value,
                          values?.fromDate,
                          values?.toDate,
                          setGridData,
                          pageNo,
                          pageSize,
                          setLoading
                        );
                        setObj({
                          fromDate: values?.fromDate,
                          toDate: values?.toDate,
                        });
                      }}
                      disabled={!values?.wh}
                    >
                      View
                    </button>
                  </div>
                </div>

                {gridData?.length > 0 && (
                  <div ref={printRef}>
                    <div className="text-center">
                      <h2>{selectedBusinessUnit.label}</h2>
                      <h5>Inventory Analysis</h5>
                      <h5>
                        For The Period Of
                        {getMonthShortName(obj.fromDate)}
                        {getDateNumber(obj?.fromDate)} to
                        {getMonthShortName(obj.toDate)}
                        {getDateNumber(obj?.toDate)}
                      </h5>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Uom</th>
                            <th>Stock Qty</th>
                            <th>Stock Cover Day</th>
                            <th>Avg Use Day</th>
                            <th>Last Issue Days</th>
                            <th>Lead Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.length > 0 &&
                            gridData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="text-left">{item?.code}</div>
                                </td>
                                <td>
                                  <div className="text-left">
                                    {item?.itemName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left">{item?.uoM}</div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {item?.stockQty}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {item?.stockCoverDay}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {item?.avgUseDay}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {item?.lastIssueDays}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {item?.leadTime}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {gridData?.length > 0 && (
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
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default InventoryAgingLanding;
