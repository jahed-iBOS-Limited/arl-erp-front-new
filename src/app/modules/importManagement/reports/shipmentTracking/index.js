import axios from "axios";
import { Formik } from "formik";
import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";

import ICustomCard from "../../../_helper/_customCard";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
const initData = {
  lcnumber: "",
  po: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function ShipmentTracking() {
  const {
    profileData: { userTypeName, accountId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [gridData, getGridData, loadGridData] = useAxiosGet();

  const header = [
    {
      name: "Sl",
      style: {
        minWidth: "30px",
      },
    },
    {
      name: "Origin",
      style: {
        minWidth: "113px",
      },
    },

    {
      name: "Supplier Details",
      style: {
        minWidth: "82px",
      },
    },
    {
      name: "PI No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "PI Date",
      style: {
        minWidth: "65px",
      },
    },
    {
      name: "PO NO",
      style: {
        minWidth: "120px",
      },
    },
    {
      name: "LC Quantity",
      style: {
        minWidth: "70px",
      },
    },
    {
      name: "LC to be open M.T",
      style: {
        minWidth: "240px",
      },
    },
    {
      name: "LC NUMBER",
      style: {
        minWidth: "140px",
      },
    },
    {
      name: "Incoterm Name",
      style: {
        minWidth: "140px",
      },
    },
    {
      name: "LC ISSUE DATE",
      style: {
        minWidth: "140px",
      },
    },
    {
      name: "ISSUE BANK",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "LATEST DATE",
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   name: "Unit Price/M.T",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
    {
      name: "Total Price",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "SHIPMENT NUMBER",
      style: {
        minWidth: "105px",
      },
    },
    {
      name: "B/L",
      style: {
        minWidth: "100px",
      },
    },

    //
    {
      name: "invoice",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Shipped Qty (M.T)",
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   name: "Rest Qty",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
    {
      name: "ETA (Aprx)",
      style: {
        minWidth: "70px",
      },
    },
    {
      name: "INV VALUE",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "Copy Documents Rcv Date ",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Original Documents Rcv Date ",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "CNF",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Container",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Status",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "REMARKS",
      style: {
        minWidth: "100px",
      },
    },
  ];

  const printRef = useRef();

  const loadLCList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetLCDDL?accountId=${accountId}&businessUnitId=${buId}&searchByLc=${v}`
      )
      .then((res) => res?.data);
  };
  // const loadPOList = (v) => {
  //   if (v?.length < 3) return [];
  //   return axios
  //     .get(
  //       `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${accountId}&businessUnitId=${buId}&search=${v}`
  //     )
  //     .then((res) => res?.data);
  // };
  const style = {
    minWidth: "50px",
  };

  return (
    <>
      {loadGridData && <Loading />}
      <ICustomCard
        title="Shipment Tracking"
        renderProps={() => (
          <div
          // onClick={() => {
          //   setIsPrintable(true);
          // }}
          >
            {/* ( */}
            {/* <ReactToPrint
              trigger={() => (
                <button className="btn btn-primary">
                  <img
                    style={{ width: "25px", paddingRight: "5px" }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
              onAfterPrint={() => {
                setIsPrintable(false);
              }}
            /> */}
            {/* ) */}
          </div>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>LC No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.lcnumber}
                      isSearchIcon={true}
                      paddingRight={10}
                      name="lcnumber"
                      loadOptions={loadLCList}
                      handleChange={(valueOption) => {
                        setFieldValue("lcnumber", valueOption);
                        console.log({ valueOption });
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
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
                  <div className="col-lg-3">
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
                  {/* <div className="col-lg-3">
                    <label>Po No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.po}
                      isSearchIcon={true}
                      paddingRight={10}
                      name="po"
                      loadOptions={loadPOList}
                      handleChange={(valueOption) => {
                        setFieldValue("po", valueOption);
                        console.log({ valueOption });
                      }}
                    />
                  </div> */}

                  <div className="col-lg-2 pt-5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        getGridData(
                          `/imp/Shipment/GetImportShipmentTracking?businessUnitId=${buId}&lcId=${values
                            ?.lcnumber?.value || 0}&fromDate=${values?.fromDate
                          }&toDate=${values?.toDate}`
                        );
                      }}
                      className="btn btn-primary"
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div
                  ref={printRef}
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    overflow: "auto",
                  }}
                >
                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead style={style}>
                        <tr>
                          {header?.length > 0 &&
                            header?.map((item, index) => (
                              <th
                                style={{
                                  ...item?.style,
                                  position: "sticky",
                                  top: 0,
                                }}
                                key={index}
                              >
                                {item?.name}
                              </th>
                            ))}
                        </tr>
                      </thead>

                      <tbody>
                        {gridData.length >= 0 &&
                          gridData.map((data, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {data?.strCountryOriginName}
                              </td>
                              <td className="text-center">
                                {data?.strBusinessPartnerName}
                              </td>{" "}
                              <td className="text-center">
                                {data?.strPINumber}
                              </td>
                              <td>{_dateFormatter(data?.dtePIDate)}</td>
                              <td className="text-center">{data?.poNumber}</td>
                              <td>{data?.lCqty}</td>
                              <td className="text-center"></td>
                              <td className="text-center">{data?.lcNumber}</td>{" "}
                              <td className="text-center">{data?.incotermName}</td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.dteLCDate)}{" "}
                              </td>
                              <td className="text-center">{data?.issueBank}</td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.dteetadate)}{" "}
                              </td>
                              <td className="text-center">
                                {_formatMoney(data?.numTotalPIAmountBDT)}{" "}
                              </td>
                              <td className="text-center">{data?.shipmentCode}</td>
                              <td className="text-center">{data?.strblno}</td>
                              <td className="text-center">{data?.invoiceNumber}</td>{" "}
                              <td className="text-center">
                                {data?.numShipmentQuantity}{" "}
                              </td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.dteetadate)}
                              </td>{" "}
                              <td className="text-center">
                                {data?.invoiceAmount}
                              </td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.copyDocReceiveDate)}
                              </td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.docReceiveDate)}
                              </td>
                              <td className="text-center">{data?.cnFPartnerName}</td>{" "}
                              <td className="text-center">
                                {data?.numNumberOfContainer}{" "}
                              </td>{" "}
                              <td className="text-center">
                                {data?.deliverystatus}
                              </td>
                              <td>{data?.remark}</td>{" "}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
