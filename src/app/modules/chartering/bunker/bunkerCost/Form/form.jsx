import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import {
  getBunkerPurchaseList,
  getConsumption,
  validationSchema,
} from "../helper";
import { toast } from "react-toastify";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { getVoyageDDLNew } from "../../../helper";
import ICustomTable from "../../../_chartinghelper/_customTable";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  rowDtoHandler,
  voyageDDL,
  setVoyageDDL,
  setLoading,
  consumption,
  setConsumption,
  consumptionHeader,
  setBunkerPurchaseList,
  bunkerPurchaseList,
  selectedBusinessUnit,
  profileData,
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
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
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
                        setVoyageDDL([]);
                        setBunkerPurchaseList([]);
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 2,
                            voyageTypeId: 0,
                          });
                        }
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);
                        setBunkerPurchaseList([]);
                        if (valueOption) {
                          getConsumption(
                            values?.vesselName?.value,
                            valueOption?.value,
                            setLoading,
                            setConsumption
                          );
                          getBunkerPurchaseList(
                            selectedBusinessUnit?.value,
                            values?.vesselName?.value,
                            setLoading,
                            setBunkerPurchaseList
                          );
                        } else {
                        }
                      }}
                      isDisabled={!values?.vesselName || viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              <h6 className="font-weight-bold mt-3 mb-0">Consumption</h6>
              <div className="row">
                <div className="col-lg-3">
                  <ICustomTable ths={consumptionHeader}>
                    <tr>
                      <td className="text-center">1</td>
                      <td>LSMGO</td>
                      <td className="text-right">
                        {consumption?.consumptionLsmgoqty}
                      </td>
                      <td className="text-right">
                        {Number(
                          bunkerPurchaseList
                            ?.filter((e) => e?.itemId === 1)
                            ?.reduce((a, b) => a + Number(b?.consumption), 0)
                            ?.toFixed(2)
                        ) || ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">2</td>
                      <td>LSFO-1</td>
                      <td className="text-right">
                        {consumption?.consumptionLsfo1qty}
                      </td>
                      <td className="text-right">
                        {Number(
                          bunkerPurchaseList
                            ?.filter((e) => e?.itemId === 2)
                            ?.reduce((a, b) => a + Number(b?.consumption), 0)
                            ?.toFixed(2)
                        ) || ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">3</td>
                      <td>LSFO-2</td>
                      <td className="text-right">
                        {consumption?.consumptionLsfo2qty}
                      </td>
                      <td className="text-right">
                        {Number(
                          bunkerPurchaseList
                            ?.filter((e) => e?.itemId === 3)
                            ?.reduce((a, b) => a + Number(b?.consumption), 0)
                            ?.toFixed(2)
                        ) || ""}
                      </td>
                    </tr>
                  </ICustomTable>
                </div>
              </div>

              <ICustomTable
                ths={[
                  { name: "SL" },
                  { name: "Item Name" },
                  { name: "Purchase Date" },
                  { name: "Purchase Place" },
                  { name: "Purchase Qty" },
                  { name: "Remaining Consumption Qty" },
                  viewType !== "view" && { name: "Remaining Qty" },
                  { name: "Item Rate" },
                  { name: "Consumption" },
                  { name: "Cost" },
                ]}
              >
                {bunkerPurchaseList?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.itemName}</td>
                    <td>{_dateFormatter(item?.dtePurchaseDate)}</td>
                    <td>{item?.purchasePortName || ""}</td>
                    <td className="text-right">{item?.itemQty}</td>
                    <td className="text-right">
                      {item?.remaining || item?.remainingQuantity}
                    </td>
                    {viewType !== "view" && (
                      <td className="text-right">{item?.remainingQty}</td>
                    )}
                    <td className="text-right">{item?.itemRate}</td>
                    <td style={{ minWidth: "120px", maxWidth: "120px" }}>
                      <FormikInput
                        value={item?.consumption}
                        name="consumption"
                        placeholder="Consumption"
                        type="number"
                        onChange={(e) => {
                          rowDtoHandler("consumption", e?.target?.value, index);
                        }}
                        onBlur={(e) => {
                          if (e?.target?.value > item?.remaining) {
                            toast.warn(
                              "Consumption can not be greater than remaining quantity"
                            );
                            // rowDtoHandler("consumption", "", index);
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </td>
                    <td className="text-right">{item?.itemCost}</td>
                  </tr>
                ))}
                {bunkerPurchaseList?.length > 0 && (
                  <tr className="font-weight-bold">
                    <td
                      colSpan={viewType === "view" ? 8 : 9}
                      className="text-right font-weight-bold"
                    >
                      Total Bunker Cost
                    </td>
                    <td className="text-right">
                      {bunkerPurchaseList
                        ?.reduce((acc, curr) => acc + curr?.itemCost, 0)
                        ?.toFixed(2)}
                    </td>
                  </tr>
                )}
              </ICustomTable>
              {/* )} */}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
