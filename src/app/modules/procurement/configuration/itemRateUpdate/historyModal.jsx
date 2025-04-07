import React, { useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { _dateTimeFormatter } from '../../../_helper/_dateFormate';
import { getDownlloadFileView_Action } from '../../../_helper/_redux/Actions';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
export default function ItemRateHistoryModal({ propsObj }) {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { singleData } = propsObj;
  const [historyData, getHistoryData] = useAxiosGet();

  useEffect(() => {
    getHistoryData(
      `/procurement/PurchaseOrder/GetItemRateConfigurationHistory?itemId=${singleData?.itemId}&configId=${singleData?.itemRateConfigId}`
    );
  }, [singleData]);
  const dispatch = useDispatch();
  return (
    <>
      <div className="form-group  global-form row">
        <p className="col-lg-3">
          <strong>Item Code</strong> : {singleData?.itemCode}
        </p>
        <p className="col-lg-3">
          <strong>Item Name</strong> : {singleData?.itemName}
        </p>
        <p className="col-lg-3">
          <strong>Item UoM</strong> : {singleData?.uomName}
        </p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Effective Date</th>
              <th>Last Update Date</th>
              <th>Update By</th>
              <th>
                {[144, 189, 188].includes(selectedBusinessUnit?.value)
                  ? 'Rate'
                  : 'Rate (Dhaka)'}
              </th>
              {![144, 189, 188].includes(selectedBusinessUnit?.value) && (
                <th>Rate (Chittagong)</th>
              )}
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {historyData?.length > 0 &&
              historyData?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="text-center">
                    {_dateTimeFormatter(item?.effectiveDate)}
                  </td>
                  <td className="text-center">
                    {_dateTimeFormatter(item?.updatedAt)}
                  </td>
                  <td>{item?.updatedByName}</td>
                  <td className="text-center">{item?.itemRate}</td>
                  {![144, 189, 188].includes(selectedBusinessUnit?.value) && (
                    <td className="text-center">{item?.itemRateOthers}</td>
                  )}
                  <td className="text-center">
                    {singleData?.attachment ? (
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">View Attachment</Tooltip>
                        }
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              getDownlloadFileView_Action(
                                singleData?.attachment
                              )
                            );
                          }}
                          className="ml-2"
                        >
                          <i
                            style={{ fontSize: '16px' }}
                            className={`fa pointer fa-eye`}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </OverlayTrigger>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
