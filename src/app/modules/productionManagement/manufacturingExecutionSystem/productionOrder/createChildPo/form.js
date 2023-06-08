/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import NewSelect from "../../../../_helper/_select";
import {
  getPTRNumberDDL,
  getRoutingToBOMDDL,
  getRoutingToWorkCenterDDL,
  createSFGProductionOrder,
  getProductionOrderSFGById,
} from "../helper";
import customStyles from "../../../../selectCustomStyle";
import { useLocation } from "react-router-dom";
// Validation schema for bank transfer
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  gridData,
  setGridData,
  history,
  singleData,
  rowDtoHandler,
  productionOrderSFG,
  productionId,
  plantName,
  subPo,
  paramsId,
}) {
  // grid data from getProductionOrderSFGById
  // single data from landing
  const [valid, setValid] = useState(true);
  const [prtNumber, setPrtNumber] = useState([]);
  const [workCenter, setWorkCenter] = useState([]);
  const [bomName, setBomName] = useState([]);
  const { state } = useLocation();

  // api's
  useEffect(() => {
    if (productionId) {
      getPTRNumberDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        subPo?.plantId,
        setPrtNumber
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, productionId]);

  useEffect(() => {
    getRoutingToWorkCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      gridData[0]?.itemId,
      setWorkCenter
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // const getGrid = () => {
  //   getProductionOrderSFGById(
  //     productionId?.key,
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setGridData
  //   );
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form>
              <div
                className="table-responsive"
                style={{ padding: ".5rem 0", minHeight: "300px" }}
              >
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item (SFG)</th>
                      <th>UOM</th>
                      <th>BOM Qty</th>
                      <th>Start Date </th>
                      <th>Start Time</th>
                      <th>End Date </th>
                      <th>End Time</th>
                      <th>PTR No.</th>
                      <th>Work Center</th>
                      <th>BOM</th>
                      <th>Prod. Order Qty</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.length > 0 &&
                      gridData?.map((item, index) => (
                        <tr>
                          <td className="text-center">
                            <div style={{ width: "30px" }}>{index + 1}</div>
                          </td>
                          <td>
                            <div style={{ width: "120px" }} className="pl-2">
                              {item?.itemName}
                            </div>
                          </td>
                          <td>
                            <div
                              className="text-center"
                              style={{ width: "40px" }}
                            >
                              {item?.uomName}
                            </div>
                          </td>
                          <td>
                            <div
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {/* {item?.orderQty} */}
                              {item?.bomQty}
                            </div>
                          </td>
                          <td>
                            <IInput
                              value={item?.startDate}
                              name="startDate"
                              type="date"
                              onChange={(e) =>
                                rowDtoHandler(
                                  e.target.name,
                                  e.target.value,
                                  index
                                )
                              }
                            />
                          </td>
                          <td>
                            <div className="">
                              <IInput
                                value={item?.startTime}
                                name="startTime"
                                type="time"
                                onChange={(e) =>
                                  rowDtoHandler(
                                    e.target.name,
                                    e.target.value,
                                    index
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div className="">
                              <IInput
                                min={item?.startDate}
                                value={item?.endDate}
                                name="endDate"
                                type="date"
                                onChange={(e) =>
                                  rowDtoHandler(
                                    e.target.name,
                                    e.target.value,
                                    index
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div className="">
                              <IInput
                                value={item?.endTime}
                                name="endTime"
                                type="time"
                                onChange={(e) =>
                                  rowDtoHandler(
                                    e.target.name,
                                    e.target.value,
                                    index
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="sub-po-dropdown">
                            <div style={{ width: "100px" }}>
                              <NewSelect
                                name="prtNumber"
                                options={prtNumber || []}
                                value={item?.prtNumber || ""}
                                onChange={(valueOption) => {
                                  rowDtoHandler(
                                    "prtNumber",
                                    valueOption,
                                    index
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </td>

                          <td className="sub-po-dropdown">
                            <div style={{ width: "100px" }}>
                              <NewSelect
                                name="workCenter"
                                options={
                                  item?.getRoutingToWorkCenterDDL || []
                                  // workCenter
                                }
                                value={item?.workCenter || ""}
                                onChange={(valueOption) => {
                                  // setFieldValue("workCenter", valueOption);
                                  rowDtoHandler(
                                    "workCenter",
                                    valueOption,
                                    index
                                  );

                                  getRoutingToBOMDDL(
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    item?.itemId,
                                    valueOption?.value,
                                    setBomName
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </td>

                          <td className="sub-po-dropdown">
                            <div style={{ width: "100px" }}>
                              <NewSelect
                                name="bomName"
                                options={bomName || []}
                                value={item?.bomName || ""}
                                onChange={(valueOption) => {
                                  setFieldValue("bomName", valueOption);
                                  rowDtoHandler(
                                    "proOrderQty",
                                    item?.orderQty,
                                    index
                                  );
                                  // rowDtoHandler(
                                  //   "proOrderQty",
                                  //   (
                                  //     (item?.orderQty / state?.lotSize) *
                                  //     state?.orderQty
                                  //   ).toFixed(2),
                                  //   index
                                  // );
                                  rowDtoHandler("bomName", valueOption, index);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <IInput
                                style={{ width: "80px" }}
                                value={item?.proOrderQty}
                                name="proOrderQty"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "proOrderQty",
                                    e.target.value,
                                    index,
                                    item
                                  );
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            {!item?.poStatus ? (
                              <div
                                style={{ width: "100px" }}
                                className="d-flex justify-content-around"
                              >
                                <button
                                  onClick={() => {
                                    createSFGProductionOrder(item);
                                    // getGrid();
                                  }}
                                  className="btn btn-primary btn-sm"
                                >
                                  Create PO
                                </button>
                              </div>
                            ) : (
                              <div
                                style={{ width: "100px" }}
                                className="d-flex justify-content-around"
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  disabled
                                >
                                  Create PO
                                </button>
                              </div>
                            )}
                            {/* <div
                              style={{ width: "100px" }}
                              className="d-flex justify-content-around"
                            >
                              <button
                                onClick={() => {
                                  createSFGProductionOrder(item);
                                }}
                                className="btn btn-primary btn-sm"
                              >
                                Create PO
                              </button>
                            </div> */}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
