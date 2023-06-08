import React from "react";
import NewSelect from "../../../../_helper/_select";
import { Field, Form, Formik } from "formik";
import InputField from "../../../../_helper/_inputField";
import TableRowCreatePage from "../Table/TableRowCreatePage";
import { useState } from "react";
import { useEffect } from "react";
import {
  getAllItemDetails,
  getItemNameDDL,
  getSingleItemDetails,
} from "../helper/helper";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import TableRowEditPage from "../Table/TableRowEditPage";
import { _formatMoney } from "../../../../_helper/_formatMoney";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  fiscalYearDDL,
  partnerDDL,
  salesInvoiceDDL,
  singleItem,
  setRowDto,
  rowDto,
  rowDtoHandler,
  deleteHandler,
  isEdit,
  total,
  partnerDDLChangeFunc,
}) {
  const [headerId, setHeaderId] = useState("");
  const [itemNameDDL, setItemNameDDL] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [allItemDetails, setAllItemDetails] = useState([]);

  const rowDataAddHandler = (values, setFieldValue) => {
    if (values.checkAllItem === false) {
      const isExist = rowDto.find(
        (data) => data.itemName === values?.itemName?.label
      );
      if (isExist) {
        toast.warning("Item already added");
      } else {
        if (itemDetails?.length > 0) {
          setRowDto([
            ...rowDto,
            {
              itemId: itemDetails[0]?.taxItemGroupId,
              itemName: itemDetails[0]?.taxItemGroupName,
              uomId: itemDetails[0]?.uomid,
              uom: itemDetails[0]?.uomname,
              salesQty: itemDetails[0]?.quantity,
              salesAmount: itemDetails[0]?.subTotal,
              salesSd: itemDetails[0]?.sdtotal,
              salesVat: itemDetails[0]?.vatTotal,
              increaseQty: 0,
              increaseVat: 0,
              increaseSd: 0,
            },
          ]);
        } else {
          toast.warning("Data not found");
        }
      }
    } else {
      if (allItemDetails?.length > 0) {
        let data = allItemDetails?.map((item) => {
          return {
            itemId: item.taxItemGroupId,
            itemName: item.taxItemGroupName,
            uomId: item.uomid,
            uom: item.uomname,
            salesQty: item.quantity,
            salesAmount: item.subTotal,
            salesSd: item.sdtotal,
            salesVat: item.vatTotal,
            increaseQty: 0,
            increaseVat: 0,
            increaseSd: 0,
          };
        });
        setRowDto([]);
        setRowDto(data);
      } else {
        toast.warning("Data not found");
      }
    }
  };

  useEffect(() => {
    getItemNameDDL(headerId, setItemNameDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerId]);

  useEffect(() => {
    if (isEdit) {
      getItemNameDDL(singleItem?.taxSalesId, setItemNameDDL);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getItemNameDDL]);

  // console.log(itemDetails);

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <Formik
            enableReinitialize={true}
            initialValues={initData}
            //   validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              saveHandler(values, () => {
                resetForm(initData);
              });
            }}
          >
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-3">
                      {isEdit ? (
                        <InputField
                          name="partner"
                          value={singleItem?.strSoldtoPartnerName}
                          placeholder="Partner Name"
                          label="Partner Name"
                          disabled={isEdit}
                        />
                      ) : (
                        <NewSelect
                          name="partner"
                          options={partnerDDL}
                          value={values?.partner}
                          onChange={(valueOption) => {
                            setFieldValue("partner", valueOption);
                            setFieldValue("salesInvoice", "");
                            partnerDDLChangeFunc(valueOption?.value);
                          }}
                          errors={errors}
                          placeholder="Partner (sales)"
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      )}
                    </div>
                    <div className="col-lg-3">
                      {isEdit ? (
                        <InputField
                          name="strTaxSalesCode"
                          label="Sales Invoice"
                          value={singleItem?.strTaxSalesCode}
                          placeholder="Sales Invoice"
                          disabled={isEdit}
                        />
                      ) : (
                        <NewSelect
                          name="salesInvoice"
                          options={salesInvoiceDDL}
                          value={values?.salesInvoice}
                          onChange={(valueOption) => {
                            setFieldValue("salesInvoice", valueOption);
                            setHeaderId(valueOption?.value);
                            setFieldValue("itemName", "");
                          }}
                          placeholder="Sales Invoice"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      )}
                    </div>
                    <div className="col-lg-3">
                      {isEdit ? (
                        <InputField
                          name="fiscalYear"
                          label="fiscalYear"
                          value={singleItem?.fiscalYear}
                          disabled={isEdit}
                        />
                      ) : (
                        <NewSelect
                          name="fiscalYear"
                          options={fiscalYearDDL}
                          value={values?.fiscalYear}
                          onChange={(valueOption) => {
                            setFieldValue("fiscalYear", valueOption);
                          }}
                          placeholder="Fiscal Year"
                          errors={errors}
                          touched={touched}
                        />
                      )}
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Transaction Date"
                        value={
                          !isEdit
                            ? values?.transactionDate
                            : _dateFormatter(singleItem?.dteLastActionDateTime)
                        }
                        name="transactionDate"
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemName"
                        options={itemNameDDL}
                        value={values?.itemName}
                        onChange={(valueOption) => {
                          setFieldValue("itemName", valueOption);
                          getSingleItemDetails(
                            valueOption?.value,
                            values?.salesInvoice?.value,
                            setItemDetails
                          );
                          getAllItemDetails(
                            values?.salesInvoice?.value,
                            setAllItemDetails
                          );
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={values.checkAllItem === true ? true : false}
                      />
                    </div>
                    <div className="col-lg-2 d-flex justify-content-center align-items-center mt-3">
                      {!isEdit && (
                        <div>
                          <label className="p-2"> All item</label>
                          <Field
                            className="p-2"
                            type="checkbox"
                            name="checkAllItem"
                            checked={values?.checkAllItem || ""}
                            onChange={() =>
                              setFieldValue(
                                "checkAllItem",
                                !values?.checkAllItem
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-lg-3 pt-5">
                      <button
                        disabled={
                          !values.partner ||
                          !values.salesInvoice ||
                          (!values.itemName && !values.checkAllItem) ||
                          !values.transactionDate ||
                          !values.fiscalYear
                        }
                        className="btn btn-primary"
                        type="button"
                        onClick={() => rowDataAddHandler(values, setFieldValue)}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ display: "none" }}
                    ref={btnRef}
                    onSubmit={() => handleSubmit()}
                  ></button>

                  <button
                    type="reset"
                    style={{ display: "none" }}
                    ref={resetBtnRef}
                    onSubmit={() => resetForm(initData)}
                  ></button>

                  {/* This Total Is Implement By Multiplication with salesAmount * salesQty  */}
                  {total > 0 && (
                    <div className="text-right d-flex justify-content-end align-center">
                      <span style={{ fontSize: "1.2rem" }}>Total:</span>
                      <span
                        style={{ fontSize: "1.2rem" }}
                        className="font-weight-bold pl-2"
                      >
                        {_formatMoney(+total > 0 && +total)}
                      </span>
                    </div>
                  )}

                  {isEdit ? (
                    <TableRowEditPage
                      rowDto={rowDto}
                      rowDtoHandler={rowDtoHandler}
                      deleteHandler={deleteHandler}
                    ></TableRowEditPage>
                  ) : (
                    <TableRowCreatePage
                      rowDto={rowDto}
                      rowDtoHandler={rowDtoHandler}
                      deleteHandler={deleteHandler}
                    ></TableRowCreatePage>
                  )}
                </Form>
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
