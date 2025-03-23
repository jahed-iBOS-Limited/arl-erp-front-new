import React, { useEffect, useState, useMemo } from 'react';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import Loading from '../../../_helper/_loading';
import InputField from '../../../_helper/_inputField';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosPut from '../../../_helper/customHooks/useAxiosPut';
import moment from 'moment';

export default function JVModalView({ values, buId, setShowJVModal }) {
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [, saveGridData] = useAxiosPut();
  const [damageChange, setDamageChange] = useState(0);
  const rmscivsrent = 5220;
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getGridData(
      `/mes/MSIL/GetFuelConsumptionMonthEnd?MonthId=${moment(
        values?.fromDate,
      )?.format('M')}&YearId=${moment(values?.toDate).format(
        'YYYY',
      )}&BusinessUnitId=${buId}`,
      (data) => {
        const modifyData = [
          {
            totalFuelQuantity: data,
            rate: 0,
            totalValue: 0,
            particulars: 'Fuel Consumption',
            fuelType: 'Gas',
          },
        ];
        setGridData(modifyData);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grandTotalValue = useMemo(() => {
    if (gridData?.length > 0) {
      return gridData?.reduce(
        (accumulator, item) => accumulator + (item?.totalValue || 0),
        0,
      );
    }
  }, [gridData]);

  const totalFuelconsumedUnit = useMemo(() => {
    if (gridData?.length > 0) {
      return gridData?.reduce(
        (accumulator, item) => accumulator + (item?.totalFuelQuantity || 0),
        0,
      );
    }
  }, [gridData]);

  const vat = useMemo(() => {
    return ((grandTotalValue + damageChange) * 5) / 100;
  }, [grandTotalValue, damageChange]);

  const totalBillAmount = useMemo(() => {
    return grandTotalValue + damageChange + vat + rmscivsrent;
  }, [grandTotalValue, damageChange, vat, rmscivsrent]);

  const handleRateChange = (index, newRate) => {
    const newGridData = [...gridData];
    newGridData[index].rate = newRate;
    newGridData[index].totalValue =
      newRate * newGridData[index].totalFuelQuantity;
    setGridData(newGridData);
  };
  const saveFuelConsumption = () => {
    const payload = gridData?.map((item) => ({
      consumptionId: 0,
      costTypeId: 2,
      strCostTypeName: 'Fuel Consumption',
      particularsId: 16,
      particularsName: 'Fuel Consumption',
      consumptionType: 'Gas',
      totalValue: item?.totalValue,
      demandChage: damageChange,
      meterRent: 0,
      rmscivsrent: rmscivsrent,
      vatamt: ((item.totalValue + damageChange) * 5) / 100,
      businessUnitId: buId,
      monthId: new Date(values.fromDate).getMonth() + 1,
      yearId: new Date(values.fromDate).getFullYear(),
      isActive: true,
      dteCreatedAt: new Date().toISOString(),
      createdBy: profileData?.userId,
      rebTotalConsmQuantity: gridData[0]?.totalFuelQuantity,
      rate: item?.rate,
    }));
    saveGridData(
      `/mes/MSIL/CreateGeneratorFuelConsumptionVoucher?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${buId}`,
      payload[0],
      () => {
        setShowJVModal(false);
      },
      true,
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <div className="text-right my-3">
          <button
            onClick={() => {
              saveFuelConsumption();
            }}
            type="button"
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>Particulars</th>
                <th>Consumption Type</th>
                <th>Qty (Unit)</th>
                <th>Rate</th>
                <th>Value</th>
              </tr>
              {gridData?.length > 0 &&
                gridData.map((item, i) => (
                  <tr key={i}>
                    {i === 0 && (
                      <td rowSpan={gridData.length}>{item?.particulars}</td>
                    )}
                    <td>{item?.fuelType}</td>
                    <td className="text-center">{item?.totalFuelQuantity}</td>
                    <td className="text-center">
                      <InputField
                        value={item?.rate || 0}
                        type="number"
                        onChange={(e) => handleRateChange(i, +e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      {item?.totalValue?.toFixed(2) || ''}
                    </td>
                  </tr>
                ))}
              <tr>
                <td colSpan={2}>Total</td>
                <td className="text-center">
                  {totalFuelconsumedUnit?.toFixed(2)}
                </td>
                <td></td>
                <td className="text-center">{grandTotalValue?.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4}>Demand Change</td>
                <td className="text-center">
                  <InputField
                    value={damageChange || ''}
                    type="number"
                    onChange={(e) => setDamageChange(+e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center" colSpan={4}>
                  Total
                </td>
                <td className="text-center">
                  {(grandTotalValue + damageChange)?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={4}>Vat (5%)</td>
                <td className="text-center">{vat?.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4}>Meter Rent</td>
                <td className="text-center">{rmscivsrent?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="text-center text-bold" colSpan={4}>
                  Total Bill Amount
                </td>
                <td className="text-center text-bold">
                  {totalBillAmount?.toFixed(2)}
                </td>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </>
  );
}
