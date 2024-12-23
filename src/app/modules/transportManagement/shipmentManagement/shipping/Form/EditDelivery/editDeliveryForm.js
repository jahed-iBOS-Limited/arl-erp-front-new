import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../_helper/_select";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import InputField from "../../../../../_helper/_inputField";

// Validation schema
export const validationSchema = Yup.object().shape({
  itemLists: Yup.array().of(
    Yup.object().shape({
      selectLocation: Yup.object()
        .shape({
          label: Yup.string().required("Location  is required"),
          value: Yup.string().required("Location  is required"),
        })
        .nullable(),
      deliveryQty: Yup.number()
        .min(0, "Minimum 0 number")
        .test("pendingQty", "Invalid qty ", function(value) {
          return this.parent.pendingQty >= value;
        })
        .required("Item Qty required"),
    })
  ),
});

export default function EditDeliveryForm({
  initData,
  saveHandler,
  isEdit,
  delivery,
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //M/S The Successors businessUnit
  const isTransportRate = selectedBusinessUnit?.value === 94;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={
          isEdit
            ? Yup.object().shape({
                itemLists: Yup.array().of(
                  Yup.object().shape({
                    selectLocation: Yup.object()
                      .shape({
                        label: Yup.string().required("Location  is required"),
                        value: Yup.string().required("Location  is required"),
                      })
                      .nullable(),
                    deliveryQty: Yup.number()
                      .min(0, "Minimum 0 number")
                      .test("maxDeliveryQty", "Invalid qty ", function(value) {
                        return this.parent.maxDeliveryQty >= value;
                      })
                      .required("Item Qty required"),
                  })
                ),
              })
            : validationSchema
        }
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
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              {/* table */}
              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0">
                  {values?.itemLists?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "75px" }}>Item Code</th>
                            <th style={{ width: "120px" }}>Specification</th>
                            <th style={{ width: "120px" }}>Ship to Party</th>
                            <th style={{ width: "120px" }}>Address</th>
                            <th style={{ width: "120px" }}>Item</th>
                            <th style={{ width: "120px" }}>Select Location</th>
                            <th style={{ width: "20px" }}>Price</th>
                            {[4].includes(selectedBusinessUnit?.value) && (
                              <>
                                <th style={{ width: "20px" }}>Extra Rate</th>
                              </>
                            )}
                            {isTransportRate && (
                              <th style={{ width: "20px" }}>Transport Rate</th>
                            )}
                            <th style={{ width: "20px" }}>Available Stock</th>
                            <th style={{ width: "20px" }}>Order Qty</th>
                            <th style={{ width: "20px" }}>Pending Qty</th>
                            <th style={{ width: "120px" }}>Delivery Qty</th>
                            <th style={{ width: "10px" }}>Offers</th>
                            {!isEdit && (
                              <th style={{ width: "50px" }}>Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {values?.itemLists.map((itm, index) => {
                            let _numItemPrice = itm?.isVatPrice
                              ? itm?.vatItemPrice
                              : itm?.numItemPrice;
                            return (
                              <>
                                <tr key={index}>
                                  <td>
                                    <div className="pl-2">{itm.itemCode}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {itm.specification}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {itm.shipToParty}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {itm.shipToPartnerAddress}
                                    </div>
                                  </td>
                                  <td style={{ width: "90px" }}>
                                    <div className="pl-2">{itm.itemName}</div>
                                  </td>

                                  <td
                                    style={{
                                      width: "75px",
                                      verticalAlign: "middle",
                                    }}
                                    className="locationRowFild"
                                  >
                                    <NewSelect
                                      name={`itemLists.${index}.selectLocation`}
                                      options={itm?.objLocation}
                                      value={
                                        values?.itemLists[index]
                                          ?.selectLocation || ""
                                      }
                                      onChange={(valueOption) => {
                                        setFieldValue(
                                          `itemLists.${index}.selectLocation`,
                                          valueOption || ""
                                        );
                                      }}
                                      errors={errors}
                                      touched={touched}
                                      isDisabled={isEdit}
                                    />
                                  </td>
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">
                                      {_numItemPrice}
                                    </div>
                                  </td>
                                  {[4].includes(
                                    selectedBusinessUnit?.value
                                  ) && (
                                    <>
                                      <td style={{ width: "20px" }}>
                                        <div className="text-right pr-2">
                                          {itm?.extraRate || 0}
                                        </div>
                                      </td>
                                    </>
                                  )}
                                  {isTransportRate && (
                                    <td
                                      style={{ width: "20px" }}
                                      className="text-right"
                                    >
                                      {itm.transportRate || 0}
                                    </td>
                                  )}
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">
                                      {itm?.availableStock}
                                    </div>
                                  </td>
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">
                                      {itm.numOrderQuantity}
                                    </div>
                                  </td>
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">
                                      {itm.pendingQty}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      width: "150px",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <div className="px-2">
                                      <InputField
                                        value={
                                          values?.itemLists[index]
                                            ?.deliveryQty || ""
                                        }
                                        name={`itemLists.${index}.deliveryQty`}
                                        placeholder="Delivery Qty"
                                        type="number"
                                        step="any"
                                        onChange={(e) => {
                                          setFieldValue(
                                            `itemLists.${index}.deliveryQty`,
                                            e.target.value || ""
                                          );
                                          setFieldValue(
                                            `itemLists.${index}.amount`,
                                            (
                                              values?.itemLists[index]
                                                ?.numItemPrice * e.target.value
                                            ).toFixed(2)
                                          );
                                          setFieldValue(
                                            `itemLists.${index}.vatAmount`,
                                            (
                                              values?.itemLists[index]
                                                ?.vatItemPrice * e.target.value
                                            ).toFixed(2)
                                          );

                                          // ======offer item qty change logic=====
                                          const modifid = values?.itemLists[
                                            index
                                          ]?.offerItemList?.map((itm) => {
                                            let calNumber =
                                              (+itm?.offerRatio || 0) *
                                              (+e.target.value || 0);
                                            let acculNumber = 0;
                                            const decimalPoint = Number(
                                              `.${calNumber
                                                .toString()
                                                .split(".")[1] || 0}`
                                            );
                                            if (decimalPoint >= 0.95) {
                                              acculNumber = Math.round(
                                                calNumber
                                              );
                                            } else {
                                              acculNumber = Math.floor(
                                                calNumber
                                              );
                                            }
                                            return {
                                              ...itm,
                                              deliveryQty: acculNumber,
                                              isItemShow:
                                                acculNumber > 0 ? true : false,
                                            };
                                          });
                                          setFieldValue(
                                            `itemLists.${index}.offerItemList`,
                                            modifid
                                          );
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        max={
                                          isEdit
                                            ? itm?.maxDeliveryQty
                                            : itm?.pendingQty
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td style={{ width: "10px" }}>
                                    <div className="pl-2">
                                      {itm.freeItem ? "Yes" : "No"}
                                    </div>
                                  </td>
                                </tr>
                                {/* offer item show */}
                                {itm?.offerItemList?.length > 0 ? (
                                  <>
                                    {itm?.offerItemList
                                      ?.filter((itm) => itm?.isItemShow)
                                      ?.map((OfferItm) => (
                                        <tr
                                          key={index}
                                          style={{ background: "#ffffa9" }}
                                        >
                                          <td>
                                            <div className="pl-2">
                                              {OfferItm?.itemCode}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="pl-2">
                                              {OfferItm?.specification}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="pl-2">
                                              {OfferItm?.shipToParty}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="pl-2">
                                              {OfferItm?.shipToPartnerAddress}
                                            </div>
                                          </td>
                                          <td style={{ width: "90px" }}>
                                            <div className="pl-2">
                                              {OfferItm?.itemName}
                                            </div>
                                          </td>
                                          <td
                                            style={{
                                              width: "75px",
                                              verticalAlign: "middle",
                                            }}
                                            className="locationRowFild"
                                          >
                                            {OfferItm?.selectLocation?.label}
                                          </td>
                                          <td style={{ width: "20px" }}>
                                            <div className="text-right pr-2">
                                              {_numItemPrice}
                                            </div>
                                          </td>
                                          {isTransportRate && (
                                            <td
                                              style={{ width: "20px" }}
                                              className="text-right"
                                            >
                                              {OfferItm?.transportRate || 0}
                                            </td>
                                          )}
                                          <td style={{ width: "20px" }}>
                                            <div className="text-right pr-2">
                                              {OfferItm?.numOrderQuantity}
                                            </div>
                                          </td>
                                          <td style={{ width: "20px" }}>
                                            <div className="text-right pr-2">
                                              {OfferItm?.pendingQty}
                                            </div>
                                          </td>
                                          <td
                                            style={{
                                              width: "150px",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <div className="px-2">
                                              {OfferItm?.deliveryQty}
                                            </div>
                                          </td>
                                          <td style={{ width: "10px" }}>
                                            <div className="pl-2">Yes</div>
                                          </td>

                                          {!isEdit && (
                                            <td className="text-center"></td>
                                          )}
                                        </tr>
                                      ))}
                                  </>
                                ) : null}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
