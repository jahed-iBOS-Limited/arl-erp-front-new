/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import {
  docReleaseStatusCheck,
  getLandingData,
  getShipmentDDL,
} from "../helper";
// import IWarningModal from "../../../../_helper/_warningModal";
// import numberWithCommas from "../../../../_helper/_numberWithCommas";

const header = [
  "SL",
  "PO No",
  "BOE No",
  "LC No",
  "Shipment No",
  "Custom Duty(BDT)",
  "Action",
];

const CustomDutyLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState([]);
  const [shipmentDDL, setShipmentDDL] = useState(false);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(75);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, shipmentId, PoNo) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      shipmentId,
      PoNo,
      pageSize,
      pageNo,
      setGridData,
      setLoading
    );
  };
  useEffect(() => {
    getGrid();
  }, [profileData, selectedBusinessUnit]);

  const getGrid = (poNo, shipment) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      shipment,
      poNo,
      pageSize,
      pageNo,
      setGridData,
      setLoading
    );
  };

  // Get PO List DDL
  const polcList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };

  // const Warning = () => {
  //   let confirmObject = {
  //     title: "Customs duty for this shipment is already created",
  //     okAlertFunc: async () => {},
  //   };
  //   IWarningModal(confirmObject);
  // };
  // console.log('grid Length: ',gridData?.data?.length)
  // console.log('grid : ',gridData)
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ poLc: "", shipment: "" }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {console.log("values", values)}
            <Card>
              <CardHeader title="Customs Duty">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      gridData?.data?.length > 0
                        ? toast.warn(
                            "Customs Duty for this Shipment is Already Created"
                          )
                        : docReleaseStatusCheck(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.poLc?.poId,
                            values?.shipment?.value
                          ).then((res) => {
                            if (res?.data?.docReleaseStatus) {
                              return history.push({
                                pathname:
                                  "/managementImport/transaction/customs-duty/create",
                                state: {
                                  PoNo: values?.poLc?.poNumber,
                                  LcNo: values?.poLc?.lcNumber,
                                  shipment: values?.shipment?.label,
                                  shipmentId: values?.shipment?.value,
                                  sbuId: values?.poLc?.sbuId,
                                  plantId: values?.poLc?.plantId,
                                  poID: values?.poLc?.poId,
                                  lcID: values?.poLc?.lcId,
                                  invoiceAmount:
                                    values?.shipment?.invoiceAmount,
                                  bankDDL: {
                                    label: values?.shipment?.bankName,
                                    value: values?.shipment?.bankId,
                                  },
                                  cnfAgency: {
                                    label: values?.shipment?.cnFLCPartnerName,
                                    value: values?.shipment?.cnFLCPartnerId,
                                  },
                                },
                              });
                            } else {
                              return toast.warn(
                                "Please Create Document Release for this Shipment"
                              );
                            }
                          });
                    }}
                    className="btn btn-primary"
                    disabled={gridData?.data?.length > 0}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-md-3 col-lg-3">
                      <label>PO/LC</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poLc}
                        isSearchIcon={true}
                        paddingRight={10}
                        name="poLc"
                        handleChange={(valueOption) => {
                          setFieldValue("poLc", valueOption);
                          getShipmentDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.label,
                            setShipmentDDL
                          );
                          setFieldValue("shipment", "");
                          getGrid(
                            valueOption?.label,
                            valueOption ? values?.shipment?.value : ""
                          );
                        }}
                        loadOptions={polcList || []}
                        placeholder="Search by PO/LC Id"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipment"
                        options={shipmentDDL || []}
                        label="Shipment No"
                        value={values?.shipment}
                        onChange={(valueOption) => {
                          setFieldValue("shipment", valueOption);
                          getGrid(values?.poLc?.label, valueOption?.value);
                          // getLandingData(
                          //   profileData?.accountId,
                          //   selectedBusinessUnit?.value,
                          //   valueOption?.value,
                          //   values?.poLc?.label,
                          //   pageSize,
                          //   pageNo,
                          //   setGridData
                          // );
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-2 pt-5 mt-1">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getLandingData(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.shipment?.value,
                            values?.poLc?.label,
                            pageSize,
                            pageNo,
                            setGridData,
                            setLoading
                          );
                        }}
                      >
                        Show
                      </button>
                    </div> */}
                  </div>

                  <ICustomTable ths={header}>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>
                              <span className="pl-2">{`${item?.poNumber}`}</span>
                            </td>
                            <td>
                              <span className="pl-2">{`${item?.boENumber}`}</span>
                            </td>
                            <td>
                              <span className="pl-2">{item?.lcNumber}</span>
                            </td>
                            <td>
                              <span className="pl-2">{item?.shipmentCode}</span>
                            </td>
                            <td className="text-right">
                              <span className="pl-2 ">
                                {_formatMoney(item?.grandTotal)}
                              </span>
                            </td>
                            <td
                              style={{ width: "100px" }}
                              className="text-center"
                            >
                              <span
                                className="edit pr-2"
                                onClick={(e) =>
                                  history.push({
                                    pathname: `/managementImport/transaction/customs-duty/view/${item?.customDutyId}`,
                                    state: {
                                      PoNo: item?.poNumber,
                                      LcNo: item?.lcNumber,
                                      shipment: item?.shipmentCode,
                                      shipmentId: values?.shipment?.value,
                                    },
                                  })
                                }
                              >
                                <IView />
                              </span>
                             {
                              (item?.boENumber <= 0) && (
                                <span
                                className="edit"
                                onClick={(e) =>
                                  history.push({
                                    pathname: `/managementImport/transaction/customs-duty/edit/${item?.customDutyId}`,
                                    state: {
                                      PoNo: item?.poNumber,
                                      LcNo: item?.lcNumber,
                                      shipment: item?.shipmentCode,
                                      shipmentId: values?.shipment?.value,
                                    },
                                  })
                                }
                              >
                                <IEdit />
                              </span>
                              )
                             }
                            </td>
                          </tr>
                        );
                      })}
                  </ICustomTable>

                  {/* Pagination Code */}
                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default CustomDutyLanding;
