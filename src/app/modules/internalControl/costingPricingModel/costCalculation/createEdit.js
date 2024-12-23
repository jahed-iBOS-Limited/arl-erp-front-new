import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import IForm from '../../../_helper/_form';
import { IInput } from '../../../_helper/_input';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import CommonTable from '../../../_helper/commonTable';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import {
  rowCalculationFunc,
  tblCostComponentHeaders,
  tblMaterialCostHeaders,
} from './helper';
import { getBusinessPartnerDDL } from '../../../config/partner-management/partnerProductAllocation/helper';
import { _todayDate } from '../../../_helper/_todayDate';

const initData = {
  product: '',
  uomName: '',
  finishGood: '',
  conversion: '',
  percentigeInput: '',
  yield: '',
  requiredQty: '',
  currentQty: '',
  currentInvPrice: '',
  newQty: '',
  newPrice: '',
  currentCost: '',
  newCost: '',
  averageCost: '',
  packingMaterial: '',
  manufacturingOverhead: '',
  totalManufacturingCost: '',
  markupOrProfit: '',
};
export default function CostConfigurationCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [productDDL, getProductDDL, productLoader] = useAxiosGet();
  const [
    finishGoodDDL,
    getFinishGoodDDL,
    finishGoodLoader,
    setFinishGoodDDL,
  ] = useAxiosGet();
  const [
    productPreCostingData,
    getProductPreCostingData,
    productPreCostingLoader,
    setProductPreCostingData,
  ] = useAxiosGet();
  const [totalNewCost, setTotalNewCost] = useState(0);
  const [totalCurrentCost, setTotalCurrentCost] = useState(0);
  const [totalPeriodCost, setTotalPeriodCost] = useState(0);
  const [customerDDL, setCustomerDDL] = useState([]);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getProductDDL(
      `/costmgmt/Precosting/ProductDDL?businessUnitId=${selectedBusinessUnit?.value}`,
    );

    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCustomerDDL,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    if (!values?.product) {
      toast.warn('Product is required');
      return;
    }
    if (!values?.finishGood) {
      toast.warn('Finish Good is required');
      return;
    }

    if (productPreCostingData?.precostingMaterial?.length === 0) {
      toast.warn('Please add material');
      return;
    }
    if (productPreCostingData?.precostingOverhead?.length === 0) {
      toast.warn('Please add cost component');
      return;
    }
    if (!values?.customer) {
      toast.warn('Customer is required');
      return;
    }

    const markupValue = +values?.markupOrProfit / 100;
    const packingMaterialValue = +values?.packingMaterial || 0;
    const manufacturingOverheadValue = +values?.manufacturingOverhead || 0;
    const totalCostConversion =
      totalNewCost * (values?.finishGood?.conversion || 0);
    const markupMarginAmount =
      (totalCostConversion +
        packingMaterialValue +
        manufacturingOverheadValue +
        totalPeriodCost) *
      markupValue;
    const totallll =
      totalCostConversion +
      packingMaterialValue +
      manufacturingOverheadValue +
      totalPeriodCost;
    // const markupProfit =
    //   (totalCostConversion +
    //     packingMaterialValue +
    //     manufacturingOverheadValue +
    //     totalPeriodCost) *
    //   markupValue;
    const precostingMaterial = productPreCostingData?.precostingMaterial?.map(
      (itm) => {
        return {
          autoId: 0,
          costingId: 0,
          materialItemId: itm?.materialItemId,
          conversion: +itm?.conversion,
          useProportion: +itm?.percentigeInput,
          yieldProportion: +itm?.yield,
          convQty: itm?.requiredQty,
          rate: +itm?.averageCost,
          amount: +itm?.conversion * itm?.averageCost,
        };
      },
    );
    const precostingOverhead = productPreCostingData?.precostingOverhead?.map(
      (itm) => {
        return {
          autoId: 0,
          costingId: 0,
          costElementId: itm?.costElementId,
          amount: +itm?.costElementAmount || 0,
        };
      },
    );
    const payload = {
      costingId: 0,
      businessUnitId: selectedBusinessUnit?.value || 0,
      productId: values?.product?.value || 0,
      fgItemId: values?.finishGood?.value || 0,
      costingDate: _todayDate() || '',
      partnerId: values?.customer?.value || 0,
      materialTotal: totalNewCost * values?.finishGood?.conversion || 0,
      overheadTotal:
        totalPeriodCost +
          +values?.packingMaterial +
          +values?.manufacturingOverhead || 0,
      costTotal:
        totalNewCost * values?.finishGood?.conversion +
          (+values?.packingMaterial + +values?.manufacturingOverhead) +
          totalPeriodCost || 0,
      marginPercent: +values?.markupOrProfit || 0,
      marginAmount: markupMarginAmount,
      finalPrice: totallll + markupMarginAmount,
      actionBy: profileData?.userId,
      precostingMaterial: precostingMaterial,
      precostingOverhead: precostingOverhead,
    };

    saveData(
      `/costmgmt/Precosting/SaveProductPrecosting`,
      payload,
      cb && cb(),
      true,
    );
  };
  const costElementAmountHandler = (index, key, value) => {
    const modifyData = [...productPreCostingData?.precostingOverhead];
    modifyData[index][key] = value;
    const costElementMultiplier = +modifyData[index].costElementMultiplier || 0;
    const costElementMultiplicand =
      +modifyData[index].costElementMultiplicand || 0;
    const costElementAmount = costElementMultiplier * costElementMultiplicand;

    modifyData[index].costElementAmount = costElementAmount;

    setProductPreCostingData({
      ...productPreCostingData,
      precostingOverhead: modifyData,
    });
  };

  useEffect(() => {
    const totalNewCostRow = productPreCostingData?.precostingMaterial?.reduce(
      (acc, item) => {
        return acc + (+item?.newCost || 0);
      },
      0,
    );
    setTotalNewCost(totalNewCostRow);
    const totalCurrentCostRow = productPreCostingData?.precostingMaterial?.reduce(
      (acc, item) => {
        return acc + (+item?.currentCost || 0);
      },
      0,
    );
    setTotalCurrentCost(totalCurrentCostRow);

    const totalPeriodCostRow = productPreCostingData?.precostingOverhead?.reduce(
      (acc, item) => {
        return acc + (+item?.costElementAmount || 0);
      },
      0,
    );
    setTotalPeriodCost(totalPeriodCostRow);
  }, [productPreCostingData]);
  console.log('productPreCostingData', productPreCostingData);
  return (
    <IForm title="Create Cost Calculation" getProps={setObjprops}>
      {(productLoader || finishGoodLoader || productPreCostingLoader) && (
        <Loading />
      )}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setProductPreCostingData([]);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        label="Product"
                        options={productDDL}
                        value={values?.product}
                        name="product"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue('product', valueOption);
                            setFieldValue('uomName', {
                              value: valueOption?.uomId,
                              label: valueOption?.uomName,
                            });
                            getFinishGoodDDL(
                              `/costmgmt/Precosting/FgItemByProductDDL?businessUnitId=${selectedBusinessUnit?.value}&productId=${valueOption?.value}`,
                            );
                          } else {
                            setFieldValue('product', '');
                            setFieldValue('uomName', '');
                            setFinishGoodDDL([]);
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        label="UOM"
                        options={[]}
                        value={values?.uomName}
                        name="uomName"
                        onChange={(valueOption) => {
                          setFieldValue('uomName', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Finish Good"
                        options={finishGoodDDL}
                        value={values?.finishGood}
                        name="finishGood"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue('finishGood', valueOption);
                            setFieldValue('fgUomName', {
                              value: valueOption?.uomId,
                              label: valueOption?.uomName,
                            });
                            setFieldValue(
                              'fgConversionRate',
                              valueOption?.conversion || '',
                            );
                            getProductPreCostingData(
                              `/costmgmt/Precosting/ViewProductPrecosting?businessUnit=${selectedBusinessUnit?.value}&productId=${values?.product?.value}&fgItemId=${valueOption?.value}`,
                              (data) => {
                                const modData =
                                  data?.precostingOverhead?.map((item) => {
                                    return {
                                      ...item,
                                      costElementMultiplier:
                                        item?.costElementMultiplier ?? 1,
                                      costElementMultiplicand:
                                        item?.costElementMultiplicand ?? '0',
                                      costElementAmount: '0',
                                    };
                                  }) || [];
                                setProductPreCostingData({
                                  ...data,
                                  precostingOverhead: modData,
                                });
                              },
                            );
                          } else {
                            setFieldValue('finishGood', '');
                            setProductPreCostingData([]);
                            setFieldValue('fgUomName', '');
                            setFieldValue('fgConversionRate', '');
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.fgConversionRate || ''}
                        name="fgConversionRate"
                        label="FG Conversion Rate"
                        type="number"
                        disabled
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        label="FG UOM"
                        value={values?.fgUomName}
                        name="fgUomName"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Customer"
                        options={customerDDL}
                        value={values?.customer}
                        name="customer"
                        onChange={(valueOption) => {
                          setFieldValue('customer', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <h2 className="mt-3">Material Cost</h2>
                <CommonTable headersData={tblMaterialCostHeaders}>
                  <tbody>
                    {productPreCostingData?.precostingMaterial?.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.materialItemName}
                          </td>
                          <td className="text-center">{item?.uomName}</td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.conversion || ''
                              }
                              name="conversion"
                              style={{ fontSize: '10px' }}
                              onChange={(e) => {
                                const itemModify = {
                                  ...item,
                                  [e.target.name]: e.target.value,
                                };
                                rowCalculationFunc({
                                  item: itemModify,
                                  productPreCostingData,
                                  index,
                                  setProductPreCostingData,
                                });
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.percentigeInput || ''
                              }
                              name="percentigeInput"
                              style={{ fontSize: '10px' }}
                              onChange={(e) => {
                                const itemModify = {
                                  ...item,
                                  [e.target.name]: e.target.value,
                                };
                                rowCalculationFunc({
                                  item: itemModify,
                                  productPreCostingData,
                                  index,
                                  setProductPreCostingData,
                                });
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.yield || ''
                              }
                              name="yield"
                              style={{ fontSize: '10px' }}
                              placeholder=""
                              onChange={(e) => {
                                const itemModify = {
                                  ...item,
                                  [e.target.name]: e.target.value,
                                };
                                rowCalculationFunc({
                                  item: itemModify,
                                  productPreCostingData,
                                  index,
                                  setProductPreCostingData,
                                });
                              }}
                            />
                          </td>
                          <td className="text-center">
                            {item?.requiredQty
                              ? item?.requiredQty?.toFixed(4)
                              : ''}
                          </td>
                          <td className="text-center">
                            {item?.currentInvQty || ''}
                          </td>
                          <td className="text-center">
                            {item?.currentInvRate || ''}
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.newQty || ''
                              }
                              name="newQty"
                              style={{ fontSize: '10px' }}
                              onChange={(e) => {
                                const itemModify = {
                                  ...item,
                                  [e.target.name]: e.target.value,
                                };
                                rowCalculationFunc({
                                  item: itemModify,
                                  productPreCostingData,
                                  index,
                                  setProductPreCostingData,
                                });
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.newPrice || ''
                              }
                              name="newPrice"
                              style={{ fontSize: '10px' }}
                              onChange={(e) => {
                                const itemModify = {
                                  ...item,
                                  [e.target.name]: e.target.value,
                                };
                                rowCalculationFunc({
                                  item: itemModify,
                                  productPreCostingData,
                                  index,
                                  setProductPreCostingData,
                                });
                              }}
                            />
                          </td>
                          <td className="text-center">
                            {item?.currentCost
                              ? item?.currentCost?.toFixed(2)
                              : ''}
                          </td>
                          <td className="text-center">
                            {item?.newCost ? item?.newCost?.toFixed(2) : ''}
                          </td>
                          <td className="text-center">
                            {item?.averageCost
                              ? item?.averageCost?.toFixed(2)
                              : ''}
                          </td>
                        </tr>
                      ),
                    )}
                    <tr>
                      <td colSpan={11}>
                        {' '}
                        <strong>Total RM Price</strong>
                      </td>
                      <td>
                        {totalCurrentCost ? totalCurrentCost?.toFixed(2) : ''}
                      </td>
                      <td>{totalNewCost ? totalNewCost?.toFixed(2) : ''}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={12}>
                        {' '}
                        <strong>Total Material Cost by SKU</strong>
                      </td>
                      <td>
                        {totalNewCost
                          ? (
                              totalNewCost * values?.finishGood?.conversion
                            ).toFixed(2)
                          : ''}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </CommonTable>

                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <IInput
                        value={values?.packingMaterial || ''}
                        name="packingMaterial"
                        label="Packing Material"
                        type="number"
                        onChange={(e) => {
                          setFieldValue('packingMaterial', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput
                        value={values?.manufacturingOverhead || ''}
                        name="manufacturingOverhead"
                        label="Manufaturing Overhead"
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            'manufacturingOverhead',
                            e.target.value,
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-6">
                      {/* <IInput
                        value={values?.totalManufacturingCost || ""}
                        name="totalManufacturingCost"
                        label="Total Manufaturing Cost"
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            "totalManufacturingCost",
                            e.target.value
                          );
                        }}
                      /> */}
                      <h5 className="mt-6">
                        Total Manufacturing Cost:{' '}
                        {totalNewCost
                          ? (
                              totalNewCost * values?.finishGood?.conversion +
                                (+values?.packingMaterial ||
                                  0 + +values?.manufacturingOverhead) || 0
                            ).toFixed(2)
                          : ''}
                      </h5>
                    </div>
                  </div>
                </div>
                <h2 className="mt-3"> Cost Component</h2>
                <CommonTable headersData={tblCostComponentHeaders}>
                  <tbody>
                    {productPreCostingData?.precostingOverhead?.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-left">{item?.costElementName}</td>
                          <td className="text-left">
                            <IInput
                              value={item?.costElementMultiplier || ''}
                              name="costElementMultiplier"
                              style={{ fontSize: '10px' }}
                              onChange={(e) => {
                                costElementAmountHandler(
                                  index,
                                  'costElementMultiplier',
                                  e.target.value,
                                );
                              }}
                            />
                          </td>
                          <td className="text-left">
                            <IInput
                              value={item?.costElementMultiplicand || ''}
                              name="costElementMultiplicand"
                              style={{ fontSize: '10px' }}
                              onChange={(e) => {
                                costElementAmountHandler(
                                  index,
                                  'costElementMultiplicand',
                                  e.target.value,
                                );
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingOverhead[index]
                                  ?.costElementAmount || ''
                              }
                              name="costElementAmount"
                              style={{ fontSize: '10px' }}
                              // onChange={(e) => {
                              //   costElementAmountHandler(
                              //     index,
                              //     "costElementAmount",
                              //     e.target.value
                              //   );
                              // }}
                              disabled
                            />
                          </td>
                        </tr>
                      ),
                    )}

                    <tr>
                      <td colSpan={4}>
                        {' '}
                        <strong>Total Period Cost</strong>
                      </td>
                      <td>
                        {totalPeriodCost ? totalPeriodCost?.toFixed(2) : ''}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        {' '}
                        <strong>Total Overhead</strong>
                      </td>
                      <td>
                        {(() => {
                          const totalOverhead = (
                            totalPeriodCost +
                            +values?.packingMaterial +
                            +values?.manufacturingOverhead
                          ).toFixed(2);
                          return isNaN(totalOverhead) ? '0' : totalOverhead;
                        })()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        {' '}
                        <strong>Total Cost</strong>
                      </td>
                      <td>
                        {(() => {
                          const totalCost = (
                            totalNewCost * +values?.finishGood?.conversion +
                            (+values?.packingMaterial +
                              +values?.manufacturingOverhead) +
                            totalPeriodCost
                          ).toFixed(2);

                          return isNaN(totalCost) ? '0' : totalCost;
                        })()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        {' '}
                        <strong>Mark-Up / Profit</strong>
                      </td>
                      <td>
                        <div className="d-flex">
                          <IInput
                            value={values?.markupOrProfit || ''}
                            name="markupOrProfit"
                            style={{ fontSize: '10px' }}
                            onChange={(e) => {
                              setFieldValue('markupOrProfit', e.target.value);
                            }}
                          />
                          <p>
                            {(() => {
                              const markupValue = +values?.markupOrProfit / 100;
                              const packingMaterialValue =
                                +values?.packingMaterial || 0;
                              const manufacturingOverheadValue =
                                +values?.manufacturingOverhead || 0;
                              const totalCostConversion =
                                totalNewCost *
                                (values?.finishGood?.conversion || 0); // Ensure conversion is treated as a number

                              const result =
                                (totalCostConversion +
                                  packingMaterialValue +
                                  manufacturingOverheadValue +
                                  totalPeriodCost) *
                                markupValue;

                              return (result || 0).toFixed(2); // Return the result formatted to two decimal places
                            })()}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <strong>Product Price</strong>
                      </td>
                      <td>
                        {(() => {
                          const markupValue = +values?.markupOrProfit / 100;
                          const packingMaterialValue =
                            +values?.packingMaterial || 0;
                          const manufacturingOverheadValue =
                            +values?.manufacturingOverhead || 0;
                          const totalCostConversion =
                            totalNewCost *
                            (values?.finishGood?.conversion || 0); // Ensure conversion is treated as a number
                          const totallll =
                            totalCostConversion +
                            packingMaterialValue +
                            manufacturingOverheadValue +
                            totalPeriodCost;
                          const markupProfit =
                            (totalCostConversion +
                              packingMaterialValue +
                              manufacturingOverheadValue +
                              totalPeriodCost) *
                            markupValue;

                          const result = totallll + markupProfit;
                          return (result || 0)?.toFixed(2) || ''; // Return the result formatted to two decimal places
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </CommonTable>

                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: 'none' }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
