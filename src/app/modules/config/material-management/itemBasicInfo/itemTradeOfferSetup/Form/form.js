import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AttachFile from "../../../../../_helper/commonInputFieldsGroups/attachemntUpload";
import IButton from "../../../../../_helper/iButton";
import {
  DeleteTradeOfferConfigurationApi,
  GetDistributionChannelDDL,
  getDistributionChannelIdApi,
  getItemSalesOfferDDLApi,
} from "../../helper";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import InputField from "./../../../../../_helper/_inputField";
import NewSelect from "./../../../../../_helper/_select";
import { _todayDate } from "./../../../../../_helper/_todayDate";
// Validation schema
const validationSchema = Yup.object().shape({
  // offerItem: Yup.string().required("Code is required"),
  // fromDate: Yup.date().required("From Date is required"),
  // toDate: Yup.date().required("To Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setRowDto,
  rowDto,
  setDisabled,
  setUploadedImage,
  offerTypes,
}) {
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [open, setOpen] = useState(false);
  const { state: landingRowData } = useLocation();
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [itemDDL, setItemDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const addRowHandler = (values) => {
    const offerTypeId = values?.offerType?.value;

    if (offerTypeId === 2) {
      const discountOnRateRow = {
        promotionRowId: 0,
        promotionId: 0,
        orderFrom: +values?.numMinQuantity || 0,
        orderTo: +values?.numMaxQuantity || 0,
        discountTypeId: values?.offerType?.value,
        discountTypeName: values?.offerType?.label,
        itemId: values?.offerItem?.value,
        itemName: values?.offerItem?.label,
        discount: values?.offerQuantity,
      };

      setRowDto([...rowDto, discountOnRateRow]);
    } else {
      // } else if (offerTypeId === 2) {
      const numMinQuantity = +values?.numMinQuantity || 0,
        numMaxQuantity = +values?.numMaxQuantity || 0;

      if (values?.isProportionalOffer === true && numMinQuantity <= 0)
        return toast.warn("Minimum Qty  1");

      if (
        numMinQuantity > numMaxQuantity &&
        values?.isProportionalOffer === false
      )
        return toast.warn(
          `Please Input required  maximum  qty "${values?.numMinQuantity}"`
        );

      // const duplicateCheck = rowDto.some(
      //   (itm) => itm?.intOfferItemId === values?.offerItem?.value
      // );
      // if (duplicateCheck) return toast.warn("Item duplicate not allowed");

      const obj = {
        intAutoId: 0,
        intItemId: landingRowData?.itemId || 0,
        strItemName: landingRowData?.itemName || "",
        intDistributionChannelId: values?.distributionChannel?.value || 0,
        strDistributionChannelName: values?.distributionChannel?.label || "",
        intOfferItemId: values?.offerItem?.value || 0,
        strOfferItemName: values?.offerItem?.label || "",
        dteFromDate: values?.fromDate,
        dteToDate: values?.toDate,
        numOfferQuantity: +values?.offerQuantity || 0,
        numMinQuantity: +values?.numMinQuantity || 0,
        numMaxQuantity: +values?.numMaxQuantity || 0,
        isOfferContinuous: values?.isOfferContinuous || false,
        isMinApplied: values?.isMinApplied || false,
        isMaxApplied: values?.isMaxApplied || false,
        intActionBy: profileData?.userId,
        isProportionalOffer: values?.isProportionalOffer || false,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
      };
      setRowDto([...rowDto, obj]);
    }
  };

  const distributionChannelHandler = (values) => {
    getDistributionChannelIdApi(
      values?.distributionChannel?.value,
      landingRowData?.itemId || 0,
      setDisabled,
      (resData) => {
        const modified = resData?.map((itm) => ({
          ...itm,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intActionBy: profileData?.userId,
        }));
        setRowDto(modified);
      }
    );
  };

  const types = () => {
    return [224, 171].includes(selectedBusinessUnit?.value)
      ? offerTypes
      : [
          { value: 1, label: "Discount on Quantity" },
          { value: 2, label: "Discount on Rate" },
          { value: 3, label: "IHB Gift Offer" },
        ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setFieldValue, resetForm }) => {
          saveHandler(values, () => {
            const provValues = values;
            resetForm(initData);
            setFieldValue(
              "distributionChannel",
              provValues?.distributionChannel
            );
            setRowDto([]);
            distributionChannelHandler(provValues);
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row  global-form">
                {console.log("Current value of offerType:", values?.offerType)}
                <div className="col-lg-3">
                  <NewSelect
                    name="offerType"
                    options={types()}
                    value={values?.offerType}
                    label="Offer Type"
                    onChange={(valueOption) => {
                      setFieldValue("offerType", valueOption);
                      setFieldValue("isProportionalOffer", false);
                    }}
                    placeholder="Offer Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={rowDto?.length}
                  />
                </div>
                {/* {![3].includes(values?.offerType?.value) && ( */}
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={distributionChannelDDL || []}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("distributionChannel", valueOption);
                      setFieldValue("offerItem", "");
                      setRowDto([]);
                      distributionChannelHandler({
                        ...values,
                        distributionChannel: valueOption,
                      });
                      setItemDDL([]);

                      getItemSalesOfferDDLApi(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setItemDDL
                      );
                    }}
                    placeholder="Distribution Channel"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      values?.offerType?.value === 2 && rowDto?.length
                    }
                  />
                </div>
                {/* )} */}
                <div className="col-lg-3">
                  <NewSelect
                    name="offerItem"
                    options={itemDDL}
                    value={values?.offerItem}
                    label="Offer Item"
                    onChange={(valueOption) => {
                      setFieldValue("offerItem", valueOption);
                    }}
                    placeholder="Select Offer Item"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      [1, 2].includes(values?.offerType?.value) &&
                      !values?.distributionChannel
                    }
                  />
                </div>

                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="Name"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.isOfferContinuous ? "" : values?.toDate}
                    name="toDate"
                    placeholder="Name"
                    type="date"
                    min={values?.fromDate}
                    disabled={values?.isOfferContinuous}
                  />
                </div>

                <div className="col-lg-3">
                  <label>
                    {values?.offerType?.value === 1
                      ? "Offer Quantity"
                      : "Discount Rate"}
                  </label>
                  <InputField
                    value={values?.offerQuantity}
                    name="offerQuantity"
                    placeholder={
                      values?.offerType?.value === 1
                        ? "Offer Quantity"
                        : "Discount Rate"
                    }
                    type="number"
                  />
                </div>

                <div className="col-lg-3 text-center d-flex justify-content-center flex-column">
                  <div className="">
                    <label className="" for="isMinApplied">
                      <b>Minimum Qty</b>
                    </label>
                    <input
                      type="checkbox"
                      value={values?.isMinApplied}
                      checked={values?.isMinApplied}
                      className="form-check-input ml-3 mt-2"
                      name="isMinApplied"
                      onChange={(e) => {
                        setFieldValue("isMinApplied", e.target.checked);
                        setFieldValue("numMinQuantity", "");
                      }}
                      id="isMinApplied"
                    />
                  </div>
                  {values?.isMinApplied && (
                    <div>
                      <InputField
                        value={values?.numMinQuantity}
                        name="numMinQuantity"
                        placeholder="Minimum Qty"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("numMinQuantity", e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-lg-3 text-center d-flex justify-content-center flex-column">
                  <div className="">
                    <label className="" for="isMaxApplied">
                      <b>Maximum Qty</b>
                    </label>
                    <input
                      type="checkbox"
                      value={values?.isMaxApplied}
                      checked={values?.isMaxApplied}
                      className="form-check-input ml-3 mt-2"
                      name="isMaxApplied"
                      onChange={(e) => {
                        setFieldValue("isMaxApplied", e.target.checked);
                        setFieldValue("numMaxQuantity", "");
                      }}
                      id="isMaxApplied"
                      disabled={values?.isProportionalOffer}
                    />
                  </div>
                  {values?.isMaxApplied && (
                    <div>
                      <InputField
                        value={values?.numMaxQuantity}
                        name="numMaxQuantity"
                        placeholder="Maximum Qty"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("numMaxQuantity", e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>

                {[1, 3].includes(values?.offerType?.value) && (
                  <>
                    <div
                      className="col-lg-3 d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <div className="d-flex flex-column">
                        <label className="" for="isOfferContinuous">
                          <b>Offer Continuous</b>
                        </label>
                        <input
                          value={values?.isOfferContinuous}
                          checked={values?.isOfferContinuous}
                          type="checkbox"
                          className=" ml-3 mt-2"
                          name="isOfferContinuous"
                          onChange={(e) => {
                            setFieldValue(
                              "isOfferContinuous",
                              e.target.checked
                            );
                            if (e.target.checked) {
                              setFieldValue("toDate", _todayDate());
                            } else {
                              setFieldValue("toDate", values?.fromDate || "");
                            }
                          }}
                          id="isOfferContinuous"
                        />
                      </div>
                      <div className="d-flex flex-column">
                        <label className="" for="isProportionalOffer">
                          <b>Proportional Offer</b>
                        </label>

                        <input
                          type="checkbox"
                          value={values?.isProportionalOffer}
                          checked={values?.isProportionalOffer}
                          className=" ml-3 mt-2"
                          name="isProportionalOffer"
                          onChange={(e) => {
                            setFieldValue(
                              "isProportionalOffer",
                              e.target.checked
                            );
                            setFieldValue("isMaxApplied", false);
                            setFieldValue("numMaxQuantity", "");
                          }}
                          id="isProportionalOffer"
                        />
                      </div>
                    </div>
                  </>
                )}
                <IButton
                  onClick={() => {
                    addRowHandler(values);
                  }}
                  disabled={
                    !values?.toDate ||
                    !values?.offerQuantity ||
                    !values?.offerItem ||
                    !values?.distributionChannel ||
                    (values?.isOfferContinuous ? false : !values?.fromDate)
                  }
                >
                  Add
                </IButton>
                {values?.offerType?.value === 2 && (
                  <IButton
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Attach File
                  </IButton>
                )}
                <AttachFile obj={{ open, setOpen, setUploadedImage }} />
              </div>

              {![2].includes(values?.offerType?.value) ? (
                <div className="table-responsive">
                  <table className="table table-striped global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th style={{ width: "50px" }}>Offer Item</th>
                        <th style={{ width: "50px" }}>From Date</th>
                        <th style={{ width: "50px" }}>To Date</th>
                        <th style={{ width: "50px" }}>Offer Quantity</th>
                        <th style={{ width: "50px" }}>Minimum Qty</th>
                        <th style={{ width: "50px" }}>Maximum Qty</th>
                        <th style={{ width: "50px" }}>Offer Continuous</th>
                        <th style={{ width: "50px" }}>Proportional Offer</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((data, index) => (
                        <tr key={index} style={{ textAlign: "center" }}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="pl-2">{data?.strOfferItemName}</div>
                          </td>

                          <td>{_dateFormatter(data?.dteFromDate)}</td>
                          <td>
                            {data?.isOfferContinuous
                              ? ""
                              : _dateFormatter(data?.dteToDate)}
                          </td>
                          <td>
                            <InputField
                              value={data?.numOfferQuantity || ""}
                              name="offerQuantity"
                              placeholder="Offer Quantity"
                              type="number"
                              onChange={(e) => {
                                const coppyRowDto = [...rowDto];
                                coppyRowDto[index].numOfferQuantity =
                                  e.target.value;
                                setRowDto(coppyRowDto);
                              }}
                            />
                          </td>
                          <td>{data?.numMinQuantity || 0}</td>
                          <td>{data?.numMaxQuantity || 0}</td>
                          <td>{data?.isOfferContinuous ? "Yes" : "No"}</td>
                          <td>{data?.isProportionalOffer ? "Yes" : "No"}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className="delete"
                                onClick={() => {
                                  const filterArr = rowDto.filter(
                                    (itm, idx) => index !== idx
                                  );
                                  if (data?.intAutoId) {
                                    const payload = [data?.intAutoId];
                                    DeleteTradeOfferConfigurationApi(
                                      payload,
                                      setDisabled,
                                      () => {
                                        setRowDto(filterArr);
                                      }
                                    );
                                  } else {
                                    setRowDto(filterArr);
                                  }
                                }}
                              >
                                <IDelete />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : values?.offerType?.value === 2 ? (
                <div className="table-responsive">
                  <table className="table table-striped global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th style={{ width: "50px" }}>Offer Item</th>
                        <th style={{ width: "50px" }}>Offer Quantity</th>
                        <th style={{ width: "50px" }}>Minimum Qty</th>
                        <th style={{ width: "50px" }}>Maximum Qty</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((data, index) => (
                        <tr key={index} style={{ textAlign: "center" }}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="pl-2">{data?.itemName}</div>
                          </td>

                          <td>{data?.discount}</td>
                          <td>{data?.orderFrom || 0}</td>
                          <td>{data?.orderTo || 0}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className="delete"
                                onClick={() => {
                                  const filterArr = rowDto.filter(
                                    (itm, idx) => index !== idx
                                  );
                                  if (data?.intAutoId) {
                                    // const payload = [data?.intAutoId];
                                    // DeleteTradeOfferConfigurationApi(
                                    //   payload,
                                    //   setDisabled,
                                    //   () => {
                                    //     setRowDto(filterArr);
                                    //   }
                                    // );
                                  } else {
                                    setRowDto(filterArr);
                                  }
                                }}
                              >
                                <IDelete />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <></>
              )}

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
                onSubmit={() => {
                  resetForm(initData);
                  setRowDto([]);
                }}
                onClick={() => {
                  resetForm(initData);
                  setRowDto([]);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
