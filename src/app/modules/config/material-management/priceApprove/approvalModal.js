import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
const initData = {};

export default function ApprovalModal({
  cehckedItems,
  setCheckedItems,
  landingValues,
  getTableDataFromApi,
  setIsShowApprovalModal,
}) {
  const [objProps, setObjprops] = useState({});
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, saveData, saveDataLoader] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = cehckedItems?.map((itm) => {
      return {
        priceRequestId: itm?.priceRequestId,
        price: itm?.price,
        startDate: _dateFormatter(itm?.startDate),
        endDate: _dateFormatter(itm?.endDate),
        actionBy: profileData?.userId,
      };
    });
    saveData(`/item/PriceSetup/ApprovePriceRequest`, payload, cb && cb, true);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          getTableDataFromApi(landingValues);
          setIsShowApprovalModal(false);
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
          {saveDataLoader && <Loading />}
          <IForm
            isHiddenBack={true}
            isHiddenReset={true}
            title="Item Price Approve"
            getProps={setObjprops}
          >
            <Form>
              <div className="table-responsive">
                <table className="table global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Condition Type</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cehckedItems?.length > 0 &&
                      cehckedItems?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.conditionTypeName}</td>
                          <td>{data?.itemName}</td>
                          <td className="text-right">
                            <InputField
                              value={data?.price}
                              name="price"
                              type="number"
                              min="0"
                              onChange={(e) => {
                                const cloneArr = [...cehckedItems];
                                cloneArr[index]["price"] = e.target.value;
                                setCheckedItems([...cloneArr]);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={_dateFormatter(data?.startDate)}
                              name="startDate"
                              type="date"
                              onChange={(e) => {
                                if (e) {
                                  const cloneArr = [...cehckedItems];
                                  cloneArr[index]["startDate"] = e.target.value;
                                  cloneArr[index]["endDate"] = null;
                                  setCheckedItems([...cloneArr]);
                                } else {
                                  const cloneArr = [...cehckedItems];
                                  cloneArr[index]["startDate"] = null;
                                  cloneArr[index]["endDate"] = null;
                                  setCheckedItems([...cloneArr]);
                                }
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={_dateFormatter(data?.endDate)}
                              name="endDate"
                              type="date"
                              min={data?.startDate}
                              onChange={(e) => {
                                if (e) {
                                  const cloneArr = [...cehckedItems];
                                  cloneArr[index]["endDate"] = e.target.value;
                                  setCheckedItems([...cloneArr]);
                                } else {
                                  const cloneArr = [...cehckedItems];
                                  cloneArr[index]["endDate"] = null;
                                  setCheckedItems([...cloneArr]);
                                }
                              }}
                              disabled={!data?.startDate}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
          </IForm>
        </>
      )}
    </Formik>
  );
}
