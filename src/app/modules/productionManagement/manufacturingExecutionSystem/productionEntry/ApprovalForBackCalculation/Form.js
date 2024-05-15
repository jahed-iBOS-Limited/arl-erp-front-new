/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
// import CreateTableRow from "../Table/CreateTableRow";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../_helper/_input";
import { getWarehouseDDL } from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  plantNameDDL,
  productionOrderDDL,
  shiftDDL,
  rowData,
  setRowData,
  dataHandler,
  sbuDDL,
  singleBackCalculationData,
  profileData,
  selectedBusinessUnit,
  getSingleDataForLocation,
  productionId,
  locationLoading,
}) {
  const [wareHouseDDL, setWareHouseDDL] = useState([]);
  const [costCenterDDL, getCostCenterDDL, , setCostCenterDDL] = useAxiosGet();
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();

  const deleteHandler = (id) => {
    const deleteData = rowData.filter((data, index) => id !== index);
    setRowData(deleteData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {locationLoading && <Loading />}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="plantName"
                    options={plantNameDDL}
                    value={values?.plantName ? values?.plantName : ""}
                    onChange={(valueOption) => {
                      setFieldValue("plantName", valueOption);
                    }}
                    placeholder="Plant Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    label="Production Entry Code"
                    type="text"
                    name="productionEntryCode"
                    placeholder="Production Entry Code"
                    value={singleBackCalculationData?.header?.productionCode}
                    disabled
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="dteProductionDate"
                    value={
                      values?.dteProductionDate
                        ? _dateFormatter(values?.dteProductionDate)
                        : ""
                    }
                    label="Receive Date"
                    placeholder=""
                    type="date"
                    disabled={isEdit}
                  />
                         
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Shift"
                    options={shiftDDL}
                    value={values?.shift ? values.shift : ""}
                    onChange={(valueOption) => {
                      setFieldValue("shift", valueOption);
                    }}
                    placeholder="Shift"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                           
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="itemName"
                    value={initData?.itemName}
                    label="Item Name"
                    placeholder="Item Name"
                    type="text"
                    disabled={true}
                  />
                           
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL}
                    value={values?.sbu}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("sbu", valueOption);
                        // setFieldValue('costCenter', '');
                        getWarehouseDDL(
                          profileData?.userId,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.plantName?.value,
                          valueOption?.value,
                          setWareHouseDDL
                        );
                        getCostCenterDDL(
                          `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("sbu", "");
                        // setFieldValue('costCenter', '');
                        setCostCenterDDL([]);
                      }
                    }}
                    label="Select SBU"
                    placeholder="Select SBU"
                    errors={errors}
                    touched={touched}
                  />
                       
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="wareHouse"
                    options={wareHouseDDL}
                    value={values?.wareHouse}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("wareHouse", valueOption);
                        getSingleDataForLocation(
                          `/mes/BackCalculation/GetProductionEntryByIdForApprove?productionId=${productionId}&plantId=${values?.plantName?.value}&warehouseId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("wareHouse", "");
                      }
                    }}
                    label="Select Warehouse"
                    placeholder="Select Warehouse"
                    errors={errors}
                    touched={touched}
                  />
                       
                </div>
                {/* <div className="col-lg-3">
                           <NewSelect
                              name="costCenter"
                              options={costCenterDDL || []}
                              value={values?.costCenter}
                              label="Cost Center"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('costCenter', v);
                                    getProfitCenterDDL(
                                       `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${v?.value}&businessUnitId=${selectedBusinessUnit?.value}`,
                                       data => {
                                          if (data?.length) {
                                             setFieldValue(
                                                'profitcenter',
                                                data[0]
                                             );
                                          }
                                       }
                                    );
                                 } else {
                                    setFieldValue('costCenter', '');
                                    setFieldValue('profitcenter', '');
                                    setProfitCenterDDL([]);
                                 }
                              }}
                              placeholder="Cost Center"
                              errors={errors}
                              touched={touched}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="profitcenter"
                              options={profitCenterDDL || []}
                              value={values?.profitcenter}
                              label="Profit Center"
                              onChange={v => {
                                 setFieldValue('profitcenter', v);
                              }}
                              placeholder="Profit Center"
                              errors={errors}
                              touched={touched}
                           />
                        </div> */}
              </div>

              <div className="row">
                <div className="col-lg-12 pr-3 mt-3">
                  <div className="table-responsive">
                    <table className={"table mt-1 bj-table"}>
                      <thead
                      // className={rowDto?.length < 1 && "d-none"}
                      >
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Output Item</th>
                          <th style={{ width: "80px" }}>Output UoM</th>
                          <th style={{ width: "70px" }}>Output Quantity</th>
                          <th style={{ width: "100px" }}>QC Quantity</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="pl-5">{item?.itemName}</td>
                            <td className="pl-5">{item?.uomname}</td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                // onChange={(e) => {
                                //   dataHandler(
                                //     "numQuantity",
                                //     e.target.value,
                                //     index
                                //   );
                                // }}
                                className="form-control"
                                type="number"
                                min="0"
                                name="numQuantity"
                                defaultValue={item?.numQuantity}
                                disabled={true}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                onChange={(e) => {
                                  dataHandler(
                                    "approvedQuantity",
                                    Math.abs(e.target.value),
                                    index
                                  );
                                }}
                                step={"any"}
                                min="0"
                                className="form-control"
                                type="number"
                                name="approvedQuantity"
                                defaultValue={item?.approvedQuantity}
                              />
                            </td>
                            <td className="text-center pb-0">
                              <span onClick={() => deleteHandler(index)}>
                                <IDelete />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onClick={() => handleSubmit}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <br />
          </>
        )}
      </Formik>
    </>
  );
}
