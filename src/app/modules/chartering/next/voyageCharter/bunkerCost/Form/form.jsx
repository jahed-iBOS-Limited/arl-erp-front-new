import { Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import ICustomTable from "../../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../../_chartinghelper/_dateFormatter";
import {
  getBunkerPurchaseList,
  getConsumption,
  validationSchema,
} from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  rowDtoHandler,
  setLoading,
  consumption,
  setConsumption,
  consumptionHeader,
  setBunkerPurchaseList,
  bunkerPurchaseList,
  selectedBusinessUnit,
}) {
  const history = useHistory();
  const { state: preData } = useLocation();

  useEffect(() => {
    if (preData?.vesselName?.value && preData?.voyageNo?.value) {
      getConsumption(
        preData?.vesselName?.value,
        preData?.voyageNo?.value,
        setLoading,
        setConsumption
      );
      getBunkerPurchaseList(
        selectedBusinessUnit?.value,
        preData?.vesselName?.value,
        setLoading,
        setBunkerPurchaseList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preData?.vesselName?.value, preData?.voyageNo?.value]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          vesselName: preData?.vesselName,
          voyageNo: preData?.voyageNo,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push({
              pathname: `/chartering/layTime/layTime`,
              state: preData,
            });
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
                      history.push({
                        pathname: `/chartering/next/expense`,
                        state: preData,
                      });
                    }}
                    className={"btn btn-danger px-3 py-2"}
                  >
                    Skip
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button> */}
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  <button
                    className="btn btn-success ml-2 px-3 py-2"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save & Next
                  </button>
                </div>
              </div>

              <div className="row pl-3">
                <div className="col-lg-6 form-card-content p-3 shadow-sm rounded">
                  <div className="">
                    <p style={{ fontSize: "15px" }}>
                      <b>Vessel Name & Voyage No: </b>{" "}
                      {values?.vesselName?.label} & V{values?.voyageNo?.label}{" "}
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      <b>Voyage Type: </b> {values?.voyageType?.label}
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      <b>Ship Type: </b> {values?.shipType?.label}
                    </p>
                  </div>
                </div>
                <div className="col-lg-6  pl-3">
                  <h6 className="font-weight-bold mt-3 mb-0">Consumption</h6>
                  <ICustomTable ths={consumptionHeader}>
                    <tr>
                      <td className="text-center">1</td>
                      <td>LSMGO</td>
                      <td className="text-right">
                        {consumption?.consumptionLsmgoqty}
                      </td>
                      <td className="text-right">
                        {bunkerPurchaseList
                          ?.filter((e) => e?.itemId === 1)
                          ?.reduce((a, b) => a + Number(b?.consumption), 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">2</td>
                      <td>LSFO-1</td>
                      <td className="text-right">
                        {consumption?.consumptionLsfo1qty}
                      </td>
                      <td className="text-right">
                        {bunkerPurchaseList
                          ?.filter((e) => e?.itemId === 2)
                          ?.reduce((a, b) => a + Number(b?.consumption), 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">3</td>
                      <td>LSFO-2</td>
                      <td className="text-right">
                        {consumption?.consumptionLsfo2qty}
                      </td>
                      <td className="text-right">
                        {bunkerPurchaseList
                          ?.filter((e) => e?.itemId === 3)
                          ?.reduce((a, b) => a + Number(b?.consumption), 0)}
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
                      {bunkerPurchaseList?.reduce(
                        (acc, curr) => acc + curr?.itemCost,
                        0
                      )}
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
