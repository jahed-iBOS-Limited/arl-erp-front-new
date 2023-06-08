import React from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { discountFormatDDL, durationTypeDDL, basedOnDDL } from "../helper";

function RowAddForm({
  setFieldValue,
  errors,
  touched,
  values,
  setter,
  setRowDto,
  itemOfferDDL,
  rowDto
}) {
  return (
    <>
      <div className="row global-form">
        {/*  if Offer Based On "Amount select"*/}
        {[2].includes(values?.offerBasedOn?.value) && (
          <>
            <div className="col-lg-3">
              <label>Minimum Amount</label>
              <InputField
                value={values?.minimumAmount}
                name="minimumAmount"
                placeholder="Minimum Amount"
                type="number"
              />
            </div>
            <div className="col-lg-3">
              <label>Maximum Amount</label>
              <InputField
                value={values?.maximumAmount}
                name="maximumAmount"
                placeholder="Maximum Amount"
                type="number"
              />
            </div>
          </>
        )}

        {/*  if Offer Based On "Quantity select"*/}
        {[1].includes(values?.offerBasedOn?.value) && (
          <>
            <div className="col-lg-3">
              <label>Minimum Quantity</label>
              <InputField
                value={values?.minimumQuantity}
                name="minimumQuantity"
                placeholder="Minimum Quantity"
                type="number"
              />
            </div>
            <div className="col-lg-3">
              <label>Maximum Quantity</label>
              <InputField
                value={values?.maximumQuantity}
                name="maximumQuantity"
                placeholder="Maximum Quantity"
                type="number"
              />
            </div>
          </>
        )}
        {/*  if Scheme Type "Discount select" */}
        {[1].includes(values?.schemeType?.value) && (
          <>
            {" "}
            <div className="col-lg-3">
              <NewSelect
                name="discountFormat"
                options={discountFormatDDL() || []}
                value={values?.discountFormat}
                label="Discount Format"
                onChange={(valueOption) => {
                  setFieldValue("discountFormat", valueOption);
                  setFieldValue("discountAmount", "");
                }}
                placeholder="Discount Format"
                errors={errors}
                touched={touched}
              />
            </div>
            {values?.discountFormat?.value && (
              <div className="col-lg-3">
                <label>Discount {values?.discountFormat?.label}</label>
                <InputField
                  value={values?.discountAmount}
                  name="discountAmount"
                  placeholder={`Discount ${values?.discountFormat?.label}`}
                  type="number"
                />
              </div>
            )}
          </>
        )}
        {/*  if Scheme Type "Item select" */}
        {[2].includes(values?.schemeType?.value) && (
          <>
            <div className="col-lg-3">
              <NewSelect
                name="offerItem"
                options={itemOfferDDL || []}
                value={values?.offerItem}
                label="Offer Item"
                onChange={(valueOption) => {
                  setFieldValue("offerItem", valueOption);
                  setFieldValue(
                    "itemUoM",
                    valueOption?.uom
                      ? {
                          value: valueOption?.uom,
                          label: valueOption?.uomName,
                        }
                      : ""
                  );
                }}
                placeholder="Offer Item"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="itemUoM"
                options={[]}
                value={values?.itemUoM}
                label="Item UoM"
                onChange={(valueOption) => {
                  setFieldValue("itemUoM", valueOption);
                }}
                placeholder="Item UoM"
                errors={errors}
                touched={touched}
                isDisabled
              />
            </div>
            <div className="col-lg-3">
              <label>Offer Quantity</label>
              <InputField
                value={values?.offerQuantity}
                name="offerQuantity"
                placeholder="Offer Quantity"
                type="number"
              />
            </div>{" "}
          </>
        )}

        <div className="col-lg-3">
          <NewSelect
            name="durationType"
            options={durationTypeDDL() || []}
            value={values?.durationType}
            label="Duration Type"
            onChange={(valueOption) => {
              setFieldValue("durationType", valueOption);
              setFieldValue("monthDuration", "");
              setFieldValue("basedOn", "");
              if (valueOption?.value === 1) {
                setRowDto([]);
              }
            }}
            placeholder="Duration Type"
            errors={errors}
            touched={touched}
            isDisabled={rowDto?.length > 0}
          />
        </div>

        {![1].includes(values?.durationType?.value) &&
          values?.durationType?.value && (
            <>
              <div className="col-lg-3">
                <label>{values?.durationType?.label} Duration(From Last Month)</label>
                <InputField
                  value={values?.monthDuration}
                  name="monthDuration"
                  placeholder={`${values?.durationType?.label} Duration`}
                  type="number"
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="basedOn"
                  options={basedOnDDL(values?.durationType?.label) || []}
                  value={values?.basedOn}
                  label="Based On"
                  onChange={(valueOption) => {
                    setFieldValue("basedOn", valueOption);
                  }}
                  placeholder="Based On"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
          )}

        <div className="col d-flex  justify-content-end align-items-end">
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={() => {
              setter(values);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}

export default RowAddForm;
