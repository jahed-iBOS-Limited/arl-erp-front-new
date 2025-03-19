import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import {
  _formatMoney,
  _formatMoneyWithDoller,
} from '../../../_chartinghelper/_formatMoney';
import { getDifference } from '../../../_chartinghelper/_getDateDiff';
import FormikInput from '../../../_chartinghelper/common/formikInput';
import { getOwnerBankInfoDetailsById } from '../helper';
import { BankInfoComponent } from './bankInfoComponent';
import './style.css';

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

export default function EditInvoiceForOwner({
  invoiceHireData,
  formikprops,
  rowData,
  rowDtoHandler,
  addHandler,
  deleteHandler,
  setRowData,
  offHireDuration,
}) {
  const [bankInfoData, setBankInfoData] = useState();
  let duration = 0;

  const { values, errors, touched, setFieldValue } = formikprops;

  const calculateDuration = (dateDiff) => {
    duration = Number((dateDiff - offHireDuration).toFixed(4));
  };

  /* Bank Info & Prev Hire API */
  useEffect(() => {
    if (values?.beneficiary?.value) {
      getOwnerBankInfoDetailsById(values?.beneficiary?.value, setBankInfoData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.beneficiary?.value]);

  useEffect(() => {
    setFieldValue('beneficiary', { ...values?.beneficiary, ...bankInfoData });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankInfoData]);

  let totalCredit = 0;
  let totalDebit = 0;

  return (
    <div className="p-4 transactionInvoice">
      {/* <div className="timeCharterLogo">
        <img src={akijShippingLogo} alt={akijShippingLogo} />
      </div> */}
      <h5 className="text-center uppercase mb-4">
        {values?.transactionName?.label} STATEMENT
      </h5>

      {/* First Section Header */}
      <div className="row">
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">VESSEL & VOYAGE :</div>
          <div className="headerValue">{`${invoiceHireData?.vesselName} & V${invoiceHireData?.voyageNo}`}</div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">DATE OF INVOICE :</div>
          <div className="headerValue">{values?.transactionDate}</div>
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">OWNER :</div>
          <div className="headerValue">{invoiceHireData?.ownerName}</div>
        </div>
        <div className="col-lg-6 headerWrapper">
          {invoiceHireData?.refNo ? (
            <>
              <div className="headerKey">REF :</div>
              <div className="headerValue">{invoiceHireData?.refNo || ''}</div>
            </>
          ) : null}
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">CHTR :</div>
          <div className="headerValue">{invoiceHireData?.chtrName}</div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">DUE DATE :</div>
          <div className="headerValue">
            <FormikInput
              value={values?.dueDate}
              name="dueDate"
              placeholder="Due Date"
              type="date"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
      </div>

      {/* 2nd Section Header */}
      <div className="row my-4">
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">DELIVERY :</div>
          <div className="headerValue">
            {moment(invoiceHireData?.deliveryDate).format('MM-DD-YYYY HH:mm A')}
          </div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">START PORT :</div>
          <div className="headerValue">{invoiceHireData?.startPortName}</div>
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">REDELIVERY :</div>
          <div className="headerValue">
            <FormikInput
              value={values?.redeliveryDate}
              name="redeliveryDate"
              placeholder="Redelivery Date"
              type="datetime-local"
              onChange={(e) => {
                setFieldValue('redeliveryDate', e.target.value);
                const copy = [...rowData];
                let diffDate = parseFloat(
                  getDifference(
                    moment(invoiceHireData?.deliveryDate).format(
                      'YYYY-MM-DDTHH:mm:ss',
                    ),
                    e.target.value,
                  ),
                );
                calculateDuration(diffDate);
                const newArr = copy?.map((item) => {
                  if (item?.key === 'hdto') {
                    return {
                      ...item,
                      duration: duration,
                      credit: duration * invoiceHireData?.dailyHire,
                    };
                  }
                  if (item?.key === 'hac') {
                    return {
                      ...item,
                      duration: duration,
                      debit:
                        duration *
                        invoiceHireData?.dailyHire *
                        (invoiceHireData?.comm / 100),
                    };
                  }
                  if (item?.key === 'cve') {
                    return {
                      ...item,
                      duration: duration,
                      credit: ((12 * invoiceHireData?.cveday) / 365) * duration,
                      // (duration * invoiceHireData?.cveday) / 30,
                    };
                  }
                  if (item?.key === 'hbc') {
                    return {
                      ...item,
                      duration: duration,
                      debit:
                        duration *
                        invoiceHireData?.dailyHire *
                        (invoiceHireData?.brokerage / 100),
                    };
                  }
                  return item;
                });

                setRowData(newArr);
              }}
              min={moment(invoiceHireData?.deliveryDate).format(
                'YYYY-MM-DDTHH:mm:ss',
              )}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">END PORT :</div>
          <div className="headerValue">{invoiceHireData?.endPortName}</div>
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">TOTAL DURATION :</div>
          <div className="headerValue">
            {getDifference(
              moment(invoiceHireData?.deliveryDate).format(
                'YYYY-MM-DDTHH:mm:ss',
              ),
              values?.redeliveryDate,
            )}
          </div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">DAILY HIRE :</div>
          <div className="headerValue">
            {_formatMoney(invoiceHireData?.dailyHire)} USD
          </div>
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">BROKERAGE :</div>
          <div className="headerValue">{invoiceHireData?.brokerage}%</div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">ILOHC :</div>
          <div className="headerValue">
            {_formatMoney(invoiceHireData?.ilohc)} USD
          </div>
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">ADD COMM :</div>
          <div className="headerValue">{invoiceHireData?.comm}%</div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">C/V/E /DAYS :</div>
          <div className="headerValue">
            {_formatMoney(invoiceHireData?.cveday)} USD
          </div>
        </div>

        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">LSFO PRICE/MT :</div>
          <div className="headerValue">
            {_formatMoney(invoiceHireData?.lsfoprice)} USD
          </div>
        </div>
        <div className="col-lg-6 headerWrapper">
          <div className="headerKey">LSMGO PR/MT :</div>
          <div className="headerValue">
            {_formatMoney(invoiceHireData?.lsmgoprice)} USD
          </div>
        </div>
      </div>

      {/* Row And Table Section */}
      {/* <div className="table-responsive"> */}
      <table className="table mt-3 bj-table bj-table-landing">
        <thead>
          <tr
            style={{ borderTop: '1px solid #d6d6d6' }}
            className="text-center"
          >
            <th>SR.</th>
            <th>DESCRIPTION</th>
            <th>Duration</th>
            <th>Quantity</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => {
            if (item?.isChecked) {
              totalCredit = totalCredit + Number(item?.credit);
            }
            if (item?.isChecked) {
              totalDebit = totalDebit + Number(item?.debit);
            }

            return (
              <tr key={index}>
                {/* SL */}
                <td
                  className={`${
                    item?.isChecked ? 'isCheckedTrue' : 'isCheckedFalse'
                  } text-center`}
                >
                  {index + 1}
                </td>

                {/* Description */}
                <td
                  className={`${
                    item?.isChecked ? 'isCheckedTrue' : 'isCheckedFalse'
                  }`}
                >
                  {item?.isDescription ? (
                    <FormikInput
                      value={item?.description}
                      name={`${index}description${values?.transactionName?.value}`}
                      placeholder="Description"
                      type="text"
                      onChange={(e) =>
                        rowDtoHandler(
                          index,
                          item?.isDescription?.name,
                          e.target.value,
                          item,
                          rowData,
                        )
                      }
                      errors={errors}
                      touched={touched}
                      disabled={!item?.isChecked}
                    />
                  ) : (
                    item?.description
                  )}
                </td>

                {/* Duration */}
                <td
                  className={`${
                    item?.isChecked ? 'isCheckedTrue' : 'isCheckedFalse'
                  } text-center`}
                  style={{ width: '150px' }}
                >
                  {item?.isDuration ? (
                    <div className="d-flex align-items-center">
                      <FormikInput
                        className="mr-2"
                        value={item?.duration}
                        name={`${index}duration${values?.transactionName?.value}`}
                        placeholder=""
                        type="number"
                        onChange={(e) =>
                          rowDtoHandler(
                            index,
                            item?.isDuration?.name,
                            e.target.value,
                            item,
                            rowData,
                          )
                        }
                        errors={errors}
                        touched={touched}
                        disabled={!item?.isChecked}
                      />
                      <span>DAYS</span>
                    </div>
                  ) : item?.duration > 0 ? (
                    item.duration
                  ) : null}
                </td>

                {/* Quantity */}
                <td
                  className={`${
                    item?.isChecked ? 'isCheckedTrue' : 'isCheckedFalse'
                  }`}
                  style={{ width: '150px' }}
                >
                  {item?.isQty ? (
                    <div className="d-flex align-items-center">
                      <FormikInput
                        className="mr-2"
                        value={item?.quantity}
                        name={`${index}quantity${values?.transactionName?.value}`}
                        placeholder=""
                        type="number"
                        onChange={(e) =>
                          rowDtoHandler(
                            index,
                            item?.isQty?.name,
                            e.target.value,
                            item,
                            rowData,
                          )
                        }
                        errors={errors}
                        touched={touched}
                        disabled={!item?.isChecked}
                      />
                      <span>MT</span>
                    </div>
                  ) : null}
                </td>

                {/* Debit | But Debit Will be Credit for Owner */}
                <td
                  className={`${
                    item?.isChecked ? 'isCheckedTrue' : 'isCheckedFalse'
                  } text-right`}
                  style={{ width: '150px' }}
                >
                  {item?.isCredit ? (
                    <div className="d-flex align-items-center">
                      <FormikInput
                        className="mr-2"
                        onChange={(e) => {
                          rowDtoHandler(
                            index,
                            item?.isCredit?.name,
                            e.target.value,
                            item,
                            rowData,
                          );
                        }}
                        value={item?.credit}
                        name={`${index}credit${values?.transactionName?.value}`}
                        placeholder=""
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={!item?.isChecked}
                      />
                      <span>USD</span>
                    </div>
                  ) : (
                    _formatMoneyWithDoller(item?.credit?.toFixed(2))
                  )}
                </td>

                {/* Credit | But Credit Will be Debit For Owner */}
                <td
                  className={`${
                    item?.isChecked ? 'isCheckedTrue' : 'isCheckedFalse'
                  } text-right`}
                  style={{ width: '150px' }}
                >
                  {item?.isDebit ? (
                    <div className="d-flex align-items-center">
                      <FormikInput
                        className="mr-2"
                        value={item?.debit}
                        name={`${index}debit${values?.transactionName?.value}`}
                        placeholder=""
                        type="number"
                        onChange={(e) =>
                          rowDtoHandler(
                            index,
                            item?.isDebit?.name,
                            e.target.value,
                            item,
                            rowData,
                          )
                        }
                        errors={errors}
                        touched={touched}
                        disabled={!item?.isChecked}
                      />
                      <span>USD</span>
                    </div>
                  ) : (
                    _formatMoneyWithDoller(item?.debit?.toFixed(2))
                  )}
                </td>

                {/* Actions */}
                <td className="text-center" style={{ width: '80px' }}>
                  {/* Add Handler | add btn */}
                  <span
                    onClick={() => {
                      addHandler(index);
                    }}
                  >
                    <i
                      style={{ fontSize: '16px' }}
                      className="fa fa-plus-square text-primary mr-2"
                    />
                  </span>

                  {/* Check box */}
                  <span>
                    <input
                      type="checkbox"
                      checked={item?.isChecked}
                      disabled={item?.isFixed}
                      onChange={(e) => {
                        rowDtoHandler(
                          index,
                          'isChecked',
                          e.target.checked,
                          item,
                          rowData,
                        );
                      }}
                    />
                  </span>

                  {/* Delete if new row */}
                  {item?.isDescription &&
                  item?.isDuration &&
                  item?.isCredit &&
                  item?.isDebit &&
                  item?.isQty ? (
                    <>
                      <span
                        onClick={() => {
                          deleteHandler(index);
                        }}
                      >
                        <i
                          style={{ fontSize: '14px' }}
                          className="fa fa-trash text-danger ml-2"
                        />
                      </span>
                    </>
                  ) : null}
                </td>
              </tr>
            );
          })}

          {/* Total Section */}
          <tr>
            <td colSpan="4" className="text-right mr-3">
              <strong>Total</strong>
            </td>
            {/* Credit Here For Owner */}
            <td className="text-right">
              <strong>
                {_formatMoneyWithDoller(Number(totalCredit)?.toFixed(2)) || 0}
              </strong>
            </td>

            {/* Debit Here For Owner */}
            <td className="text-right">
              <strong>
                {_formatMoneyWithDoller(Number(totalDebit)?.toFixed(2)) || 0}
              </strong>
            </td>
            <td className="text-center"></td>
          </tr>

          {/* Net Payable */}
          <tr>
            <td colSpan="4" className="text-right mr-3">
              <strong>AMOUNT PAYABLE TO OWNERS</strong>
            </td>
            <td colSpan="2" className="text-right">
              <strong>
                {_formatMoneyWithDoller(
                  (
                    Number(totalCredit)?.toFixed(2) -
                    Number(totalDebit)?.toFixed(2)
                  ).toFixed(2),
                ) || 0}
              </strong>
            </td>
            <td></td>
          </tr>

          {/* In Word USD */}
          {(
            Number(totalCredit)?.toFixed(2) - Number(totalDebit)?.toFixed(2)
          ).toFixed(2) ? (
            <tr>
              <td colSpan="7" className="text-center">
                <div>
                  <strong>
                    {`(In Word USD) ${toWords.convert(
                      (
                        Number(totalCredit)?.toFixed(2) -
                        Number(totalDebit)?.toFixed(2)
                      ).toFixed(2),
                    )}`}
                  </strong>
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {/* </div> */}

      {/* Bank Info Section */}
      <BankInfoComponent data={bankInfoData} />
    </div>
  );
}
