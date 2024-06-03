import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Form, Formik } from "formik";
// import { getVesselDDL } from "../../../chartering/helper";
import axios from "axios";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import CommonTable from "../../../_helper/commonTable";
import IEdit from "../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import ICustomCard from "../../../_helper/_customCard";

const initData = {
  lcnumber: "",
  po: "",
};
export default function ShipmentTracking() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const {
    profileData: { userTypeName, accountId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  //   const [vesselDDL, setVesselDDL] = useState([]);
  //   useEffect(() => {
  //     getVesselDDL(accountId, buId, setVesselDDL, "");
  //   }, [accountId, buId]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loadGridData] = useAxiosGet();
  const [poData, getPoData] = useAxiosGet();

  const header = [
    "Merchandise Description",
    "Origin",
    "Supplier Details",
    "PI No",
    "PI Date",
    "PO NO",
    "LC Quantity",
    "LC to be open M.T",
    "LC NUMBER",
    "LC ISSUE DATE ",
    "ISSUE BANK",
    "LATEST DATE",
    "Unit Price/M.T",
    "Total Price ",
    "SHIPMENT NUMBER",
    "B/L",
    "invoice",
    "Shipped Qty (M.T)",
    "Rest Qty",
    "ETA (Aprx)",
    "INV VALUE ",
    "Copy Documents Rcv Date ",
    "Original Documents Rcv Date ",
    "CNF ",
    "Container ",
    "Status ",
    "REMARKS  ",
  ];

  const handleGetRowData = (values, pageNo, pageSize, searchValue) => {
    // const searchParam = searchValue ? `&search=${searchValue}` : "";

    getGridData(
      `/imp/Shipment/GettLetterOfCreaditETALandingPasignation?Lcid=1`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    handleGetRowData(values?.requisition, pageNo, pageSize, searchValue);
  };

  // const paginationSearchHandler = (searchValue, values) => {
  //   setPositionHandler(pageNo, pageSize, values, searchValue);
  // };
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
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
      }}
      // validationSchema={{}}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loadGridData && <Loading />}
          <ICustomCard title="Shipment Tracking">
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>LC No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.lcnumber}
                    isSearchIcon={true}
                    paddingRight={10}
                    name="lcnumber"
                    loadOptions={loadLCList}
                    // isDisabled={true}
                    handleChange={(valueOption) => {
                      setFieldValue("lcnumber", valueOption);
                      //   setFieldValue("shipment", "");
                      console.log({ valueOption });
                      //   getShipmentDDL(
                      //     `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${
                      //       accountId
                      //     }&buId=${0}&searchTerm=${valueOption?.label}`
                      //   );
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
                    // isDisabled={true}
                    handleChange={(valueOption) => {
                      setFieldValue("po", valueOption);
                      //   setFieldValue("shipment", "");
                      console.log({ valueOption });
                      //   getShipmentDDL(
                      //     `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${
                      //       accountId
                      //     }&buId=${0}&searchTerm=${valueOption?.label}`
                      //   );
                    }}
                  />
                </div>
                {/*              
                <div className="col-lg-2">
                  <label>Date</label>
                  <InputField
                    value={values?.dateTime || ""}
                    name="dateTime"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {}}
                  />
                </div> */}
                <div className="col-lg-2 pt-5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      getGridData(
                        `/imp/Shipment/GetImportShipmentTracking?businessUnitId=${buId}&lcId=${values?.lcnumber?.value}&purchaseOrderId=${values?.po?.poId}`
                      );
                    }}
                    className="btn btn-primary"
                    // disabled={!values?.customs || !values?.provider}
                  >
                    Show
                  </button>
                </div>
              </div>
              <div>
                {/* <PaginationSearch
              placeholder="Search..."
              paginationSearchHandler={paginationSearchHandler}
              values={values}
              /> */}
              </div>
            </Form>
            <div
              className="react-bootstrap-table table-responsive"
              styles={{
                // width: "100%",
                //   maxHeight: "80vh",
                overflow: "auto",
              }}
            >
              <table className="table table-striped table-bordered bj-table bj-table-landing">
                <thead styles={{ minWidth: "50px" }}>
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
                          {item}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {gridData.length >= 0 &&
                    gridData.map((data, index) => (
                      <tr key={index}>
                        <td>{""}</td>
                        <td>{data?.strCountryOriginName}</td>
                        <td>{data?.strBusinessPartnerName}</td>
                        <td className="text-center">{data?.strPINumber}</td>
                        <td>{_dateFormatter(data?.dtePIDate)}</td>
                        <td className="text-center">{""}</td>
                        <td>{data?.lCqty}</td>
                        <td>{""}</td>
                        <td></td>
                        <td className="text-right">
                          {_dateFormatter(data?.dteLCDate)}
                        </td>
                        <td className="text-right"></td>
                        <td className="text-right">
                          {_dateFormatter(data?.dteetadate)}
                        </td>
                        <td className="text-right"></td>
                        <td className="text-right">
                          {data?.numTotalPIAmountBDT}
                        </td>
                        <td className="text-right"></td>
                        <td className="text-right">{data?.strblno}</td>
                        <td className="text-right"></td>
                        <td className="text-right">
                          {data?.numShipmentQuantity}
                        </td>
                        <td className="text-right">
                          {/* {_formatMoney(data?.numOther, 4)} */}
                        </td>

                        <td className="text-right">
                          {/* {_formatMoney(data?.numPG, 4)} */}
                        </td>
                        <td className="text-right">
                          {/* {_formatMoney(data?.numPort, 4)} */}
                        </td>
                        <td className="text-right">
                          {/* {_formatMoney(data?.numScavatory, 4)} */}
                        </td>
                        <td className="text-right">
                          {/* {_formatMoney(data?.numShipping, 4)} */}
                        </td>
                        <td className="text-right"></td>
                        <td className="text-right">
                          {data?.numNumberOfContainer}
                        </td>
                        <td className="text-right">{data?.deliverystatus}</td>
                        <td>{""}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ICustomCard>
        </>
      )}
    </Formik>
  );
}
