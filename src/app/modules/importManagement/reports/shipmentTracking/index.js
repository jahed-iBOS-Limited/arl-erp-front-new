import axios from "axios";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";

import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../../_helper/_customCard";
import { _formatMoney } from "../../../_helper/_formatMoney";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import Loading from "../../../_helper/_loading";
const initData = {
  lcnumber: "",
  po: "",
};
export default function ShipmentTracking() {
  const {
    profileData: { userTypeName, accountId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [gridData, getGridData, loadGridData] = useAxiosGet();

  const header = [
    {
      name: "Merchandise Description",
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
    {
      name: "Unit Price/M.T",
      style: {
        minWidth: "100px",
      },
    },
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
    {
      name: "Rest Qty",
      style: {
        minWidth: "100px",
      },
    },
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
  const loadPOList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${accountId}&businessUnitId=${buId}&search=${v}`
      )
      .then((res) => res?.data);
  };
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
                  </div>

                  <div className="col-lg-2 pt-5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        getGridData(
                          `/imp/Shipment/GetImportShipmentTracking?businessUnitId=${buId}&lcId=${values?.lcnumber?.value}&purchaseOrderId=${values?.po?.poId}`
                        );
                      }}
                      className="btn btn-primary"
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
                              <td className="text-center">{""}</td>
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
                              <td className="text-center">{""}</td>
                              <td>{data?.lCqty}</td>
                              <td>{""}</td>
                              <td></td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.dteLCDate)}{" "}
                              </td>
                              <td className="text-right"></td>{" "}
                              <td className="text-center">
                                {_dateFormatter(data?.dteetadate)}{" "}
                              </td>
                              <td className="text-right"></td>{" "}
                              <td className="text-right">
                                {_formatMoney(data?.numTotalPIAmountBDT)}{" "}
                              </td>
                              <td className="text-right"></td>
                              <td className="text-center">{data?.strblno}</td>
                              <td className="text-right"></td>{" "}
                              <td className="text-right">
                                {data?.numShipmentQuantity}{" "}
                              </td>{" "}
                              <td className="text-right">
                                {/* {_formatMoney(data?.numOther, 4)} */}{" "}
                              </td>{" "}
                              <td className="text-right">
                                {/* {_formatMoney(data?.numPG, 4)} */}{" "}
                              </td>{" "}
                              <td className="text-right">
                                {/* {_formatMoney(data?.numPort, 4)} */}{" "}
                              </td>{" "}
                              <td className="text-right">
                                {/* {_formatMoney(data?.numScavatory, 4)} */}{" "}
                              </td>{" "}
                              <td className="text-right">
                                {/* {_formatMoney(data?.numShipping, 4)} */}{" "}
                              </td>
                              <td className="text-right"></td>{" "}
                              <td className="text-right">
                                {data?.numNumberOfContainer}{" "}
                              </td>{" "}
                              <td className="text-right">
                                {data?.deliverystatus}
                              </td>
                              <td>{""}</td>{" "}
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
