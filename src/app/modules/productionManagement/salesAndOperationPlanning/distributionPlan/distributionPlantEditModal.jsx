import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import { Form, Formik } from "formik";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const DistributionPlantEditModal = ({
  editData,
  landingValues,
  setIsEditModal,
}) => {
  const [objProps, setObjprops] = useState({});
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  // https://deverp.ibos.io/oms/DistributionChannel/GetDistributionItemById?DistributionPlanningId=578

  useEffect(() => {
    if (editData?.distributionPlanningId) {
      getRowData(
        `/oms/DistributionChannel/GetDistributionItemById?DistributionPlanningId=${editData?.distributionPlanningId}`,
        (data) => {
          console.log("resdata", data);
        }
      );
      console.log("editData", editData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData?.distributionPlanningId]);

  const getAbsoluteValue = (e) => {
    let newValue = +e?.target?.value;
    newValue = newValue < 0 ? Math?.abs(newValue) : newValue;
    return newValue;
  };

  const handleSubmit = () => {
    console.log("saveHandler", rowData);

    // loop through the rowData and create a new array. NOTE: Item has planQty and planRate should be greater than 0 will be added to the new array
    const modifiedPayload =
      rowData?.filter((item) => item?.planQty > 0 && item?.planRate > 0) || [];

    console.log("modifiedPayload", modifiedPayload);

    saveData(
      `/oms/DistributionChannel/UpdateDistributionPlanningRow`,
      modifiedPayload,
      () => {
        setIsEditModal(false);
      },
      true
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        handleSubmit();
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
          {(rowDataLoader || saveDataLoader) && <Loading />}
          <IForm
            title={"Distribution Plan Edit"}
            getProps={setObjprops}
            isHiddenReset
            isHiddenBack
          >
            <Form>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Plant</th>
                          <th>Warehouse</th>
                          {/* <th>Distribution Plant Qty</th> */}
                          <th>Plan Qty</th>
                          <th>Plan Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.itemCode}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.itemUoMName}</td>
                              <td>{item?.strPlantHouseName}</td>
                              <td>{item?.strWareHouseName}</td>
                              {/* <td className="text-center">
                              {item?.distributionPlanQty
                                ? item?.distributionPlanQty
                                : 0}
                            </td> */}
                              <td>
                                <InputField
                                  name="planQty"
                                  type="number"
                                  value={item?.planQty || ""}
                                  onChange={(e) => {
                                    const modifiedData = [...rowData];
                                    modifiedData[
                                      index
                                    ].planQty = getAbsoluteValue(e);
                                    setRowData(modifiedData);
                                  }}
                                />
                              </td>
                              <td>
                                <InputField
                                  name="planRate"
                                  type="number"
                                  value={item?.planRate || ""}
                                  onChange={(e) => {
                                    const modifiedData = [...rowData];
                                    modifiedData[
                                      index
                                    ].planRate = getAbsoluteValue(e);
                                    setRowData(modifiedData);
                                  }}
                                />
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

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default DistributionPlantEditModal;
