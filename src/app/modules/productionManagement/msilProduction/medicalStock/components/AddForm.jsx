import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { validateDigit } from "../../../../_helper/validateDigit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import { IInput } from "../../../../_helper/_input";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  itemName: "",
  uom: "",
  qty: "",
};

export default function MedicalStockForm() {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [itemList, setItemList] = useState([]);
  const [itemNameDDL, getItemName] = useAxiosGet([]);
  const [, saveMedicalStock, loading] = useAxiosPost([]);
  const saveHandler = (values, cb) => {
    if (!itemList?.length) return toast.warn("Please select atleast one row");
    const negativeQty = itemList?.every((item) => item?.numStockQty > 0);
    if (!negativeQty) return toast.warn("Quantity can't be empty or zero");
    const payload =
      itemList?.length > 0 &&
      itemList?.map((item) => ({
        ...item,
        stockType: 1,
      }));
    saveMedicalStock(`/mes/MSIL/SaveMedicalStock`, payload, cb, true);
  };

  const addHandler = (values, resetForm, setFieldValue) => {
    const isExists = itemList.filter(
      (item) => item?.intMedicineItemId === values?.itemName?.value
    );
    if (isExists?.length > 0) return toast.warn("Already exists item");
    setItemList([
      {
        sl: 0,
        intAutoId: 0,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intMedicineItemId: values?.itemName?.value,
        strMedicineItemCode: values?.itemName?.strMedicineCode,
        strMedicineItemName: values?.itemName?.label,
        intUoMid: values?.itemName?.intUomId,
        strUoMname: values?.itemName?.strUomName,
        numStockQty: +values?.qty,
        dteExpireDate: _dateFormatter(_todayDate()),
        intActionBy: profileData?.userId,
        dteInsertDate: _dateFormatter(_todayDate()),
        isActive: true,
      },
      ...itemList,
    ]);
    setFieldValue("itemName", "");
    setFieldValue("uom", "");
    setFieldValue("qty", "");
  };

  const removeHandler = (index) => {
    const data = itemList?.filter((item, i) => i !== index);
    setItemList([...data]);
  };

  useEffect(() => {
    getItemName(
      `/mes/MesDDL/GetAllMedicineListDDL?BusinessunitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  return (
    <>
      <IForm
        title="Medicine Stock Entry"
        getProps={setObjprops}
        isHiddenReset={true}
      >
        <>
          <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
              saveHandler(values, () => {
                setItemList([]);
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
                  {loading && <Loading />}
                  <div className="form-group  global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="itemName"
                          options={itemNameDDL || []}
                          value={values?.itemName}
                          label="Item Name"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("itemName", valueOption);
                              setFieldValue("uom", valueOption?.strUomName);
                            } else {
                              setFieldValue("uom", "");
                              setFieldValue("itemName", "");
                            }
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.uom}
                          label="UoM"
                          name="uom"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <IInput
                          value={values?.qty}
                          name="qty"
                          type="tel"
                          min="0"
                          label="Qty"
                          onChange={(e) => {
                            const validNum = validateDigit(e.target.value);
                            setFieldValue("qty", validNum);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <div style={{ marginTop: "15px" }} className="col-lg-1">
                          <button
                            type="button"
                            onClick={() => {
                              addHandler(values, resetForm, setFieldValue);
                            }}
                            className="btn btn-primary"
                            disabled={
                              !values?.itemName || !values?.uom || !values?.qty
                            }
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th className="text-left">Item Code</th>
                              <th>Item Name</th>
                              <th>UoM</th>
                              <th>Quantity</th>
                              <th style={{ width: "50px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemList?.length > 0 &&
                              itemList?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">
                                    {item?.strMedicineItemCode}
                                  </td>
                                  <td className="text-center">
                                    {item?.strMedicineItemName}
                                  </td>
                                  <td className="text-center">
                                    {item?.strUoMname}
                                  </td>
                                  <td className="text-center">
                                    {item?.numStockQty}
                                  </td>
                                  <td className="text-center">
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"Remove"}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i
                                          className={`fa fa-trash`}
                                          onClick={() => {
                                            removeHandler(index);
                                          }}
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                  </td>
                                </tr>
                              ))}
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
                </Form>
              </>
            )}
          </Formik>
        </>
      </IForm>
    </>
  );
}
