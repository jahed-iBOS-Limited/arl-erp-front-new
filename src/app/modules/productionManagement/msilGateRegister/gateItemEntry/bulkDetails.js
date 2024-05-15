import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";

function BulkDetails({ item, landingData, setIsShowModel, landingValues }) {
  const [, saveData] = useAxiosPost();
  const [isBulk, setIsBulk] = useState(true);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Bulk Create"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      saveData(
                        `/mes/MSIL/ItemGateEntryCreateAndEdit`,
                        {
                          isBulk: isBulk,
                          updateIsBulk: true,
                          intGateEntryItemListId: item?.intGateEntryItemListId,
                          intBusinessUnitId: selectedBusinessUnit?.value,
                          dteDate: values?.date,
                          intSupplierId: 0,
                          strSupplierName: "",
                          intVehicleId: 0,
                          strTruckNumber: "",
                          strDriverName: "",
                          strDriverMobileNo: "",
                          strInvoiceNumber: "",
                          tmInTime: "",
                          // tmOutTime: values?.outTime,
                          intShiftIncharge: "",
                          strShiftIncharge: "",
                          strRemarks: "",
                          intActionBy: profileData?.userId,
                          dteInsertDate: _todayDate(),
                          isActive: true,
                          intItemId: 0,
                          strItemName: "",
                          intUoMid: 0,
                          strUoMname: "",
                          isScalable: 0,
                          intClientTypeId: 0,
                          strClientTypeName: "",
                          strVatChallanNo: "",
                        },
                        () => {
                          landingData(landingValues);
                          setIsShowModel(false);
                        },
                        true
                      );
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                    disabled={item?.isBulk != null}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {false && <Loading />}

                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-4 mb-5 mt-1">
                      <label className="mr-3">
                        <b>Is Bulk?</b>
                        <input
                          type="radio"
                          name="isBulk"
                          checked={isBulk}
                          className="mr-1 pointer ml-3"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(valueOption) => {
                            setIsBulk(true);
                          }}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="isBulk"
                          checked={!isBulk}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(e) => {
                            setIsBulk(false);
                          }}
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="weight-report-details ml-4">
                      <div className="table-responsive">
                        <table className="weight-report-details-left-table">
                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Date
                            </td>
                            <td>: </td>
                            <td style={{ width: "300px" }}>
                              {_dateFormatter(item?.dteDate?.split("T"))}
                            </td>
                            <td class="bold">Reg. No</td>
                            <td>: </td>
                            <td>{item?.strEntryCode}</td>
                          </tr>
                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Gate Entry
                            </td>
                            <td>: </td>
                            <td style={{ width: "300px" }}>
                              {_timeFormatter(item?.tmInTime || "")}
                            </td>

                            <td class="bold">Gate Out</td>
                            <td>: </td>
                            <td>{_timeFormatter(item?.tmOutTime || "")}</td>
                          </tr>

                          <tr>
                            <td class="bold" style={{ minWidth: "125px" }}>
                              {"Customer"}
                            </td>
                            <td>: </td>
                            <td colSpan={4}>{item?.strSupplierName}</td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Item Name
                            </td>
                            <td>: </td>
                            <td colSpan={4}>{item?.strItemName}</td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Challan No
                            </td>
                            <td>: </td>
                            <td style={{ width: "300px" }}>
                              {item?.strInvoiceNumber}
                            </td>

                            <td class="bold">Shift Incharge</td>
                            <td>: </td>
                            <td>{item?.strShiftIncharge}</td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Driver Name
                            </td>
                            <td>: </td>
                            <td style={{ width: "300px" }}>
                              {item?.strDriverName}
                            </td>

                            <td class="bold">Driver Mobile No</td>
                            <td>: </td>
                            <td>{item?.strDriverMobileNo}</td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Vehicle No
                            </td>
                            <td>: </td>
                            <td>{item?.strTruckNumber}</td>
                          </tr>
                          {/*
                          <tr>
                            <td style={{minWidth:"125px"}} class="bold">Driver Name</td>
                            <td>: </td>
                            <td style={{width:"300px"}}>{reportData[0]?.driverName}</td>

                            <td class="bold">Quantity</td>
                            <td>: </td>
                            <td>{reportData[0]?.quantity}</td>
                          </tr>

                          <tr>
                            <td style={{minWidth:"125px"}} class="bold">Driver Phone No</td>
                            <td>: </td>
                            <td style={{width:"300px"}}>{reportData[0]?.telFaxEmail}</td>

                            <td style={{verticalAlign:"text-top"}} class="bold">Operator Name</td>
                            <td style={{verticalAlign:"text-top"}}>: </td>
                            <td style={{verticalAlign:"text-top"}}>{reportData[0]?.operatorName}</td>
                          </tr>                                          */}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default BulkDetails;
