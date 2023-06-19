/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import { Formik } from "formik";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IViewModal from "../../../../_helper/_viewModal";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { deleteGudamAllotment } from "../helper";
import IConfirmModal from "../../../../_helper/_confirmModal";
import GudamAllotmentForm from "../_form/_form";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import NewSelect from "../../../../_helper/_select";

const headers = [
  "SL",
  "Business Partner",
  "Buffer Name",
  // "ShipPoint",
  "Mother Vessel",
  "Item Name",
  "Month",
  "Year",
  "Allotment Qty",
  "Revenue Rate (Tk)",
  "Revenue by Transport",
  "Action",
];

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
  organization: "",
  reportType: { value: 1, label: "Details" },
  loadingPort: "",
  motherVessel: "",
};

const GudamAllotmentLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading, setRowData] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  const [singleItem, setSingleItem] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [domesticPortDDL, getPortDDL] = useAxiosGet();
  const [
    motherVesselDDL,
    getMotherVesselDDL,
    ,
    setMotherVesselDDL,
  ] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    const FromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : "";
    const ToDate = values?.toDate ? `&ToDate=${values?.toDate}` : "";
    const url =
      values?.reportType?.value === 1
        ? `/tms/LigterLoadUnload/GetLighterShipToPartnerAllotment?BusinessUnitId=${buId}&SoldtoPartnerID=${values
            ?.organization?.value || 0}&MotherVesselId=${values?.motherVessel
            ?.value || 0}&PageNo=1&PageSize=100${FromDate}${ToDate}`
        : `/tms/LigterLoadUnload/GetLighterShipToPartnerAllotmentTopsheet?BusinessUnitId=${buId}&SoldtoPartnerID=${values
            ?.organization?.value || 0}&MotherVesselId=${values?.motherVessel
            ?.value || 0}${FromDate}${ToDate}`;
    getRowData(url);
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  useEffect(() => {
    getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this information?",
      yesAlertFunc: () => {
        deleteGudamAllotment(id, setLoading, () => {
          getData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  let totalQty = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Gudam Allotment">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        setFormType("create");
                        setShow(true);
                      }}
                      className="btn btn-primary ml-2"
                      disabled={isLoading}
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                {/* <div className="col-lg-3 mt-5">
                  <PaginationSearch
                    placeholder="Lighter Vessel Name"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div> */}
                <form className="form form-label-right">
                  <div className="global-form row">
                    <FromDateToDateForm
                      obj={{ values, setFieldValue, setRowData }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="organization"
                        options={[
                          { value: 0, label: "All" },
                          { value: 73244, label: "G2G BADC" },
                          { value: 73245, label: "G2G BCIC" },
                        ]}
                        value={values?.organization}
                        label="Organization"
                        onChange={(valueOption) => {
                          setFieldValue("organization", valueOption);
                        }}
                        placeholder="Organization"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="loadingPort"
                        options={domesticPortDDL || []}
                        value={values?.loadingPort}
                        label="Loading Port"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("loadingPort", valueOption);
                            setFieldValue("motherVessel", "");
                            getMotherVesselDDL(
                              `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${
                                profileData?.accountId
                              }&BusinessUnitId=${
                                selectedBusinessUnit?.value
                              }&PortId=${valueOption?.value || 0}`
                            );
                          } else {
                            setFieldValue("loadingPort", "");
                            setFieldValue("motherVessel", "");
                            setMotherVesselDDL([]);
                          }
                        }}
                        placeholder="Loading Port"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="motherVessel"
                        options={[
                          { value: 0, label: "All" },
                          ...motherVesselDDL,
                        ]}
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        onChange={(valueOption) => {
                          setFieldValue("motherVessel", valueOption);
                        }}
                        placeholder="Mother Vessel"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 1, label: "Details" },
                          { value: 2, label: "Top Sheet" },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("reportType", valueOption);
                            setRowData([]);
                          } else {
                            setFieldValue("reportType", {
                              value: 1,
                              label: "Details",
                            });
                            setRowData([]);
                          }
                        }}
                        placeholder="Report Type"
                      />
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getData(values, pageNo, pageSize);
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  {values?.reportType?.value === 1 ? (
                    <table
                      id="table-to-xlsx"
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {headers?.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, index) => {
                          totalQty += item?.allotmentQuantity;
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.soldToPartnerName}</td>
                              <td>{item?.shipToPartnerName}</td>
                              <td>{item?.motherVesselName}</td>
                              <td>{item?.itemName}</td>
                              <td>{getMonth(item?.monthId)}</td>
                              <td>{item?.yearId}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.allotmentQuantity, true)}
                              </td>
                              <td className="text-right">
                                {item?.revenueRate}
                              </td>
                              <td className="text-right">
                                {item?.revenueByTransport}
                              </td>
                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IEdit
                                      onClick={() => {
                                        setFormType("edit");
                                        setSingleItem(item);
                                        setShow(true);
                                      }}
                                      id={item?.id}
                                    />
                                  </span>
                                  <span
                                    onClick={() => {
                                      deleteHandler(item?.id, values);
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colSpan={8} className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>{_fixedPoint(totalQty, true)}</b>
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table
                      id="table-to-xlsx"
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          <th>Sl</th>
                          <th>Mother Vessel</th>
                          <th>Allotment Quantity</th>
                          <th>Revenue Rate (TK.)</th>
                          <th>Item Name</th>
                          <th>Sold To Partner Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.motherVesselName}</td>
                              <td className="text-center">
                                {item?.allotmentQuantity}
                              </td>
                              <td className="text-right">
                                {item?.revenueRate}
                              </td>
                              <td>{item?.itemName}</td>
                              <td>{item?.soldToPartnerName}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {rowData?.data?.length > 0 &&
                  values?.reportType?.value === 1 ? (
                    <PaginationTable
                      count={rowData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  ) : null}
                </form>
              </CardBody>
              <IViewModal show={show} onHide={() => setShow(false)}>
                <GudamAllotmentForm
                  setShow={setShow}
                  getData={getData}
                  formType={formType}
                  singleItem={singleItem}
                  tableValues={values}
                />
              </IViewModal>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default GudamAllotmentLanding;
