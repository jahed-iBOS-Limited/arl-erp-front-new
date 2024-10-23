import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import { IInput } from "../../../_helper/_input";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { tblCostComponentHeaders, tblMaterialCostHeaders } from "./helper";

const initData = {};
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

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getProductDDL(
      `/costmgmt/Precosting/ProductDDL?businessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
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
    const markupProfit =
      (totalCostConversion +
        packingMaterialValue +
        manufacturingOverheadValue +
        totalPeriodCost) *
      markupValue;
    const precostingMaterial = productPreCostingData?.precostingMaterial?.map(
      (itm) => {
        return {
          autoId: 0,
          costingId: 0,
          materialItemId: itm?.materialItemId,
          conversion: itm?.conversion,
          useProportion: itm?.percentigeInput,
          yieldProportion: itm?.yield,
          convQty: itm?.convQty,
          rate: itm?.averageCost,
          amount: itm?.convQty * itm?.averageCost,
        };
      }
    );
    const precostingOverhead = productPreCostingData?.precostingOverhead?.map(
      (itm) => {
        return {
          autoId: 0,
          costingId: 0,
          costElementId: itm?.overheadId,
          amount: itm?.costElementAmount,
        };
      }
    );
    const payload = {
      costingId: productPreCostingData?.costingId || 0,
      businessUnitId: productPreCostingData?.businessUnitId || 0,
      productId: productPreCostingData?.productId || 0,
      fgItemId: productPreCostingData?.fgItemId || 0,
      costingDate: productPreCostingData?.costingDate || "",
      partnerId: productPreCostingData?.partnerId || 0,
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
      finalPrice: totallll + markupProfit,
      actionBy: profileData?.userId,
      precostingMaterial: precostingMaterial,
      precostingOverhead: precostingOverhead,
    };

    // saveData(
    //   `/mes/MSIL/KeyRegisterCreateAndEdit`,
    //   {
    //     intGateKeyRegisterId: id || 0,
    //     dteDate: values?.date,
    //     intBusinessUnitId: selectedBusinessUnit?.value,
    //     intKeyReceiverEnroll: values?.keyReceiverName?.value,
    //     strKeyReceiverName: values?.keyReceiverName?.label,
    //     intDesignationId: 0,
    //     strDesignation: values?.designation,
    //     intKeyLocationId: values?.keyLocation?.value,
    //     strKeyLocation: values?.keyLocation?.label,
    //     numKeyQuantity: +values?.keyQuantity,
    //     tmKeyProvideTime: values?.keyProvideTime,
    //     tmKeyReceiveTime: values?.keyReceiveTime,
    //     intKeyProviderEnroll: values?.keyProviderName?.value,
    //     strKeyProviderName: values?.keyProviderName?.label,
    //     strRemarks: "",
    //     intActionBy: profileData?.userId,
    //     // dteInsertDate: _todayDate(),
    //     isActive: true,
    //     strKeyReceivedFrom: values?.keyProviderNameForEdit || "",
    //     intKeyReceivedBy: values?.keyReceiverNameForEdit?.value || 0,
    //     strKeyReceivedBy: values?.keyReceiverNameForEdit?.label || "",
    //   },
    //   id ? "" : cb,
    //   true
    // );
  };

  // const rowDtoHandler = (index, key, value) => {
  //   const modifyData = [...productPreCostingData?.precostingMaterial];
  //   modifyData[index][key] = value;
  //   setProductPreCostingData({
  //     ...productPreCostingData,
  //     precostingMaterial: modifyData,
  //   });
  // };
  const rowDtoHandler = (index, key, value) => {
    const modifyData = [...productPreCostingData?.precostingMaterial];

    // Update the specific key-value pair for the current item
    modifyData[index][key] = value;

    // Destructure item for easier access to fields
    const item = modifyData[index];

    // Perform your calculations
    const requiredQty = +item?.percentigeInput / +item?.yield;
    const currentCost = +item?.percentigeInput * +item?.currentInvRate;
    const newCost = (+item?.percentigeInput / +item?.yield) * +item?.newPrice;
    const averageCost =
      (item?.currentInvQty * item?.currentCost +
        +item?.newQty * item?.newCost) /
      ((item?.currentInvQty + +item?.newQty) * item?.requiredQty);

    // Assign the calculated values to the item
    modifyData[index].requiredQty = requiredQty;
    modifyData[index].currentCost = currentCost;
    modifyData[index].newCost = newCost;
    modifyData[index].averageCost = averageCost;

    // Update the state with the modified data
    setProductPreCostingData({
      ...productPreCostingData,
      precostingMaterial: modifyData,
    });
  };

  const costElementAmountHandler = (index, key, value) => {
    const modifyData = [...productPreCostingData?.precostingOverhead];
    modifyData[index][key] = value;
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
      0
    );
    setTotalNewCost(totalNewCostRow);
    const totalCurrentCostRow = productPreCostingData?.precostingMaterial?.reduce(
      (acc, item) => {
        return acc + (+item?.currentCost || 0);
      },
      0
    );
    setTotalCurrentCost(totalCurrentCostRow);

    const totalPeriodCostRow = productPreCostingData?.precostingOverhead?.reduce(
      (acc, item) => {
        return acc + (+item?.costElementAmount || 0);
      },
      0
    );
    setTotalPeriodCost(totalPeriodCostRow);
  }, [
    productPreCostingData?.precostingMaterial,
    productPreCostingData?.precostingOverhead,
  ]);

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
                            setFieldValue("product", valueOption);
                            setFieldValue("uomName", {
                              value: valueOption?.uomId,
                              label: valueOption?.uomName,
                            });
                            getFinishGoodDDL(
                              `/costmgmt/Precosting/FgItemByProductDDL?businessUnitId=${selectedBusinessUnit?.value}&productId=${valueOption?.value}`
                            );
                          } else {
                            setFieldValue("product", "");
                            setFieldValue("uomName", "");
                            setFinishGoodDDL([]);
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="UOM"
                        options={[]}
                        value={values?.uomName}
                        name="uomName"
                        onChange={(valueOption) => {
                          setFieldValue("uomName", valueOption);
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
                            setFieldValue("finishGood", valueOption);
                            getProductPreCostingData(
                              `/costmgmt/Precosting/ViewProductPrecosting?businessUnit=${selectedBusinessUnit?.value}&productId=${values?.product?.value}&fgItemId=${valueOption?.value}`
                            );
                          } else {
                            setFieldValue("finishGood", "");
                            setProductPreCostingData([]);
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <label>চাবি গ্রহনকারীর নাম</label>
                      <SearchAsyncSelect
                        selectedValue={values?.keyReceiverName}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("keyReceiverName", valueOption);
                          setFieldValue("designation", valueOption?.employeeInfoDesignation || "");
                        }}
                        loadOptions={loadKeyReceiverName}
                        isDisabled={id}
                      />
                    </div> */}
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
                                  ?.convRate || ""
                              }
                              name="convRate"
                              style={{ fontSize: "10px" }}
                              onChange={(e) => {
                                // setFieldValue("convRate", e.target.value);
                                rowDtoHandler(
                                  index,
                                  "convRate",
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.percentigeInput || ""
                              }
                              name="percentigeInput"
                              style={{ fontSize: "10px" }}
                              onChange={(e) => {
                                // setFieldValue(
                                //   "percentigeInput",
                                //   e.target.value
                                // );
                                rowDtoHandler(
                                  index,
                                  "percentigeInput",
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.yield || ""
                              }
                              name="yield"
                              style={{ fontSize: "10px" }}
                              placeholder=""
                              onChange={(e) => {
                                // setFieldValue("yield", e.target.value);
                                rowDtoHandler(index, "yield", e.target.value);
                              }}
                            />
                          </td>
                          <td className="text-center">
                            {item?.requiredQty
                              ? item?.requiredQty?.toFixed(4)
                              : ""}
                          </td>
                          <td className="text-center">
                            {item?.currentInvQty || ""}
                          </td>
                          <td className="text-center">
                            {item?.currentInvRate || ""}
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.newQty || ""
                              }
                              name="newQty"
                              style={{ fontSize: "10px" }}
                              onChange={(e) => {
                                // setFieldValue("newQty", e.target.value);
                                rowDtoHandler(index, "newQty", e.target.value);
                              }}
                            />
                          </td>
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingMaterial[index]
                                  ?.newPrice || ""
                              }
                              name="newPrice"
                              style={{ fontSize: "10px" }}
                              onChange={(e) => {
                                // setFieldValue("newPrice", e.target.value);
                                rowDtoHandler(
                                  index,
                                  "newPrice",
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                          <td className="text-center">
                            {item?.currentCost
                              ? item?.currentCost?.toFixed(2)
                              : ""}
                          </td>
                          <td className="text-center">
                            {item?.newCost ? item?.newCost?.toFixed(2) : ""}
                          </td>
                          <td className="text-center">
                            {item?.averageCost
                              ? item?.averageCost?.toFixed(2)
                              : ""}
                          </td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td colSpan={11}>
                        {" "}
                        <strong>Total RM Price</strong>
                      </td>
                      <td>
                        {totalCurrentCost ? totalCurrentCost?.toFixed(2) : ""}
                      </td>
                      <td>{totalNewCost ? totalNewCost?.toFixed(2) : ""}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={12}>
                        {" "}
                        <strong>Total Material Cost by SKU</strong>
                      </td>
                      <td>
                        {totalNewCost
                          ? (
                              totalNewCost * values?.finishGood?.conversion
                            ).toFixed(2)
                          : ""}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </CommonTable>

                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <IInput
                        value={values?.packingMaterial || ""}
                        name="packingMaterial"
                        label="Packing Material"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("packingMaterial", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput
                        value={values?.manufacturingOverhead || ""}
                        name="manufacturingOverhead"
                        label="Manufaturing Overhead"
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            "manufacturingOverhead",
                            e.target.value
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
                        Total Manufacturing Cost:{" "}
                        {totalNewCost &&
                        values?.packingMaterial &&
                        values?.manufacturingOverhead
                          ? (
                              totalNewCost * values?.finishGood?.conversion +
                              (+values?.packingMaterial +
                                +values?.manufacturingOverhead)
                            ).toFixed(2)
                          : ""}
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
                          <td className="disabled-feedback disable-border">
                            <IInput
                              value={
                                productPreCostingData?.precostingOverhead[index]
                                  ?.costElementAmount || ""
                              }
                              name="costElementAmount"
                              style={{ fontSize: "10px" }}
                              onChange={(e) => {
                                costElementAmountHandler(
                                  index,
                                  "costElementAmount",
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                        </tr>
                      )
                    )}

                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Total Period Cost</strong>
                      </td>
                      <td>
                        {totalPeriodCost ? totalPeriodCost?.toFixed(2) : ""}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Total Overhead</strong>
                      </td>
                      <td>
                        {totalPeriodCost +
                          +values?.packingMaterial +
                          +values?.manufacturingOverhead || ""}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Total Cost</strong>
                      </td>
                      <td>
                        {totalNewCost * values?.finishGood?.conversion +
                          (+values?.packingMaterial +
                            +values?.manufacturingOverhead) +
                          totalPeriodCost || ""}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Mark-Up / Profit</strong>
                      </td>
                      <td>
                        <div className="d-flex">
                          <IInput
                            value={values?.markupOrProfit || ""}
                            name="markupOrProfit"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue("markupOrProfit", e.target.value);
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
                      <td colSpan={2}>
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
                          return (result || 0)?.toFixed(2) || ""; // Return the result formatted to two decimal places
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </CommonTable>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
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
