import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { validateDigit } from "../../../_helper/validateDigit";
import { _currentTime } from "../../../_helper/_currentTime";
import { IInput } from "../../../_helper/_input";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  driverName: "",
  driverMobileNo: "",
  vehicleNo: "",
};

function GateInByPoModal({
  item,
  setItem,
  setViewType,
  setIsShowModel,
  date,
  getPendingList,
}) {
  const [, saveData, loading] = useAxiosPost();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //name, value, sl, rowDto, setRowDto

  const rowDtoHandler = (key, value, index, dto, setDto) => {
    let data = { ...dto };
    let targetDto = data?.row; // []
    let _sl = targetDto[index]; // target row
    _sl[key] = value;
    setDto(data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gate In By PO"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Key-Register/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.driverName}
                        label="Driver Name"
                        name="driverName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.driverMobileNo}
                        label="Driver Mobile No"
                        name="driverMobileNo"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.vehicleNo}
                        label="Vehicle No"
                        name="vehicleNo"
                        type="text"
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={
                          !item?.row?.length ||
                          !values?.driverName ||
                          !values?.vehicleNo
                        }
                        onClick={() => {
                          saveData(
                            `/mes/MSIL/GateInByPOCreateAndEdit`,
                            {
                              sl: 0,
                              intGateInByPoid: 0,
                              dteDate: item?.dtePurchaseOrderDate,
                              intPonumber: item?.intPurchaseOrderId,
                              strPocode: item?.strPurchaseOrderNo,
                              intSupplierId: item?.intBusinessPartnerId,
                              strSupplierName: item?.strBusinessPartnerName,
                              strDriverName: values?.driverName || "",
                              strDriverMobileNo: values?.driverMobileNo || "",
                              strVehicleNo: values?.vehicleNo || "",
                              tmInTime: _currentTime(),
                              intBusinessUnitId: selectedBusinessUnit?.value,
                              isActive: true,
                              intActionBy: profileData?.userId,
                              dteInsertDate: _todayDate(),
                              strRemarks: "",
                              row: item?.row?.map((data) => ({
                                intRowId: 0,
                                intGateInByPoid: 0,
                                intItemId: data?.intItemId,
                                strItemName: data?.strItemName,
                                intUomid: data?.intUoMid,
                                strUomname: data?.strUoMname,
                                // numQuantity: data?.numOrderQty,
                                numQuantity: data?.receiveQuantity,
                                isActive: true,
                                totalQuantity: data?.totalQuantity,
                              })),
                            },
                            () => {
                              setIsShowModel(false);
                              // setViewType(2);
                              getPendingList(
                                `/mes/MSIL/GetAllGateInByPOInfoByDate?intBusinessUnitId=${selectedBusinessUnit?.value}&date=${date}`
                              );
                            },
                            true
                          );
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Item Name</th>
                            <th>PO Quantity</th>
                            <th>Total Receive Qty</th>
                            <th style={{ width: "150px" }}>Receive Qty</th>
                            <th>Uom</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item?.row?.length > 0 &&
                            item?.row?.map((itm, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{itm?.strItemName}</td>
                                <td className="text-center">
                                  {itm?.numOrderQty}
                                </td>
                                <td>{itm?.totalQuantity}</td>
                                <td>
                                  <IInput
                                    value={itm?.receiveQuantity}
                                    name="receiveQuantity"
                                    type="tel"
                                    min="0"
                                    onChange={(e) => {
                                      const validNum = validateDigit(
                                        e.target.value
                                      );
                                      rowDtoHandler(
                                        "receiveQuantity",
                                        validNum,
                                        index,
                                        item,
                                        setItem
                                      );
                                    }}
                                  />
                                </td>
                                <td>{itm?.strUoMname}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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

export default GateInByPoModal;
