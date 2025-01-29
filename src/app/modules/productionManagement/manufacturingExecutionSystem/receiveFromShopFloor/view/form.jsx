/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

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
  itemDDL,
  setItemDDL,
  receiveFromShopFloorInitData,
}) {
  return (
    <>
      <Formik
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
                        value={_dateFormatter(initData?.transactionDate)}
                        name="transactionDate"
                        type="date"
                        placeholder="Transaction Date"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <NewSelect
                        name="referenceCode"
                        options={[]}
                        value={initData?.referenceCode}
                        errors={errors}
                        touched={touched}
                        label="Reference Code"
                        placeholder="Reference Code"
                        isDisabled={true}
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
                        options={[]}
                        value={initData?.item}
                        errors={errors}
                        touched={touched}
                        label="Item"
                        placeholder="Item"
                        isDisabled={true}
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
                          disabled={true}
                        />
                      </div>
                    )}
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
                              <th style={{ width: "150px" }}>Item Name</th>
                              <th style={{ width: "100px" }}>UoM</th>
                              <th style={{ width: "100px" }}>Transfer Qty</th>
                              <th style={{ width: "180px" }}>Location</th>
                              <th style={{ width: "100px" }}>Bin Number</th>
                              <th style={{ width: "100px" }}>Receive Qty</th>
                            </tr>
                          </thead>
                          {rowDto?.length > 0 && (
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="text-center">
                                      {item?.itemName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left pl-2">
                                      {item?.uoMname}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.transactionQuantity}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.inventoryLocationName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.binNo}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.transactionQuantity}
                                    </div>
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
