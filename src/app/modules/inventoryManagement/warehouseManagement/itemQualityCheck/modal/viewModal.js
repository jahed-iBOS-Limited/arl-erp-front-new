import React, { useEffect } from 'react';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _fixedPoint } from '../../../../_helper/_fixedPoint';
import Loading from '../../../../_helper/_loading';
import CommonTable from '../../../../_helper/commonTable';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { _numbering } from '../helper';

export default function QualityCheckViewModal({ singleData }) {
  const [modalData, getModalData, loadModalData] = useAxiosGet();
  let standardValue = 0,
    totalActualQty = 0,
    totalDeductQty = 0,
    totalUnloadDeduct = 0;
  useEffect(() => {
    getModalData(
      `/mes/QCTest/GetItemQualityCheckDataById?qualityCheckId=${singleData?.qualityCheckId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  return (
    <div>
      {loadModalData && <Loading />}
      <div
        style={{
          margin: '30px 0px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div>
            <strong> Supplier Name:{modalData?.supplierName}</strong>
          </div>
          <div>
            <strong> Item Name:{modalData?.itemName}</strong>
          </div>
          <div>
            <strong> Net Weight :{modalData?.netWeight} </strong>
          </div>
          <div>
            <strong> Get Entry Code :{modalData?.entryCode} </strong>
          </div>
        </div>
        <div>
          <div>
            <strong> Address :{modalData?.supplierAddress} </strong>
          </div>

          <div>
            <strong>Status :{modalData?.status} </strong>
          </div>
          <div>
            <strong>Date :{_dateFormatter(modalData?.createdAt)} </strong>
          </div>
          <div>
            <strong>Vehicle No :{modalData?.vehicleNo} </strong>
          </div>
          <div>
            <strong>Po No :{modalData?.purchaseOrderCode} </strong>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Challan Qty: {modalData?.challanQuantity}
          </strong>{' '}
        </p>
        <p style={{ margin: 0 }}>
          <strong> Net Weight (Scale) :{modalData?.netScaleWeight} </strong>
        </p>
        <p style={{ margin: 0 }}>
          <strong> Extra Deduction :{modalData?.extraNetQuantity} </strong>
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Net Weight: {modalData?.netWeight}
          </strong>{' '}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Per Bag Qty: {_fixedPoint(modalData?.kgPerBag || 0)}
          </strong>{' '}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Deduct For Bag:{' '}
            {_fixedPoint(modalData?.bagWeightDeductQuantity || 0)}
          </strong>{' '}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Deduct Qty: {modalData?.deductionQuantity}
          </strong>{' '}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Unload Deduct: {modalData?.unloadedDeductionQuantity}
          </strong>{' '}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ margin: 0 }}>
            Total Actual Qty: {modalData?.actualQuantity}
          </strong>{' '}
        </p>
      </div>
      {modalData?.headerDetailsList?.map((parentItem, parentIndex) => (
        <CommonTable
          headersData={[
            'Sl',
            'Item Name',
            'UOM',
            'QC Qty(Bag)',
            'QC Qty',
            'Deduct %',
            'Deduct Qty',
            'Unload Deduct',
            'Actual Qty',
            'Remarks',
          ]}
        >
          <tbody key={parentIndex}>
            <tr>
              <td className="text-center">{_numbering(parentIndex + 1)}</td>
              <td className="text-center">{modalData?.itemName}</td>
              <td className="text-center">{modalData?.uomName}</td>
              <td className="text-center">{parentItem?.qcQuantityBag}</td>
              <td className="text-center">{parentItem?.qcQuantity}</td>
              <td className="text-center">{parentItem?.deductionPercentage}</td>
              <td className="text-center">{parentItem?.deductionQuantity}</td>
              <td className="text-center">
                {parentItem?.unloadedDeductionQuantity}
              </td>
              <td className="text-center">{parentItem?.actualQuantity}</td>
              <td className="text-center">{parentItem?.remarks}</td>
            </tr>
            {parentItem?.rowList?.length > 0 && (
              <tr style={{ margin: '10px' }}>
                <td colSpan={10}>
                  <CommonTable
                    headersData={[
                      'Parameter',
                      'Standard Value',
                      'Actual Value',
                      'System Deduction',
                      'Manual Deduction',
                      'Remarks',
                    ]}
                  >
                    <tbody>
                      {parentItem?.rowList?.map((item, index) => {
                        standardValue += item?.standardValue;
                        totalActualQty += item?.actualValue;
                        totalDeductQty += item?.systemDeduction;
                        totalUnloadDeduct += item?.manualDeduction;

                        return (
                          <tr key={index}>
                            <td>{item?.parameterName}</td>
                            <td>{item?.standardValue}</td>
                            <td>{item?.actualValue}</td>
                            <td>{item?.systemDeduction}</td>
                            <td>{item?.manualDeduction}</td>
                            <td>{item?.remarks}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={1}>Total</td>
                        <td>
                          <b>{_fixedPoint(standardValue || 0)}</b>
                        </td>
                        <td>
                          <b>{_fixedPoint(totalActualQty || 0)}</b>
                        </td>
                        <td>
                          <b>{_fixedPoint(totalDeductQty || 0)}</b>
                        </td>
                        <td>
                          <b>{_fixedPoint(totalUnloadDeduct || 0)}</b>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </CommonTable>
                </td>
              </tr>
            )}
          </tbody>
        </CommonTable>
      ))}
    </div>
  );
}
