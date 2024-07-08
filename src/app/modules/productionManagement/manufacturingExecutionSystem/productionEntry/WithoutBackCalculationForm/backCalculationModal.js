import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { Form, Formik } from "formik";
import IForm from "../../../../_helper/_form";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { toast } from "react-toastify";

export default function BackCalculationModal({
  values,
  setFieldValue,
  setIsShowModal,
  rowData,
  setRowData,
}) {
  const [objProps, setObjprops] = useState({});
  const [, getBomDetails, bomDetailsLoader] = useAxiosGet();
  const [, getStockQtyList, stockQtyListLoader] = useAxiosPost();
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const productionOrderId = values?.productionOrder?.value;
  const wareHouseId = values?.shopFloor?.wearHouseId;
  const goodQty = values?.goodQty;

  // calculate total value on required quantity change
  const calculateTotalValue = rowData?.reduce((prevValue, currenctItem) => {
    return (
      prevValue +
      currenctItem?.requiredQuantity * currenctItem?.numStockRateByDate
    );
  }, 0);
console.log("calculateTotalValue", calculateTotalValue)
  const calculateTotalExpence = () => {
    const { lotSize, billOfExpense } = rowData?.[0] || {};
    return (billOfExpense / lotSize) * goodQty;
  };

  useEffect(() => {
    getBomDetails(
      `https://192.168.3.93:45456/mes/BOM/GetItemDtailsByProductionOrderId?productionOrderId=${productionOrderId}`,
      (bomData) => {
        const payload = bomData?.map((item) => ({
          businessUnitId: buId,
          wareHouseId: item?.warehouseId,
          itemId: item?.itemId,
          plantId: item?.plantId,
          dteStockDate: values?.dteProductionDate,
        }));
        getStockQtyList(
          `/mes/ProductionEntry/StockQtyRateByWarehouseAndDate`,
          payload,
          (data) => {
            const newData = bomData?.map((item) => {
              const targetItem = data.find(
                (itm) => itm?.itemId === item?.itemId
              );

              let calculatedRequiredQuantity =
                ((item?.quantity / item?.lotSize) * goodQty)?.toFixed(4) || 0;

              return {
                ...item,
                numStockRateByDate: item?.numAverageRate,
                numStockByDate: targetItem?.numStockByDate,
                requiredQuantity:
                  values?.isLastProduction &&
                  calculatedRequiredQuantity > item?.numApprovedQuantity
                    ? item?.numApprovedQuantity
                    : calculatedRequiredQuantity,

                // requiredQuantity:(()=>{
                //   let reqQty =  ((item?.quantity / item?.lotSize) * goodQty)?.toFixed(4) || 0;
                //   let lotSize = item?.numLotSize;
                //   let lotNumber = Math.ceil(reqQty / lotSize);
                //   return lotSize * lotNumber ;

                // })()
              };
            });
            setRowData(newData);
          }
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productionOrderId, wareHouseId, goodQty, values?.dteProductionDate]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={({ setSubmitting, resetForm }) => {
        if (values?.isLastProduction) {
          IConfirmModal({
            // title: `Purchase Request`,
            message: `Are you sure about returning the remaining quantity of the product?`,
            yesAlertFunc: () => {
              if (values?.isLastProduction) {
                setFieldValue("materialCost", calculateTotalValue);
                setFieldValue("overheadCost", calculateTotalExpence());
                setIsShowModal(false);
              }
            },
            noAlertFunc: () => {},
          });
        } else {
          console.log("calculateTotalValue2", calculateTotalValue)
          setFieldValue("materialCost", calculateTotalValue);
          setFieldValue("overheadCost", calculateTotalExpence());
          setIsShowModal(false);
        }
      }}
    >
      {({ handleSubmit }) => (
        <>
          {(bomDetailsLoader || stockQtyListLoader) && <Loading />}
          <IForm
            title={"BOM Calculation"}
            getProps={setObjprops}
            isHiddenReset
            isHiddenBack
            submitBtnText="Add"
          >
            <Form>
              <div className="row">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Item Name</th>
                        <th>UOM Name</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Value</th>
                        <th>
                          {values?.isLastProduction ? "Return Qty" : "Rest Qty"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => (
                          <tr key={item?.itemId}>
                            <td>{index + 1}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.uomName}</td>
                            <td>
                              <InputField
                                name="requiredQuantity"
                                type="number"
                                value={item?.requiredQuantity}
                                max={item?.numApprovedQuantity}
                                onChange={(e) => {
                                  if (
                                    +e.target.value > item.numApprovedQuantity
                                  ) {
                                    return toast.warn(
                                      `Qty cann't be greater than ${item.numApprovedQuantity}`
                                    );
                                  }
                                  let requiredQuantity = e?.target?.value;
                                  requiredQuantity =
                                    requiredQuantity < 0
                                      ? Math?.abs(requiredQuantity)
                                      : requiredQuantity;

                                  setRowData((prev) => {
                                    const newRowData = [...prev];
                                    newRowData[index] = {
                                      ...newRowData?.[index],
                                      requiredQuantity,
                                    };
                                    return newRowData;
                                  });
                                }}
                              />
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numStockRateByDate)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                item?.requiredQuantity *
                                  item?.numStockRateByDate
                              )}
                            </td>
                            <td className="text-right">
                              <strong
                                className={
                                  (+item?.numApprovedQuantity || 0) -
                                    (+item?.requiredQuantity || 0) >=
                                  1
                                    ? "text-warning"
                                    : ""
                                }
                              >
                                {(+item?.numApprovedQuantity || 0) -
                                  (+item?.requiredQuantity || 0)}
                              </strong>
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td className="text-center" colSpan={3}>
                          Total Material Cost
                        </td>
                        <td></td>
                        <td></td>
                        <td className="text-right">
                          {_formatMoney(calculateTotalValue)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center" colSpan={3}>
                          Total Overhead Cost
                        </td>
                        <td></td>
                        <td></td>
                        <td className="text-right">
                          {_formatMoney(calculateTotalExpence())}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center" colSpan={3}>
                          Total Cost
                        </td>
                        <td></td>
                        <td></td>
                        <td className="text-right">
                          {_formatMoney(
                            calculateTotalValue + calculateTotalExpence()
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
