/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../_helper/_select";
import { useParams } from "react-router-dom";
import { getItemList_api, getRefferenceCode_api } from "../helper";

const validationSchema = Yup.object().shape({});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  remover,
  setter,
  profileData,
  selectedBusinessUnit,
  location,
  referrenceCodeDDL,
  setRefferenceCodeDDL,
  itemDDL,
  setItemDDL,
  receiveFromShopFloorInitData,
}) {
  const { viewId } = useParams();

  return (
    <>
      <Formik
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
            getRefferenceCode_api(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              receiveFromShopFloorInitData?.warehouse?.value,
              setRefferenceCodeDDL
            );
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
            {console.log("Values => ", values)}
            {console.log("RowDto => ", rowDto)}
            <Form>
              <div className="row mt-2">
                <div className="col-lg-12 p-0 m-0">
                  <div className="row global-form py-2 px-0 m-0">
                    <div className="col-lg-3 pb-2">
                      <label>SBU</label>
                      <IInput
                        value={receiveFromShopFloorInitData?.sbu?.label || ""}
                        name="sbuName"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <label>Plant</label>
                      <IInput
                        value={receiveFromShopFloorInitData?.plant?.label || ""}
                        name="plantName"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <label>Warehouse</label>
                      <IInput
                        value={
                          receiveFromShopFloorInitData?.warehouse?.label || ""
                        }
                        name="wareHouseName"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3 pb-2">
                      <label>Transaction Date</label>
                      <IInput
                        value={values?.transactionDate || ""}
                        name="transactionDate"
                        type="date"
                        disabled={viewId}
                        placeholder="Transaction Date"
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <NewSelect
                        name="referenceCode"
                        options={referrenceCodeDDL}
                        value={values?.referenceCode || ""}
                        onChange={(valueOption) => {
                          setFieldValue("item", "");
                          setRowDto([]);
                          setFieldValue("referenceCode", valueOption);
                          getItemList_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            receiveFromShopFloorInitData?.warehouse?.value,
                            valueOption?.value,
                            setItemDDL
                          );
                        }}
                        errors={errors}
                        touched={touched}
                        label="Reference Code"
                        placeholder="Reference Code"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 m-0 p-0">
                  {/* Table Header input */}
                  <div className="row global-form px-0">
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemDDL}
                        value={values?.item}
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Item"
                        placeholder="Item"
                        isDisabled={!values?.referenceCode || values?.checkbox}
                      />
                    </div>
                    {!values?.item?.value && (
                      <div className="col-lg-1 d-flex align-items-center ">
                        <label className="pr-1 mt-4">All Item</label>
                        <input
                          style={{ marginTop: "18px" }}
                          value={values?.checkbox}
                          name="checkbox"
                          checked={values?.checkbox}
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue("checkbox", e.target.checked);
                            setRowDto([]);
                            setFieldValue("qty", "");
                          }}
                          disabled={viewId}
                        />
                      </div>
                    )}

                    <div className="col-lg-1 mt-1">
                      <button
                        type="button"
                        // disabled={
                        //   (!values?.checkbox && !values?.item) ||
                        //   (!values?.checkbox && !values?.qty) ||
                        //   viewId
                        // }
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          setter(values);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className={"table global-table mt-0"}>
                          <thead className={rowDto?.length < 1 && "d-none"}>
                            <tr>
                              <th style={{ width: "20px" }}>SL</th>
                              <th style={{ width: "100px" }}>Item code</th>
                              <th style={{ width: "150px" }}>Item Name</th>
                              <th style={{ width: "100px" }}>UoM</th>
                              <th style={{ width: "100px" }}>Transfer Qty</th>
                              <th style={{ width: "180px" }}>Location</th>
                              <th style={{ width: "100px" }}>Bin Number</th>
                              <th style={{ width: "100px" }}>Receive Qty</th>
                              <th style={{ width: "50px" }}>Actions</th>
                            </tr>
                          </thead>
                          {console.log(rowDto, "rowDto")}
                          {rowDto?.length > 0 && (
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="text-left pl-2">
                                      {item?.item?.itemCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.item?.label
                                        ? item?.item?.label.split("[")[0]
                                        : ""}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left pl-2">
                                      {item?.item?.uom}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.item?.transferQty}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.item?.location}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.item?.binNumber}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.item?.transferQty}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <IDelete remover={remover} id={index} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}

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
