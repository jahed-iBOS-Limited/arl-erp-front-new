import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import { IInput } from "../../../_helper/_input";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { toast } from "react-toastify";

const initData = {};
export default function GradingCreateTwo() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [lessQuantity, setLessQuantity] = useState("");
  const [overSize, setoverSize] = useState("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const location = useLocation();
  const [rowData, getRowData, getLoading, setRowData] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/mes/WeightBridge/GetWeightBridgeItemGradingList?BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const modifyData = data.map((item) => ({
          ...item,
          isQuantityDisabled: false,
          isCheckDisabled: false,
        }));
        setRowData(modifyData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLessQuantityRow = (index) => {
    return rowData.length - 2 === index;
  };

  const isOverSizeRow = (index) => {
    return rowData.length - 1 === index;
  };

  const saveHandler = async (values, cb) => {
    const rowList = rowData?.map((data, i) => {
      return {
        intQualityCheckingId: 0,
        dteDate: _todayDate(),
        intGateEntryItemListId: location?.state?.intGateEntryItemListId,
        intWeightmentId: location?.state?.intWeightmentId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intItemId: data?.itemId,
        strItemName: data?.itemName || "",
        strItemCode: data?.itemCode || "",
        UomId: data?.uomId,
        UomName: data?.uomName || "",
        isActive: true,
        intActionBy: profileData?.userId,
        dteInsertDateTime: _todayDate(),
        dteLastActionDateTime: _todayDate(),
        isRestQuantity: data?.isRestQuantity,
        isForCalculation: isOverSizeRow(i) ? false : true,
        numQuantity: isOverSizeRow(i)
          ? +overSize || 0
          : isLessQuantityRow(i)
          ? +lessQuantity || 0
          : +data?.quantity || 0,
      };
    });

   const isQtyExits = rowList?.find((item) => item?.numQuantity > 0); 
    if (isQtyExits) {
      saveData(
        `/mes/WeightBridge/WeightBridgeQCCreateAndEdit`,
        rowList,
        cb,
        true
      );  
    }else{
      return toast("Please provide row quantity");
    }

    
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    if (+value < 0) return;
    if (value) {
      _data[index][name] = +value;
      _data[index]["isCheckDisabled"] = true;
    } else {
      _data[index][name] = "";
      _data[index]["isCheckDisabled"] = false;
    }
    setRowData(_data);
  };

  const rowCheckboxHandler = (index, value) => {
    const copyRowDto = [...rowData];
    let totalQty = 0;
    const checkIndex = copyRowDto.findIndex((x) => x.isRestQuantity);

    if (checkIndex !== -1) {
      copyRowDto[checkIndex]["quantity"] = "";
    }

    const modifyData = copyRowDto.map((item, i) => {
      totalQty += +item?.quantity || 0;
      if (index === i) {
        return {
          ...item,
          isRestQuantity: value,
          isQuantityDisabled: value ? true : false,
        };
      } else {
        return {
          ...item,
          isRestQuantity: false,
          tempQty: 0,
          isQuantityDisabled: value ? true : false,
        };
      }
    });

    if (value) {
      let qty = (location?.state?.numWeightTon || 0) - (totalQty || 0);
      modifyData[index]["quantity"] = qty - (+lessQuantity || 0);
      modifyData[index]["tempQty"] = qty;
    } else {
      modifyData[index]["quantity"] = "";
      modifyData[index]["tempQty"] = 0;
    }
    setRowData(modifyData);
  };

  useEffect(() => {
    const modifyData = [...rowData];
    const checkIndex = modifyData?.findIndex((x) => x.isRestQuantity);
    if (checkIndex !== -1) {
      modifyData[checkIndex]["quantity"] =
        (+modifyData?.[checkIndex]?.tempQty || 0) - (+lessQuantity || 0);
      setRowData(modifyData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessQuantity]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <IForm customTitle="Grading Entry" getProps={setObjprops} isHiddenReset>
      {getLoading && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {});
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

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>পণ্যের নাম</th>
                            <th>সাপ্লায়ারের নাম</th>
                            <th>গাড়ীর নাম্বার</th>
                            <th>চালান নাম্বার</th>
                            <th>Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{location?.state?.strMaterialName}</td>
                            <td>{location?.state?.strSupplierName}</td>
                            <td>{location?.state?.strTruckNumber}</td>
                            <td>{location?.state?.strInvoiceNumber}</td>
                            <td className="text-center">
                              {location?.state?.numWeightTon}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-lg-12">
                    <b style={{ fontSize: "16px" }}>Grading List</b>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UoM</th>
                            <th>Quantity</th>
                            <th>Rest Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => {
                              return isLessQuantityRow(index) ||
                                isOverSizeRow(index) ? null : (
                                <tr>
                                  <td>{item?.itemCode}</td>
                                  <td>{item?.itemName}</td>
                                  <td>{item?.uomName}</td>
                                  <td
                                    style={{ width: "200px" }}
                                    className="disabled-feedback disable-border"
                                  >
                                    <IInput
                                      value={rowData[index]?.quantity}
                                      name="quantity"
                                      type="number"
                                      placeholder="Quantity"
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "quantity",
                                          index,
                                          e.target.value
                                        );
                                      }}
                                      onKeyDown={handleKeyDown}
                                      disabled={
                                        item?.isRestQuantity ||
                                        item?.isQuantityDisabled
                                      }
                                      step="any"
                                      min={0}
                                    />
                                  </td>
                                  <td
                                    style={{ width: "100px" }}
                                    className="disabled-feedback disable-border text-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={item?.isRestQuantity}
                                      onChange={(e) => {
                                        rowCheckboxHandler(
                                          index,
                                          e.target.checked
                                        );
                                      }}
                                      onKeyDown={handleKeyDown}
                                      disabled={item?.isCheckDisabled}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          <tr>
                            <td>{""}</td>
                            <td>{"Less"}</td>
                            <td>{""}</td>
                            <td
                              style={{ width: "200px" }}
                              className="disabled-feedback disable-border"
                            >
                              <IInput
                                value={lessQuantity}
                                name="quantity"
                                type="number"
                                placeholder="Less Quantity"
                                onChange={(e) => {
                                  setLessQuantity(e.target.value);
                                }}
                                onKeyDown={handleKeyDown}
                                disabled={false}
                                step="any"
                                min={0}
                              />
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>{""}</td>
                            <td>{"Over Size"}</td>
                            <td>{""}</td>
                            <td
                              style={{ width: "200px" }}
                              className="disabled-feedback disable-border"
                            >
                              <IInput
                                value={overSize}
                                name="oversize"
                                type="number"
                                placeholder="Over Size"
                                onChange={(e) => {
                                  setoverSize(e.target.value);
                                }}
                                onKeyDown={handleKeyDown}
                                disabled={false}
                                step="any"
                                min={0}
                              />
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

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
