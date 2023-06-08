import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  plantName: Yup.object().shape({
    label: Yup.string().required("Plant Name  is required"),
    value: Yup.string().required("Plant Name  is required"),
  }),
  productionLine: Yup.object().shape({
    label: Yup.string().required("Production Line  is required"),
    value: Yup.string().required("Production Line  is required"),
  }),
  workcenterName: Yup.string().required("Work Center Name is required"),
  workcenterCode: Yup.string().required("Work Center Code is required"),
  workCenterCapacity: Yup.string().required("Work Center Capicity is required"),
  setupTime: Yup.string().required("Setup Time is required"),
  machineTime: Yup.string().required("Machine Time is required"),
  laborQty: Yup.string().required("Labor Quantity is required"),
  laborTime: Yup.string().required("Labor Time is required"),
  laborCost: Yup.string().required("Labor Cost is required"),
  assetId: Yup.string().required("Asset Id is required"),
  employeeId: Yup.string().required("Employee Id is required"),
});

export default function _Form({
  initData,
  singleRowData,
  productionLineDDL,
  plantDDL,
  shopfloorDDL,
  employeeId,
  assetDDL,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  onChangeForItem,
  onChangeForAssetId,
  itemNameDDL,
  isEdit,
}) {
  const [rowDto, setRowDto] = React.useState([]);
  React.useEffect(() => {
    if (isEdit) {
      setRowDto(singleRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleRowData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => {
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
            {disableHandler(!isValid)}
            <div className="global-form">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plantName"
                      options={plantDDL}
                      value={values?.plantName}
                      label="Plant Name"
                      onChange={(valueOption) => {
                        onChangeForItem(valueOption);
                        onChangeForAssetId(valueOption);
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
                      name="productionLine"
                      options={productionLineDDL}
                      value={values?.productionLine}
                      label="Production Line"
                      onChange={(valueOption) => {
                        setFieldValue("productionLine", valueOption);
                      }}
                      placeholder="Production Line"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.workcenterName}
                      label="Work Center Name"
                      name="workcenterName"
                      type="text"
                      placeholder="Work Center Name"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.workcenterCode}
                      label="Work Center Code"
                      name="workcenterCode"
                      type="text"
                      placeholder="Work Center Code"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.workCenterCapacity}
                      label="Work Center Capacity"
                      name="workCenterCapicity"
                      type="text"
                      placeholder="Work Center Capacity"
                      disabled={isEdit}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.setupTime}
                      label="Setup Time"
                      name="setupTime"
                      type="text"
                      placeholder="Setup Time"
                      disabled={isEdit}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                  <InputField
                    value={values?.machineTime}
                    label="Machine Time"
                    name="machineTime"
                    type="text"
                    placeholder="Machine Time"
                    disabled={isEdit}
                  />
                </div> */}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.laborQty}
                      label="Labor Qty"
                      name="laborQty"
                      type="text"
                      placeholder="Labor Qty"
                      disabled={isEdit}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                  <InputField
                    value={values?.laborTime}
                    label="Labor Time"
                    name="laborTime"
                    type="text"
                    placeholder="Labor TIme"
                    disabled={isEdit}
                  />
                </div> */}
                  {/* <div className="col-lg-3">
                  <InputField
                    value={values?.laborCost}
                    label="Labor Cost"
                    name="laborCost"
                    type="text"
                    placeholder="Labor Cost"
                    disabled={isEdit}
                  />
                </div> */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="assetId"
                      options={assetDDL}
                      value={values?.assetId}
                      label="Asset Id"
                      onChange={(valueOption) => {
                        setFieldValue("assetId", valueOption);
                      }}
                      placeholder="Asset Id"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="employeeId"
                      options={employeeId}
                      value={values?.employeeId}
                      label="Employee Id"
                      onChange={(valueOption) => {
                        setFieldValue("employeeId", valueOption);
                      }}
                      placeholder="Employee Id"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shopFloorId"
                      options={shopfloorDDL}
                      value={values?.shopFloorId}
                      label="Shopfloor"
                      onChange={(valueOption) => {
                        setFieldValue("shopFloorId", valueOption);
                      }}
                      placeholder="Shopfloor"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
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
            </div>
            <div className="row">
              <div className="col-lg-12">
                {rowDto?.length > 0 && (
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Item Name</th>
                        <th>Uom</th>
                        {/* <th>Item Code</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map(
                        (itm, index) =>
                          itm?.itemName.length > 0 && (
                            <tr key={index}>
                              <td className="text-center">{itm?.sl}</td>
                              <td className="text-center">{itm?.itemName}</td>
                              <td className="text-center">{itm?.UomName}</td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
