import React, { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
function Details({ clickRowDto }) {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, loading] = useAxiosGet();
  useEffect(() => {
    getRowData(
      `/oms/SalesInformation/GetReceiveableAgingReportDetaills?unitID=${selectedBusinessUnit?.value}&ReportType=1&DCId=${clickRowDto?.intdistributionchannelid}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowDto]);
  return (
    <div>
      {loading && <Loading />}
      <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Customer Name</th>
            <th>Region Name</th>
            <th>Area Name</th>
            <th>Territory name</th>
            <th>Not Over Due</th>
            <th>Over Due</th>
            <th>Total Credit Limit</th>
            <th>Total Due</th>
            <th>Due 30</th>
            <th>Due 91</th>
            <th>Due 3145</th>
            <th>Due 4660</th>
            <th>Due 6190</th>
            <th>Mon Credit Limit</th>
            <th>Mon Bg</th>
            <th>Credit days</th>
            <th>Delivery Date Diffrance</th>
            <th>Last Collection Date</th>
            <th>Last Delivery Date</th>
            <th>Mortgage Type Name</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.length > 0 &&
            rowData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.strCustomerName}</td>
                <td>{item?.RegionName}</td>
                <td>{item?.AreaName}</td>
                <td>{item?.Territoryname}</td>
                <td className="text-right">
                  {Number((item?.NotOverDue).toFixed(2))}
                </td>
                <td className="text-right">
                  {Number((item?.OverDue).toFixed(2))}
                </td>
                <td className="text-right">{item?.TotalCreditLimit}</td>
                <td className="text-right">
                  {Number((item?.TotalDue).toFixed(2))}
                </td>
                <td className="text-right">
                  {Number((item?.due30).toFixed(2))}
                </td>
                <td className="text-right">
                  {Number((item?.due91).toFixed(2))}
                </td>
                <td className="text-right">
                  {Number((item?.due3145).toFixed(2))}
                </td>
                <td className="text-right">
                  {Number((item?.due4660).toFixed(2))}
                </td>
                <td className="text-right">
                  {Number((item?.due6190).toFixed(2))}
                </td>
                <td className="text-right">{item?.monCreditLimit}</td>
                <td className="text-right">
                  {Number((item?.monbg).toFixed(2))}
                </td>
                <td className="text-right">{item?.creditdays}</td>
                <td className="text-right">{item?.DeliveryDateDiffrance}</td>
                <td className="text-right">
                  {item?.LastCollectiondate &&
                    _dateFormatter(item?.LastCollectiondate)}
                </td>
                <td className="text-right">
                  {item?.LastDeliveryDate &&
                    _dateFormatter(item?.LastDeliveryDate)}
                </td>
                <td className="text-right">{item?.MortgageTypeName}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default Details;
