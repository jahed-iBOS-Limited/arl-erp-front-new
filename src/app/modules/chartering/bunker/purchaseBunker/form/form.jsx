import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import * as Yup from "yup";
import { getVoyageDDLForPurchaseBunker } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import ICustomTable from "../../../_chartinghelper/_customTable";

export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel name is required"),
    value: Yup.string().required("Vessel name is required"),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required("Voyage No is required"),
    value: Yup.string().required("Voyage No is required"),
  }),
  // purchaseFrom: Yup.object().shape({
  //   label: Yup.string().required("Purchase From is required"),
  //   value: Yup.number().required("Purchase From is required"),
  // }),

  item: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
  itemQty: Yup.string().required("Item Qty is required"),
  itemRate: Yup.string().required("Item Rate is required"),
});

/* Row Data Headers */
const headers = [
  { name: "SL" },
  { name: "Item Name" },
  { name: "Item Rate" },
  { name: "Item Qty" },
  { name: "Item Value" },
];

export default function _Form({
  initData,
  saveHandler,
  viewType,
  rowData,
  setRowData,
  vesselDDL,
  setVoyageNoDDL,
  voyageNoDDL,
  setLoading,
  charterPartyDDL,
  supplierDDL,
  portDDL,
}) {
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
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
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{`Purchase Bunker ${viewType || "Create"}`}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setFieldValue("voyageNo", "");
                        setVoyageNoDDL([]);
                        getVoyageDDLForPurchaseBunker(
                          valueOption?.value,
                          setLoading,
                          setVoyageNoDDL
                        );
                      }}
                      isDisabled={viewType || rowData?.length}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);
                      }}
                      isDisabled={
                        viewType || rowData?.length || !values?.vesselName
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <FormikSelect
                      value={values?.purchaseFrom}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "Supplier" },
                        { value: 2, label: "Charterer" },
                      ]}
                      styles={customStyles}
                      name="purchaseFrom"
                      placeholder="Purchase From"
                      label="Purchase From"
                      onChange={(valueOption) => {
                        setFieldValue("supplierName", "");
                        setFieldValue("charterer", "");
                        setFieldValue("supplierPort", "");
                        setFieldValue("purchaseFrom", valueOption);
                      }}
                      isDisabled={viewType || rowData?.length}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {/* {values?.purchaseFrom?.value === 1 && ( */}
                  <>
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.supplierName}
                        isSearchable={true}
                        options={supplierDDL || []}
                        styles={customStyles}
                        name="supplierName"
                        placeholder="Supplier Name"
                        label="Supplier Name"
                        onChange={(valueOption) => {
                          setFieldValue("supplierName", valueOption);
                          // setFieldValue("supplierPort", valueOption?.portName);
                        }}
                        isDisabled={viewType || rowData?.length}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.supplierPort}
                        isSearchable={true}
                        options={portDDL || []}
                        styles={customStyles}
                        name="supplierPort"
                        placeholder="Supplier Port"
                        label="Supplier Port"
                        onChange={(valueOption) => {
                          setFieldValue("supplierPort", valueOption);
                        }}
                        isDisabled={viewType || rowData?.length}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  {/* )} */}
                  {/* {values?.purchaseFrom?.value === 2 && (
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.charterer}
                        isSearchable={true}
                        options={charterPartyDDL || []}
                        styles={customStyles}
                        name="charterer"
                        placeholder="Charterer"
                        label="Charterer"
                        onChange={(valueOption) => {
                          setFieldValue("charterer", valueOption);
                        }}
                        isDisabled={viewType || rowData?.length}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )} */}

                  <div className="col-lg-3">
                    <label>Purchase Date</label>
                    <FormikInput
                      value={values?.purchaseDate}
                      name="purchaseDate"
                      placeholder="Purchase Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType || rowData?.length}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <FormikSelect
                      value={values?.currency}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "USD" },
                        { value: 2, label: "BDT" },
                      ]}
                      styles={customStyles}
                      name="currency"
                      placeholder="Currency"
                      label="Currency"
                      onChange={(valueOption) => {
                        setFieldValue("currency", valueOption);
                      }}
                      isDisabled={viewType || rowData?.length}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {/* {viewType !== "view" && ( */}
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.item}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "LSMGO" },
                        { value: 2, label: "LSFO-1" },
                        { value: 3, label: "LSFO-2" },
                      ]}
                      styles={customStyles}
                      name="item"
                      placeholder="Item"
                      label="Item"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      isDisabled={
                        viewType === "view" ||
                        !values?.supplierName ||
                        !values?.supplierPort
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* )} */}

                  {/* {viewType !== "view" && (
                    <div className="col-lg-3 mt-3">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          addRow(values);
                        }}
                        disabled={
                          !values?.item ||
                          !values?.vesselName ||
                          !values?.voyageNo ||
                          !values?.purchaseDate ||
                          !values?.purchaseFrom ||
                          (values?.purchaseFrom?.label === "Supplier" &&
                            !values?.supplierName) ||
                          (values?.purchaseFrom?.label === "Charter Party" &&
                            !values?.charterParty)
                        }
                      >
                        Add Item
                      </button>
                    </div>
                  )} */}
                  <div className="col-lg-3">
                    <label>Item Qty</label>
                    <FormikInput
                      value={values?.itemQty}
                      name="itemQty"
                      placeholder="Item Quantity"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("itemQty", e.target.value);
                        setFieldValue(
                          "itemValue",
                          Number(e.target.value) * values?.itemRate || 0
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Item Rate</label>
                    <FormikInput
                      value={values?.itemRate}
                      name="itemRate"
                      placeholder="Item Rate"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("itemRate", e.target.value);
                        setFieldValue(
                          "itemValue",
                          Number(e.target.value) * values?.itemQty || 0
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Item Value</label>
                    <FormikInput
                      value={values?.itemValue}
                      name="itemValue"
                      placeholder="Item value"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {rowData?.length > 1 ? (
                <div className="col-lg-6 p-0 m-0">
                  <ICustomTable ths={headers}>
                    {rowData?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.itemName}</td>
                        <td className="text-right">{item?.itemRate}</td>
                        <td className="text-center">{item?.itemQty}</td>
                        <td className="text-right">{item?.itemValue}</td>
                      </tr>
                    ))}
                  </ICustomTable>
                </div>
              ) : null}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
