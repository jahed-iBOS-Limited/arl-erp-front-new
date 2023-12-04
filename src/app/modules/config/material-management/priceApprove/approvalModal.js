import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {};

export default function ApprovalModal({ tableData, values, setTableData }) {
  console.log(
    "🚀 ~ file: approvalModal.js:10 ~ ApprovalModal ~ tableData:",
    tableData
  );
  const [objProps, setObjprops] = useState({});

  const filterTableData = tableData?.data?.filter((data) => data?.isChecked);

  const saveHandler = (values, cb) => {
    console.log("filterTableData", filterTableData);
  };

  const handleUpdateTableData = (field, value) => {
    console.log("field", field, "value", value);
    const cloneTableData = [...tableData?.data];
    const index = cloneTableData?.findIndex((data) => data?.isChecked);
    cloneTableData[index][field] = value;
    setTableData({
      ...tableData,
      data: cloneTableData,
    });
  };
  return (
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
          {false && <Loading />}
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
                    {filterTableData?.length > 0 &&
                      filterTableData?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.conditionTypeName}</td>
                          <td>{data?.itemName}</td>
                          <td className="text-right">
                            {
                              <InputField
                                value={data?.price}
                                name="price"
                                type="number"
                                min="0"
                                onChange={(e) => {
                                  handleUpdateTableData(
                                    "price",
                                    e.target.value
                                  );
                                }}
                              />
                            }
                          </td>
                          <td>
                            {
                              <InputField
                                value={_dateFormatter(data?.startDate)}
                                name="startDate"
                                type="date"
                                onChange={(e) => {
                                  handleUpdateTableData(
                                    "startDate",
                                    e.target.value
                                  );
                                }}
                              />
                            }
                          </td>
                          <td>
                            {
                              <InputField
                                value={_dateFormatter(data?.endDate)}
                                name="endDate"
                                type="date"
                                onChange={(e) => {
                                  handleUpdateTableData(
                                    "endDate",
                                    e.target.value
                                  );
                                }}
                              />
                            }
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
