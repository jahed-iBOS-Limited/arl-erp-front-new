import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import { imarineBaseUrl } from '../../../../../../App';
import IViewModal from '../../../../_helper/_viewModal';
import AdditionalRemarks from './additionalRemarks';
import axios from 'axios';
import { useState } from 'react';
type TbodyType = {
  shippingHeadOfCharges: any[];
  setShippingHeadOfCharges: (data: any[]) => void;
  errors: any;
  touched: any;
  currencyList: any[];
  shipingCargoTypeDDL: any[];
  isAirOperation?: boolean;
  rowClickData?: any;
  tradeTypeId?: number;
  bookingData?: any;
};
function TableBody({
  shippingHeadOfCharges,
  setShippingHeadOfCharges,
  errors,
  touched,
  currencyList,
  shipingCargoTypeDDL,
  isAirOperation,
  rowClickData,
  tradeTypeId,
  bookingData,
}: TbodyType) {
  const [updatedRowIndex, setUpdatedRowIndex] = useState<number | null>(null);
  const [additionalRemarksObj, setAdditionalRemarksObj] = useState<any>({
    item: {},
    index: null,
    isModalOpen: false,
  });

  const transportPlanningAir =
    bookingData?.transportPlanning?.find((i) => {
      return [1, 5].includes(i?.transportPlanningModeId);
    }) || '';

  const totalNumberOfPackages = bookingData?.rowsData?.reduce((acc, item) => {
    return acc + (+item?.totalNumberOfPackages || 0);
  }, 0);

  return (
    <>
      <tbody>
        {shippingHeadOfCharges?.map((item, index) => {
          const isDisabled =
            !item?.checked || item?.billGenerateCode ? true : false;

          return (
            <tr key={index}>
              <td>
                <input
                  disabled={item?.billingId}
                  type="checkbox"
                  checked={item?.checked}
                  onChange={(e) => {
                    const exchangeRate = e?.target?.checked
                      ? item?.exchangeRate
                        ? item?.exchangeRate
                        : transportPlanningAir?.rate
                      : 0;
                    const packageQuantity = e?.target?.checked
                      ? item?.packageQuantity
                        ? item?.packageQuantity
                        : totalNumberOfPackages
                      : 0;

                    const collectionActualAmount = e?.target?.checked
                      ? item?.collectionActualAmount
                        ? item?.collectionActualAmount
                        : (+exchangeRate || 0) * (+packageQuantity || 0)
                      : '';

                    const newObj = {
                      ...item,
                      checked: e?.target?.checked,
                      currencyId: e?.target?.checked ? item?.currencyId : 0,
                      currency: e?.target?.checked ? item?.currency : '',
                      exchangeRate: exchangeRate,
                      packageQuantity: packageQuantity,
                      packageRate: e?.target?.checked ? item?.packageRate : 0,
                      collectionActualAmount: collectionActualAmount,
                      collectionDummyAmount: e?.target?.checked
                        ? item?.collectionDummyAmount
                        : '',
                      collectionPartyType: e?.target?.checked
                        ? item?.collectionPartyType
                        : '',
                      collectionPartyTypeId: e?.target?.checked
                        ? item?.collectionPartyTypeId
                        : 0,
                      collectionParty: e?.target?.checked
                        ? item?.collectionParty
                        : '',
                      collectionPartyId: e?.target?.checked
                        ? item?.collectionPartyId
                        : 0,
                      paymentActualAmount: e?.target?.checked
                        ? item?.paymentActualAmount
                        : '',
                      paymentDummyAmount: e?.target?.checked
                        ? item?.paymentDummyAmount
                        : '',
                      paymentAdvanceAmount: e?.target?.checked
                        ? item?.paymentAdvanceAmount
                        : '',
                      paymentPartyType: e?.target?.checked
                        ? item?.paymentPartyType
                        : '',
                      paymentPartyTypeId: e?.target?.checked
                        ? item?.paymentPartyTypeId
                        : 0,
                      paymentParty: e?.target?.checked
                        ? item?.paymentParty
                        : '',
                      paymentPartyId: e?.target?.checked
                        ? item?.paymentPartyId
                        : 0,

                      isActulCombindToMbl: e?.target?.checked
                        ? item?.isActulCombindToMbl
                        : false,
                      isDummyCombindToMbl: e?.target?.checked
                        ? item?.isDummyCombindToMbl
                        : false,
                      isPaymentCombindToMbl: e?.target?.checked
                        ? item?.isPaymentCombindToMbl
                        : false,
                      profitSharePercentage: e?.target?.checked
                        ? item?.profitSharePercentage
                        : '',
                      converstionRateUsd: e?.target?.checked
                        ? item?.converstionRateUsd
                        : '',
                      paymentActualCombindAmount: e?.target?.checked
                        ? item?.paymentActualCombindAmount
                        : '',
                      paymentDummyCombindAmount: e?.target?.checked
                        ? item?.paymentDummyCombindAmount
                        : '',
                      paymentAdvanceCombindAmount: e?.target?.checked
                        ? item?.paymentAdvanceCombindAmount
                        : '',
                      isCommonPaymentCombind: e?.target?.checked
                        ? item?.isCommonPaymentCombind
                        : false,
                    };
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index] = newObj;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                />
              </td>
              <td>{index + 1}</td>
              <td>
                <div className="position-relative d-flex align-items-center ">
                  {item?.headOfCharges}
                  {item?.isHeadOfChargesEdit &&
                    !(isDisabled && item?.billingId) && (
                      <>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">Additional remarks</Tooltip>
                          }
                        >
                          <span className="pl-1">
                            <i
                              className={`fas fa-pen-square pointer`}
                              onClick={() => {
                                setAdditionalRemarksObj({
                                  item: item,
                                  index: index,
                                  isModalOpen: true,
                                });
                              }}
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </>
                    )}
                </div>
              </td>
              <td>
                <NewSelect
                  label={''}
                  options={currencyList}
                  value={
                    item?.currencyId
                      ? {
                          label: item?.currency,
                          value: item?.currencyId,
                        }
                      : ''
                  }
                  name="currency"
                  onChange={(valueOption) => {
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].currency = valueOption?.label;
                    copyPrv[index].currencyId = valueOption?.value;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={isDisabled || item?.billingId}
                />
              </td>
              <td className="">
                <InputField
                  disabled={isDisabled || item?.billingId}
                  value={item?.exchangeRate}
                  label=""
                  name="exchangeRate"
                  type="number"
                  onChange={(e) => {
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].exchangeRate = e.target.value;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                  errors={errors}
                  touched={touched}
                  min={0}
                  step="any"
                />
              </td>

              {isAirOperation && (
                <>
                  {/* packageQuantity input  */}
                  <td className="">
                    <InputField
                      disabled={isDisabled || item?.invoiceId}
                      value={item?.packageQuantity}
                      name="packageQuantity"
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        const copyPrv = [...shippingHeadOfCharges];
                        copyPrv[index].packageQuantity = value;

                        const packageQuantity = +value || 0;
                        const packageRate = +item?.packageRate || 0;
                        const amount = packageQuantity * packageRate;
                        copyPrv[index].collectionActualAmount = amount;
                        setShippingHeadOfCharges(copyPrv);

                        setUpdatedRowIndex(index);
                        setTimeout(() => {
                          setUpdatedRowIndex(null);
                        }, 2000);
                      }}
                      min={0}
                      step="any"
                    />
                  </td>
                  {/* PackageRate  input */}
                  <td className="">
                    <InputField
                      disabled={isDisabled || item?.invoiceId}
                      value={item?.packageRate}
                      name="packageRate"
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        const copyPrv = [...shippingHeadOfCharges];
                        copyPrv[index].packageRate = value;

                        const packageRate = +value || 0;
                        const packageQuantity = +item?.packageQuantity || 0;
                        const amount = packageRate * packageQuantity;
                        copyPrv[index].collectionActualAmount = amount;
                        setShippingHeadOfCharges(copyPrv);

                        setUpdatedRowIndex(index);
                        setTimeout(() => {
                          setUpdatedRowIndex(null);
                        }, 2000);
                      }}
                      min={0}
                      step="any"
                    />
                  </td>
                </>
              )}
              {/* "Collection Type" =  NewSelect component */}
              <td className="collection-border-right collection-border-left">
                <NewSelect
                  isDisabled={isDisabled || item?.invoiceId}
                  options={[
                    ...(shipingCargoTypeDDL ?? []).filter(
                      (i) => i?.value !== 8
                    ),
                    ...(isAirOperation
                      ? [
                          {
                            label: 'Air Ops',
                            value: 0,
                          },
                        ]
                      : []),
                    {
                      label: `Others`,
                      value: 0,
                    },
                  ]}
                  value={
                    item?.collectionPartyType
                      ? {
                          label: item?.collectionPartyType,
                          value: item?.collectionPartyTypeId,
                        }
                      : ''
                  }
                  name="collectionPartyType"
                  onChange={(valueOption) => {
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].collectionPartyType = valueOption?.label;
                    copyPrv[index].collectionPartyTypeId = valueOption?.value;
                    copyPrv[index].collectionParty = '';
                    copyPrv[index].collectionPartyId = 0;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                />
              </td>
              <td className="collection-border-right">
                <SearchAsyncSelect
                  isDisabled={
                    isDisabled || !item?.collectionPartyType || item?.invoiceId
                  }
                  selectedValue={
                    item?.collectionParty
                      ? {
                          label: item?.collectionParty,
                          value: item?.collectionPartyId,
                        }
                      : ''
                  }
                  handleChange={(valueOption) => {
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].collectionParty = valueOption?.label;
                    copyPrv[index].collectionPartyId = valueOption?.value;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                  loadOptions={(v) => {
                    let url = '';
                    if (item?.collectionPartyTypeId === 0) {
                      url = `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?search=${v}&businessPartnerType=2&cargoType=0`;
                    } else {
                      // tradeTypeId  = 1 export
                      if (tradeTypeId === 1) {
                        url = `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?search=${v}&businessPartnerType=2&shipperId=${rowClickData?.shipperId}&participntTypeId=${item?.collectionPartyTypeId}`;
                      }
                      // tradeTypeId  = 2 import
                      if (tradeTypeId === 2) {
                        url = `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?search=${v}&businessPartnerType=2&consigneeId=${rowClickData?.consigneeId}&participntTypeId=${item?.collectionPartyTypeId}`;
                      }
                    }
                    if (v?.length < 2) return [];
                    return axios.get(url).then((res) => res?.data);
                  }}
                />
              </td>
              {/*  "Collection  actual Amount" =  InputField component */}
              <td className={`collection-border-right`}>
                <InputField
                  disabled={
                    isDisabled || item?.invoiceId || !item?.collectionParty
                  }
                  value={item?.collectionActualAmount}
                  name="collectionActualAmount"
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].collectionActualAmount = value;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                  min={0}
                  step="any"
                  className={`form-control ${updatedRowIndex === index ? ' border-animation' : ' '}`}
                />
              </td>
              {/* "Collection Dummy  Dummy Amount" =  InputField component */}
              <td className="collection-border-right">
                <InputField
                  disabled={
                    isDisabled ||
                    item?.invoiceId ||
                    !item?.collectionParty ||
                    item?.isCommonPaymentCombind
                  }
                  value={item?.collectionDummyAmount}
                  name="collectionDummyAmount"
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].collectionDummyAmount = value;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                  min={0}
                  step="any"
                />
              </td>

              {/* "Payment Type" =  NewSelect component */}
              <td className="payment-border-right">
                <NewSelect
                  isDisabled={
                    isDisabled ||
                    item?.billRegisterId ||
                    item?.advancedBillRegisterId
                  }
                  options={[
                    ...(shipingCargoTypeDDL ?? []).filter(
                      (i) => i?.value !== 8
                    ),
                    ...(isAirOperation
                      ? [
                          {
                            label: 'Air Ops',
                            value: 0,
                          },
                        ]
                      : []),
                    {
                      label: `Others`,
                      value: 0,
                    },
                  ]}
                  value={
                    item?.paymentPartyType
                      ? {
                          label: item?.paymentPartyType,
                          value: item?.paymentPartyTypeId,
                        }
                      : ''
                  }
                  name="paymentPartyType"
                  onChange={(valueOption) => {
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].paymentPartyType = valueOption?.label;
                    copyPrv[index].paymentPartyTypeId = valueOption?.value;
                    copyPrv[index].paymentParty = '';
                    copyPrv[index].paymentPartyId = 0;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                />
              </td>
              <td className="payment-border-right">
                <SearchAsyncSelect
                  isDisabled={
                    isDisabled ||
                    !item?.paymentPartyType ||
                    item?.billRegisterId ||
                    item?.advancedBillRegisterId ||
                    item?.isCommonPaymentCombind
                  }
                  selectedValue={
                    item?.paymentParty
                      ? {
                          label: item?.paymentParty,
                          value: item?.paymentPartyId,
                        }
                      : ''
                  }
                  handleChange={(valueOption) => {
                    const copyPrv = [...shippingHeadOfCharges];
                    copyPrv[index].paymentParty = valueOption?.label;
                    copyPrv[index].paymentPartyId = valueOption?.value;
                    setShippingHeadOfCharges(copyPrv);
                  }}
                  loadOptions={(v) => {
                    let url = '';
                    if (item?.paymentPartyTypeId === 0) {
                      url = `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?search=${v}&businessPartnerType=1&cargoType=0`;
                    } else {
                      // tradeTypeId  = 1 export
                      if (tradeTypeId === 1) {
                        url = `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?search=${v}&businessPartnerType=1&shipperId=${rowClickData?.shipperId}&participntTypeId=${item?.paymentPartyTypeId}`;
                      }
                      // tradeTypeId  = 2 import
                      if (tradeTypeId === 2) {
                        url = `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?search=${v}&businessPartnerType=1&consigneeId=${rowClickData?.consigneeId}&participntTypeId=${item?.paymentPartyTypeId}`;
                      }
                    }

                    if (v?.length < 2) return [];
                    return axios.get(url).then((res) => res?.data);
                  }}
                />
              </td>
              {/* "Payment Actual Amount" =  InputField component */}
              <td className="payment-border-right">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <InputField
                    // disabled={isDisabled}
                    value={item?.paymentActualAmount}
                    name="paymentActualAmount"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      const copyPrv = [...shippingHeadOfCharges];
                      copyPrv[index].paymentActualAmount = value;
                      const num = +e.target.value || 0;

                      const isDisabled = num > 0;
                      copyPrv[index].isPaymentAdvanceAmountDisabled =
                        isDisabled;

                      setShippingHeadOfCharges(copyPrv);
                    }}
                    disabled={
                      item?.billRegisterId ||
                      item?.isPaymentActualAmountDisabled ||
                      !item?.paymentParty ||
                      isDisabled
                        ? true
                        : false
                    }
                    min={0}
                    step="any"
                  />
                </div>
              </td>
              {/* "Payment Dummy Amount" =  InputField component */}
              <td className="payment-border-right">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <InputField
                    // disabled={isDisabled}
                    value={item?.paymentDummyAmount}
                    name="paymentDummyAmount"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      const copyPrv = [...shippingHeadOfCharges];
                      copyPrv[index].paymentDummyAmount = value;

                      const num = +e.target.value || 0;
                      const isDisabled = num > 0;
                      copyPrv[index].isPaymentAdvanceAmountDisabled =
                        isDisabled;

                      setShippingHeadOfCharges(copyPrv);
                    }}
                    disabled={
                      item?.billRegisterId ||
                      item?.isPaymentDummyAmountDisabled ||
                      !item?.paymentParty ||
                      isDisabled
                        ? true
                        : false
                    }
                    min={0}
                    step="any"
                  />
                </div>
              </td>
              {/* Is Combind Checkbox */}
              <td className="payment-border-right">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="products-delete-tooltip">
                      Is Combind
                      {item?.isCommonPaymentCombind &&
                        item?.isCommonPaymentCombind}
                    </Tooltip>
                  }
                >
                  <input
                    type="checkbox"
                    checked={item?.isCommonPaymentCombind}
                    onChange={(e) => {
                      const copyPrv = [...shippingHeadOfCharges];
                      copyPrv[index].isCommonPaymentCombind =
                        e?.target?.checked;
                      copyPrv[index].isActulCombindToMbl = e?.target?.checked;
                      copyPrv[index].isDummyCombindToMbl = e?.target?.checked;
                      copyPrv[index].isPaymentCombindToMbl = e?.target?.checked;
                      setShippingHeadOfCharges(copyPrv);
                    }}
                    disabled={
                      item?.billRegisterId ||
                      item?.advancedBillRegisterId ||
                      item?.isCommonPaymentCombindDisabled ||
                      !item?.paymentParty ||
                      isDisabled
                        ? true
                        : false
                    }
                  />
                </OverlayTrigger>
              </td>

              {/* above  row copy button*/}
              <td>
                <div
                  className="d-flex justify-content-center"
                  style={{
                    gap: '5px',
                  }}
                >
                  <button
                    disabled={isDisabled}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const hardCopy = JSON.parse(
                        JSON.stringify(shippingHeadOfCharges)
                      );
                      // copy above row item copy and add new row
                      const aboveRow = hardCopy?.[index];
                      if (!aboveRow) {
                        return toast.warn('Please select above row');
                      }

                      const isOtherChargeCopy =
                        aboveRow?.headOfCharges?.includes('Other Charge');
                      // insert new row below the above row
                      const modifiedData = [
                        ...hardCopy?.slice(0, index + 1),
                        {
                          headOfCharges: isOtherChargeCopy
                            ? 'Other Charge'
                            : aboveRow?.headOfCharges || '',
                          headOfChargeId: aboveRow?.headOfChargeId || 0,
                          masterBlId: aboveRow?.masterBlId || 0,
                          masterBlCode: aboveRow?.masterBlCode || '',
                          modeOfTransportId: aboveRow?.modeOfTransportId || 0,
                          currency: aboveRow?.currency || '',
                          currencyId: aboveRow?.currencyId || 0,
                          exchangeRate: aboveRow?.exchangeRate || 0,
                          packageQuantity: aboveRow?.packageQuantity || 0,
                          packageRate: aboveRow?.packageRate || 0,
                          converstionRateUsd: aboveRow?.converstionRateUsd || 0,
                          profitSharePercentage:
                            aboveRow?.profitSharePercentage || 0,
                          collectionActualAmount: '',
                          collectionDummyAmount: '',
                          paymentDummyAmount: '',
                          paymentActualAmount: '',
                          isHeadOfChargesEdit: true,
                        },
                        ...hardCopy?.slice(index + 1),
                      ];
                      console.log(
                        JSON.stringify(modifiedData, null, 2),
                        'modifiedData'
                      );
                      setShippingHeadOfCharges(modifiedData);
                    }}
                  >
                    <i className="fa fa-clone" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>

      {additionalRemarksObj?.isModalOpen && (
        <IViewModal
          title={`Additional Remarks`}
          modelSize="sm"
          show={additionalRemarksObj?.isModalOpen}
          onHide={() => {
            setAdditionalRemarksObj({
              ...additionalRemarksObj,
              isModalOpen: false,
            });
          }}
        >
          <AdditionalRemarks
            additionalRemarksHandleChange={(value) => {
              const copyPrv = [...shippingHeadOfCharges];
              copyPrv[additionalRemarksObj?.index].headOfCharges =
                `Other Charge ` + value;
              setShippingHeadOfCharges(copyPrv);
            }}
            additionalRemarksValue={additionalRemarksObj?.item?.headOfCharges}
          />
        </IViewModal>
      )}
    </>
  );
}

export default TableBody;
