import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
// import CreateTableRow from "../Table/CreateTableRow";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

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
}) {
  const [wareHouseDDL, getwareHouseDDL] = useAxiosGet();
  const profileData = useSelector(
    (state) => state?.authData?.profileData,
    shallowEqual
  );
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (initData?.plantName?.value) {
      getwareHouseDDL(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${initData?.plantName?.value}&OrgUnitTypeId=8`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData, profileData, selectedBusinessUnit]);

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
                  <NewSelect
                    name="productionOrder"
                    options={productionOrderDDL}
                    value={
                      values?.productionOrder ? values?.productionOrder : ""
                    }
                    onChange={(valueOption) => {
                      setFieldValue("productionOrder", valueOption);
                    }}
                    placeholder="Production Order"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
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
                    value={initData.itemName}
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
                      setFieldValue("sbu", valueOption);
                    }}
                    label="Select SBU"
                    placeholder="Select SBU"
                    errors={errors}
                    touched={touched}
                  />

                </div>
                {selectedBusinessUnit?.value !== 8 ? (
                  <div className="col-lg-3">
                    <NewSelect
                      name="wareHouse"
                      options={wareHouseDDL || []}
                      value={values?.wareHouse}
                      onChange={(valueOption) => {
                        setFieldValue("wareHouse", valueOption);
                      }}
                      label="Select Warehouse"
                      placeholder="Select Warehouse"
                      errors={errors}
                      touched={touched}
                    />

                  </div>
                ) : null}
              </div>

              <div className="row">
                <div className="col-lg-12 pr-3 mt-3">
                  <div className="table-responsive">
                    <table className={"table mt-1 bj-table"}>
                      <thead
                      // className={rowDto?.length < 1 && "d-none"}
                      >
                        <tr>
                          {/* <th style={{ width: "20px" }}>SL</th> */}
                          <th style={{ width: "50px" }}>Item Code</th>
                          <th style={{ width: "120px" }}>Output Item</th>
                          <th style={{ width: "50px" }}>UoM</th>
                          <th style={{ width: "100px" }}>Output Quantity</th>
                          <th style={{ width: "50px" }}>QC Quantity</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>
                              {item?.strItemCode}
                            </td>
                            <td className="pl-2">{item?.itemName}</td>
                            <td className="pl-2">{item?.strUomName}</td>
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
                                disabled
                              />
                            </td>
                            <td className="text-center pb-0">
                              {/* <span onClick={() => deleteHandler(index)}>
                              <IDelete />
                            </span> */}
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
