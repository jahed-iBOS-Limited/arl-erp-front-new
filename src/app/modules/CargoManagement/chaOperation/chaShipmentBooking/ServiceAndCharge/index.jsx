import axios from 'axios';
import { Form, Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import './style.css';

const validationSchema = Yup.object().shape({});

function ServiceAndCharge({ clickRowDto, CB }) {
  const formikRef = React.useRef(null);
  const [
    shippingHeadOfCharges,
    getShippingHeadOfCharges,
    shippingHeadOfChargesLoading,
    setShippingHeadOfCharges,
  ] = useAxiosGet();
  const [, getBookedRequestBillingData, bookedRequestBillingDataLoading] =
    useAxiosGet();
  const [, getSaveBookedRequestBilling, bookedRequestBilling] = useAxiosPost();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  React.useEffect(() => {
    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges?typeId=2`,
      (resShippingHeadOfCharges) => {
        getBookedRequestBillingData(
          `${imarineBaseUrl}/domain/CHAShipment/GetChaServiceChargeData?ChabookingId=${clickRowDto?.chabookingId}`,
          (resSveData) => {
            const arryList = [];
            if (resShippingHeadOfCharges?.length > 0) {
              resShippingHeadOfCharges.forEach((item) => {
                const saveHeadOfChargeList =
                  resSveData?.filter(
                    (findItem) => findItem?.headOfChargeId === item?.value,
                  ) || [];

                if (saveHeadOfChargeList?.length > 0) {
                  saveHeadOfChargeList.forEach((saveItem) => {
                    const obj = {
                      ...item,
                      ...saveItem,
                      collectionRate: saveItem?.collectionRate || '',
                      collectionQty: saveItem?.collectionQty || '',
                      collectionAmount: saveItem?.collectionAmount || '',
                      paymentRate: saveItem?.paymentRate || '',
                      paymentQty: saveItem?.paymentQty || '',
                      paymentAmount: saveItem?.paymentAmount || '',
                      party: saveItem?.partyName || '',
                      partyId: saveItem?.partyId || 0,
                      checked: saveItem ? true : false,
                    };
                    arryList.push(obj);
                  });
                } else {
                  const obj = {
                    ...item,
                    headOfCharges: item?.label || '',
                    headOfChargeId: item?.value || 0,
                  };
                  arryList.push(obj);
                }
              });
              setShippingHeadOfCharges([...arryList]);
            }
          },
        );
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {
    const payloadList = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          serviceChargeId: item?.serviceChargeId || 0,
          bookingId: clickRowDto?.chabookingId || 0,
          headOfChargeId: item?.headOfChargeId || 0,
          headOfCharges: item?.headOfCharges || '',
          collectionRate: item?.collectionRate || 0,
          collectionQty: item?.collectionQty || 0,
          collectionAmount: item?.collectionAmount || 0,
          paymentRate: item?.paymentRate || 0,
          paymentQty: item?.paymentQty || 0,
          paymentAmount: item?.paymentAmount || 0,
          partyId: item?.partyId || 0,
          partyName: item?.party || '',
          isActive: true,
          createdBy: profileData?.userId || 0,
          createdAt: new Date(),
          serviceChargeDate: new Date(),
          // item?.serviceChargeId then updateBy
          ...(item?.serviceChargeId && {
            updatedAt: new Date(),
            updatedBy: profileData?.userId || 0,
          }),
        };
      });

    // ----------end verify -------------
    if (payloadList.length === 0) {
      return toast.warn('Please select at least one charge');
    }
    const validateAttributes = (payloadList, attributeLabels) => {
      for (const [attr, label] of Object.entries(attributeLabels)) {
        const emptyItem = payloadList?.find((item) => !item[attr]);
        if (emptyItem) {
          toast.warn(
            `Please enter ${label} for "${emptyItem?.headOfCharges}" Attribute`,
          );
          return false;
        }
      }
      return true;
    };
    // all attributes to check
    const attributesToCheck = {
      // collectionRate: 'Collection Rate',
      // collectionQty: 'Collection Qty',
      // collectionAmount: 'Collection Amount',
      // paymentRate: 'Payment Rate',
      // paymentQty: 'Payment Qty',
      // paymentAmount: 'Payment Amount',
      // partyName: 'Party',
    };
    if (!validateAttributes(payloadList, attributesToCheck)) return;
    // ----------end verify -------------

    getSaveBookedRequestBilling(
      `${imarineBaseUrl}/domain/CHAShipment/SaveOrUpdateChaServiceAndCharge`,
      payloadList,
      CB,
    );
  };

  const commonRowHandler = ({ index, key, value }) => {
    const prvShippingHeadOfCharges = [...shippingHeadOfCharges];
    prvShippingHeadOfCharges[index][key] = value;

    const collectionRate =
      +prvShippingHeadOfCharges[index]?.collectionRate || 0;
    const collectionQty = +prvShippingHeadOfCharges[index]?.collectionQty || 0;
    const collectionAmount = collectionRate * collectionQty;
    prvShippingHeadOfCharges[index].collectionAmount = collectionAmount;

    const paymentRate = +prvShippingHeadOfCharges[index]?.paymentRate || 0;
    const paymentQty = +prvShippingHeadOfCharges[index]?.paymentQty || 0;
    const paymentAmount = paymentRate * paymentQty;
    prvShippingHeadOfCharges[index].paymentAmount = paymentAmount;

    setShippingHeadOfCharges(prvShippingHeadOfCharges);
  };

  return (
    <div className="chargesModal">
      {(bookedRequestBilling ||
        shippingHeadOfChargesLoading ||
        bookedRequestBillingDataLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          collectionRate: '',
          collectionQty: '',
          collectionAmount: '',
          paymentRate: '',
          paymentQty: '',
          paymentAmount: '',
          party: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <Form className="form form-label-right">
            <div className="">
              {/* Save button add */}
              <>
                <div className="d-flex justify-content-end mt-2">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </>
            </div>

            <div className="table-responsive">
              <table className="table global-table">
                <thead>
                  <tr>
                    <th rowspan="2"></th>
                    <th rowspan="2">SL</th>
                    <th rowspan="2">Description</th>

                    <th colspan="3" className="group-header collection-header">
                      Collection
                    </th>
                    <th colspan="4" className="group-header payment-header">
                      Payment
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        minWidth: '150px',
                      }}
                      className="collection-header"
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        minWidth: '150px',
                      }}
                      className="collection-header"
                    >
                      QTY
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                      className="collection-header"
                    >
                      Amount
                    </th>

                    <th
                      style={{
                        minWidth: '150px',
                      }}
                      className="payment-header"
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        minWidth: '150px',
                      }}
                      className="payment-header"
                    >
                      QTY
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                      className="payment-header"
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        width: '220px',
                      }}
                      className="payment-header"
                    >
                      Party
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shippingHeadOfCharges?.map((item, index) => {
                    const isDisabled = !item?.checked;
                    return (
                      <tr key={index}>
                        <td>
                          <input
                            disabled={item?.serviceChargeId}
                            type="checkbox"
                            checked={item?.checked}
                            onChange={(e) => {
                              setShippingHeadOfCharges(
                                shippingHeadOfCharges?.map((data) => {
                                  if (data?.value === item?.value) {
                                    return {
                                      ...data,
                                      checked: e?.target?.checked,
                                      collectionRate: e?.target?.checked
                                        ? item?.collectionRate
                                        : '',
                                      collectionQty: e?.target?.checked
                                        ? item?.collectionQty
                                        : '',
                                      collectionAmount: e?.target?.checked
                                        ? item?.collectionAmount
                                        : '',
                                      paymentRate: e?.target?.checked
                                        ? item?.paymentRate
                                        : '',
                                      paymentQty: e?.target?.checked
                                        ? item?.paymentQty
                                        : '',
                                      paymentAmount: e?.target?.checked
                                        ? item?.paymentAmount
                                        : '',
                                      party: e?.target?.checked
                                        ? item?.party
                                        : '',
                                      partyId: e?.target?.checked
                                        ? item?.partyId
                                        : 0,
                                    };
                                  }
                                  return data;
                                }),
                              );
                            }}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{item?.headOfCharges}</td>

                        {/* Collection Rate */}
                        <td className="collection-border-right">
                          <InputField
                            name="collectionRate"
                            value={item?.collectionRate}
                            type="number"
                            onChange={(e) => {
                              commonRowHandler({
                                index,
                                key: 'collectionRate',
                                value: e.target.value,
                              });
                            }}
                            min={0}
                            step="any"
                            disabled={isDisabled}
                          />
                        </td>
                        {/* Collection QTY */}
                        <td className="collection-border-right">
                          <InputField
                            name="collectionQty"
                            value={item?.collectionQty}
                            type="number"
                            onChange={(e) => {
                              commonRowHandler({
                                index,
                                key: 'collectionQty',
                                value: e.target.value,
                              });
                            }}
                            min={0}
                            step="any"
                            disabled={isDisabled}
                          />
                        </td>
                        {/* Collection Amount */}
                        <td className="collection-border-right text-right">
                          {item?.collectionAmount}
                        </td>
                        {/* Payment Rate */}
                        <td className="collection-border-right">
                          <InputField
                            name="paymentRate"
                            value={item?.paymentRate}
                            type="number"
                            onChange={(e) => {
                              commonRowHandler({
                                index,
                                key: 'paymentRate',
                                value: e.target.value,
                              });
                            }}
                            min={0}
                            step="any"
                            disabled={isDisabled}
                          />
                        </td>
                        {/* Payment QTY */}
                        <td className="collection-border-right">
                          <InputField
                            name="paymentQty"
                            value={item?.paymentQty}
                            type="number"
                            onChange={(e) => {
                              commonRowHandler({
                                index,
                                key: 'paymentQty',
                                value: e.target.value,
                              });
                            }}
                            min={0}
                            step="any"
                            disabled={isDisabled}
                          />
                        </td>
                        {/* Payment Amount */}
                        <td className="collection-border-right text-right">
                          {item?.paymentAmount}
                        </td>
                        {/* Party */}
                        <td className="payment-border-right">
                          <SearchAsyncSelect
                            isDisabled={isDisabled}
                            selectedValue={
                              item?.party
                                ? {
                                    label: item?.party,
                                    value: item?.partyId || 0,
                                  }
                                : ''
                            }
                            handleChange={(valueOption) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].party = valueOption?.label;
                              copyPrv[index].partyId = valueOption?.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            loadOptions={(v) => {
                              let url = `${imarineBaseUrl}/domain/Stakeholder/GetBusinessPartnerDDL?search=${v}&accountId=1&businessUnitId=${selectedBusinessUnit?.value}`;
                              if (v?.length < 2) return [];
                              return axios.get(url).then((res) => res?.data);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ServiceAndCharge;
