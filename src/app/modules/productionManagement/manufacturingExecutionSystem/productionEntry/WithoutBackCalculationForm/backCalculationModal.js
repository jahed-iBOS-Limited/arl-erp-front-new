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

  const calculateTotalExpence = () => {
    const { lotSize, billOfExpense } = rowData?.[0] || {};
    return (billOfExpense / lotSize) * goodQty;
  };

  useEffect(() => {
    getBomDetails(
      `/mes/BOM/GetItemDtailsByProductionOrderId?productionOrderId=${productionOrderId}`,
      (bomData) => {
        const payload = bomData?.map((item) => ({
          businessUnitId: buId,
          wareHouseId: wareHouseId,
          itemId: item?.itemId,
        }));
        getStockQtyList(
          `/mes/ProductionEntry/GetRuningStockAndQuantityList`,
          payload,
          (data) => {
            const newData = bomData?.map((item) => {
              const targetItem = data.find(
                (itm) => itm?.itemId === item?.itemId
              );
              return {
                ...item,
                numStockRateByDate: targetItem?.numStockRateByDate,
                numStockByDate: targetItem?.numStockByDate,
                requiredQuantity:
                  ((item?.quantity / item?.lotSize) * goodQty)?.toFixed(4) || 0,
              };
            });
            setRowData(newData);
          }
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productionOrderId, wareHouseId, goodQty]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
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
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Item Name</th>
                      <th>UOM Name</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Value</th>
                      <th>Rest Qty</th>
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
                              max={item?.numIssueQuantity}
                              onChange={(e) => {
                                if (+e.target.value > item.numIssueQuantity) {
                                  return toast.warn(
                                    `Qty cann't be greater than ${item.numIssueQuantity}`
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
                              item?.requiredQuantity * item?.numStockRateByDate
                            )}
                          </td>
                          <td className="text-right">
                            <strong
                              className={
                                (+item?.numIssueQuantity || 0) -
                                  (+item?.requiredQuantity || 0) >
                                0
                                  ? "text-warning"
                                  : ""
                              }
                            >
                              {(+item?.numIssueQuantity || 0) -
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
