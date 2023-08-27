import React, { useEffect } from "react";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";
// import "./style.scss";
function YeildReport({ tableData, values }) {
  const [isModalShow, setIsModalShow] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});
  return (
    <>
      <div className='row YeildReport'>
        <div className='col-lg-12'>
          <div className='table-responsive'>
            <table className='table table-striped table-bordered global-table'>
              <>
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL.</th>
                    <th>Product</th>
                    <th>Issue</th>
                    <th>Consumption KG</th>
                    <th>WIP</th>
                    <th>Production KG</th>
                    <th>By Product KG</th>
                    <th>Rice(%)</th>
                    <th>By Product(%)</th>
                    <th
                      style={{
                        width: "30px",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((item, index) => {
                    let byProductPercent =
                      ((+item?.producationqtyBag || 0) /
                        (+item?.consumtionQty || 0)) *
                      100;
                    let yieldPerPercent =
                      ((+item?.producationQty || 0) /
                        (+item?.consumtionQty || 0)) *
                      100;
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.variant}</td>
                          <td className='text-right'>
                            {_fixedPoint(item?.issueQty || 0)}
                          </td>
                          <td className='text-right'>
                            {_fixedPoint(item?.consumtionQty || 0)}
                          </td>
                          <td className='text-right'>
                            {_fixedPoint(item?.wip || 0)}
                          </td>
                          <td className='text-right'>
                            {_fixedPoint(item?.producationQty || 0)}
                          </td>
                          <td className='text-right'>
                            {_fixedPoint(item?.producationqtyBag || 0)}
                          </td>
                          <td className='text-right'>
                            {_fixedPoint(
                              isFinite(yieldPerPercent) ? yieldPerPercent : 0
                            )}
                          </td>
                          <td className='text-right'>
                            {_fixedPoint(
                              isFinite(byProductPercent) ? byProductPercent : 0
                            )}
                          </td>
                          <td>
                            <div className='d-flex justify-content-center align-items-center'>
                              <button
                                className='btn btn-primary mr-2'
                                type='button'
                                onClick={() => {
                                  setIsModalShow(true);
                                  setClickRowData({
                                    ...item,
                                    ...values,
                                  });
                                }}
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </>
            </table>
          </div>
        </div>
      </div>

      <IViewModal
        show={isModalShow}
        onHide={() => {
          setIsModalShow(false);
          setClickRowData({});
        }}
        title='Yeild Report Details'
      >
        <YeildReportDetails clickRowData={clickRowData} />
      </IViewModal>
    </>
  );
}

export default YeildReport;

function YeildReportDetails({ clickRowData }) {
  const [
    yeildReportDetailsList,
    getYeildReportDetailsList,
    yeildReportDetailsLoading,
  ] = useAxiosGet([]);
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  useEffect(() => {
    if (clickRowData) {
      getYeildReportDetailsList(
        `/mes/ProductionEntry/GetYearldReport?unitId=${selectedBusinessUnit?.value}&dteFromDate=${clickRowData?.fromDate}&dteToDate=${clickRowData?.toDate}&intPartId=3&ShopFloorId=${clickRowData?.shopFloor?.value}&BillTypeId=${clickRowData?.bomType?.value}&Variant=${clickRowData?.variant}&ConsumptionQty=${clickRowData?.consumtionQty}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // yeildReportDetailsList reduce
  const grandTotal = yeildReportDetailsList?.reduce(
    (acc, curr) => {
      return {
        byProducationQty: acc.byProducationQty + (+curr?.byProducationQty || 0),
        byproductPer: acc.byproductPer + (+curr?.byproductPer || 0),
      };
    },
    {
      byProducationQty: 0,
      byproductPer: 0,
    }
  );

  return (
    <>
      {yeildReportDetailsLoading && <Loading />}
      <div className='table-responsive'>
        <table className='table table-striped table-bordered global-table'>
          <>
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL.</th>
                <th>Item Name</th>
                <th>By Product KG</th>
                <th>By Product(%)</th>
              </tr>
            </thead>
            <tbody>
              {yeildReportDetailsList?.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item?.stritemname}</td>
                      <td className='text-right'>
                        {_fixedPoint(item?.byProducationQty || 0)}
                      </td>
                      <td className='text-right'>
                        {_fixedPoint(item?.byproductPer || 0)}
                      </td>
                    </tr>
                  </>
                );
              })}
              <tr>
                <td className='text-right' colSpan={2}>
                  <b>Total</b>
                </td>
                <td className='text-right'>
                  <b>{_fixedPoint(grandTotal?.byProducationQty || 0)}</b>
                </td>
                <td className='text-right'>
                  {/* <b>
                    {_fixedPoint(
                      grandTotal?.byproductPer /
                        yeildReportDetailsList?.length || 0
                    )}
                  </b> */}
                </td>
              </tr>
            </tbody>
          </>
        </table>
      </div>
    </>
  );
}
