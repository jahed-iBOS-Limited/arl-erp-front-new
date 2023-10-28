import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

export default function BackCalculationModal({ values, setFieldValue }) {
  const [rowData, setRowData] = useState([]);
  const [, getBomDetails, bomDetailsLoad] = useAxiosGet();
  const [, getStockQtyList, stockQtyListLoad] = useAxiosPost();
  // const [sumValue, setSumValue] = useState({});
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const bomId = values?.productionOrder?.bomId;
  const wareHouseId = values?.shopFloor?.wearHouseId;
  const goodQty = values?.goodQty;
  const getSum = (rowData) => {
    if (rowData?.length > 0) {
      // let qtySum = 0;
      // let rateSum = 0;
      let totalRateSum = 0;
      rowData.forEach((item) => {
        // qtySum += item?.quantity;
        // rateSum += item?.numStockRateByDate;
        totalRateSum += item?.totalRate;
      });
      setFieldValue("totalAmount", totalRateSum.toFixed(2));
    }
  };

  const totalRate = (item) => {
    const totalRate = +(
      (item?.lotSize / item?.quantity) *
      goodQty *
      item?.numStockRateByDate
    ).toFixed(2);
    return totalRate;
  };

  useEffect(() => {
    getBomDetails(
      `/mes/BOM/GetBoMDetailsByBoMId?billOfMaterialId=${bomId}`,
      (bomData) => {
        const payload = bomData?.map((item) => {
          return {
            businessUnitId: buId,
            wareHouseId: wareHouseId,
            itemId: item.itemId,
          };
        });
        getStockQtyList(
          `/mes/ProductionEntry/GetRuningStockAndQuantityList`,
          payload,
          (data) => {
            const newData = bomData.map((item) => {
              const findObject = data.find((i) => i.itemId === item.itemId);
              return {
                ...item,
                numStockRateByDate: findObject.numStockRateByDate,
                numStockByDate: findObject.numStockByDate,
                totalRate: totalRate({ ...item, ...findObject }),
                requireQty : +((item?.lotSize / item?.quantity) * goodQty).toFixed()
              };
            });
            setRowData(newData);
            getSum(newData);
          }
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bomId]);

  return (
    <>
      {(bomDetailsLoad || stockQtyListLoad) && <Loading />}
      <div className="row">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
          <thead>
            <th>Sl</th>
            <th>Item Name</th>
            <th>UOM Name</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total Rate</th>
          </thead>
          <tbody>
            {rowData?.length > 0 &&
              rowData?.map((item, index) => (
                <tr key={Math.random() * Math.random() * 100}>
                  <td>{index + 1}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.uomName}</td>
                  <td>
                    {/* <InputField value={} /> */}
                    {+((item?.lotSize / item?.quantity) * goodQty).toFixed()}
                  </td>
                  <td>
                    <InputField
                      value={item?.numStockRateByDate}
                      min="0"
                      onChange={(e) => {
                        const data = [...rowData];
                        data[index]["numStockRateByDate"] = +e?.target?.value;
                        setRowData(data);
                        // totalRate(item);
                        // getSum();
                      }}
                    />
                  </td>
                  <td>{item?.totalRate}</td>
                </tr>
              ))}
            <tr>
              <td className="text-center" colSpan={3}>
                Total Amount
              </td>
              <td></td>
              <td></td>
              <td>{values?.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
