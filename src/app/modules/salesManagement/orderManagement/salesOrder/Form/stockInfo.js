import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { GetItemWiseWarehouseStock } from "../helper";
import Loading from "./../../../../_helper/_loading";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function StockInfo({ values }) {
  const [loading, setLoading] = useState(false);
  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      values?.item?.value
    ) {
      GetItemWiseWarehouseStock(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.item?.value,
        setRowDto,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  console.log(rowDto);
  return (
    <div>
      {loading && <Loading />}
      <div className='table-responsive'>
        <table className='table global-table'>
          <thead>
            <tr>
              <th className='p-0'>SL</th>
              <th className='p-0'>Warehouse</th>
              <th className='p-0'>Current Qty </th>
              <th className='p-0'>Pending Qty</th>
              <th className='p-0'>Saleable Qty</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td className=''>{item?.warehouseName}</td>
                <td className='text-right'>{_fixedPoint(item?.currentStock)}</td>
                <td className='text-right'>{_fixedPoint(item?.pendingStock)}</td>
                <td className='text-right'>{_fixedPoint(item?.saleableStock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockInfo;
