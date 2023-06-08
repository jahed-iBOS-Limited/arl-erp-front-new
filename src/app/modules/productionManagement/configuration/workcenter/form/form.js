import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
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
  shopFloorId: Yup.object().shape({
    label: Yup.string().required("Shop Floor is required"),
    value: Yup.string().required("Shop Floor  is required"),
  }),
  workcenterName: Yup.string().required("Work Center Name is required"),
  workcenterCode: Yup.string().required("Work Center Code is required"),
});

export default function _Form({
  initData,
  singleRowData,
  productionLineDDL,
  plantDDL,
  shopfloorDDL,
  employeeId,
  assetDDL,
  uomDDL,
  btnRef,
  saveHandler,
  resetBtnRef,
  onChangeForItem,
  itemNameDDL,
  isEdit,
  onChangeForShopFloor,
  onChangeForProductionLine,
  onChangeForAssetId,
}) {
  const [rowDto, setRowDto] = React.useState([]);
  React.useEffect(() => {
    if (isEdit) {
      setRowDto(singleRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleRowData]);

  const rowDataAddHandler = (values) => {
    const foundData = rowDto?.filter(
      (item) => values?.itemName?.value === item?.itemId
    );
    if (foundData?.length > 0) {
      return toast.warn("Item Already Exists", {
        toastId: "rowDataAddHandlerForWorkCenter",
      });
    } else {
      setRowDto([
        ...rowDto,
        {
          configId: 0,
          itemId: values?.itemName?.value,
          itemName: values?.itemName?.label,
          itemCode: values?.itemCode,
          UomName: values?.UomName,
          UomId: values?.UomId,
        },
      ]);
    }
  };

  const removeHandler = (index) => {
    let newRowData = rowDto.filter((item, i) => index !== i);
    setRowDto(newRowData);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => {
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
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plantName"
                    options={plantDDL}
                    value={values?.plantName}
                    label="Plant Name"
                    onChange={(valueOption) => {
                      onChangeForItem(valueOption);
                      onChangeForShopFloor(valueOption);
                      onChangeForAssetId(valueOption);
                      setFieldValue("plantName", valueOption);
                      setFieldValue("itemName", "");
                      setFieldValue("shopFloorId", "");
                      setFieldValue("assetId", "");
                      setFieldValue("itemName", "");
                      // setFieldValue("productionLine", "");
                    }}
                    placeholder="Plant Name"
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
                    label="Shop Floor"
                    onChange={(valueOption) => {
                      onChangeForProductionLine(valueOption);
                      setFieldValue("shopFloorId", valueOption);
                      setFieldValue("productionLine", "");
                    }}
                    placeholder="Shop Floor"
                    errors={errors}
                    touched={touched}
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
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.workcenterName}
                    label="Work Center Name"
                    name="workcenterName"
                    type="text"
                    placeholder="Work Center Name"
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
                    label="Work Center Capacity [Per Hour]"
                    name="workCenterCapacity"
                    type="number"
                    placeholder="Work Center Capacity"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("workCenterCapacity", e.target.value);
                      } else {
                        setFieldValue("workCenterCapacity", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.setupTime}
                    label="Setup Time[Per Min]"
                    name="setupTime"
                    type="number"
                    placeholder="Setup Time"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("setupTime", e.target.value);
                      }
                      // else {
                      //   setFieldValue("setupTime", "");
                      // }
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.machineTime}
                    label="Machine Time[Min]"
                    name="machineTime"
                    type="number"
                    placeholder="Machine Time"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("machineTime", e.target.value);
                        if (values?.laborQty) {
                          const labourTime = e.target.value * values?.laborQty;
                          setFieldValue("laborTime", labourTime);
                        }
                      } else {
                        setFieldValue("machineTime", "");
                      }
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.laborQty}
                    label="Number Of Labor"
                    name="laborQty"
                    type="number"
                    placeholder="Labor Qty"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("laborQty", e.target.value);
                        if (values?.machineTime) {
                          const labourTime =
                            e.target.value * values?.machineTime;
                          setFieldValue("laborTime", labourTime);
                        }
                      } else {
                        setFieldValue("laborQty", "");
                      }
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <label>Labor Time</label>
                  <InputField
                    value={values.laborTime}
                    name="laborTime"
                    type="number"
                    placeholder="Labor TIme"
                    disabled={true}
                  />
                </div> */}
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.laborCost}
                    label="Labor Cost"
                    name="laborCost"
                    type="number"
                    placeholder="Labor Cost"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("laborCost", e.target.value);
                      } else {
                        setFieldValue("laborCost", "");
                      }
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="assetId"
                    options={assetDDL}
                    value={values?.assetId}
                    label="Asset"
                    onChange={(valueOption) => {
                      onChangeForAssetId(valueOption);
                      setFieldValue("assetId", valueOption);
                    }}
                    placeholder="Asset Id"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="employeeId"
                    options={employeeId}
                    value={values?.employeeId}
                    label="Employee"
                    onChange={(valueOption) => {
                      setFieldValue("employeeId", valueOption);
                    }}
                    placeholder="Employee Id"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12 mt-6">
                  <p
                    className="font-weight-bold"
                    style={{ marginBottom: "0", fontSize: "15px" }}
                  >
                    Add Item
                  </p>
                </div>
                <div className="col-lg-3 mt-0">
                  <NewSelect
                    name="itemName"
                    options={itemNameDDL}
                    value={values?.itemName}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                      setFieldValue("itemCode", valueOption?.code);
                      setFieldValue("rowItemUOM", {
                        value: valueOption?.baseUomid,
                        label: valueOption?.baseUomName,
                      });
                    }}
                    placeholder="Item Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isDisabled={true}
                    name="rowItemUOM"
                    options={uomDDL || []}
                    value={values?.rowItemUOM}
                    label="UoM Name"
                    onChange={(valueOption) => {
                      setFieldValue("rowItemUOM", valueOption);
                    }}
                    placeholder="UoM Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.itemCode}
                    label="Item Code"
                    name="itemCode"
                    type="text"
                    placeholder="Item Code"
                    disabled={true}
                  />
                </div> */}
                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      rowDataAddHandler({
                        itemName: values?.itemName,
                        itemCode: values?.itemCode,
                        UomId: values?.itemName?.baseUomid,
                        UomName: values?.itemName?.baseUomName,
                      });
                      setFieldValue("itemCode", "");
                      setFieldValue("itemName", "");
                      setFieldValue("rowItemUOM", "");
                    }}
                    className="btn btn-primary ml-2 mt-7"
                    type="button"
                    disabled={!values?.itemName}
                  >
                    Add
                  </button>
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

            <div className="row">
              <div className="col-lg-12">
                {rowDto?.length > 0 && (
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Item Name</th>
                        {/* <th>Item Code</th> */}
                        <th>Uom</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map(
                        (itm, index) =>
                          itm?.itemName.length > 0 && (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <div className="pl-2">{itm?.itemName}</div>
                              </td>
                              {/* <td className="text-center">{itm?.itemCode}</td> */}
                              <td className="text-center">{itm?.UomName || itm?.uomName}</td>
                              <td
                                className="text-center"
                                onClick={() => removeHandler(index)}
                              >
                                <IDelete id={index} />
                              </td>
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
