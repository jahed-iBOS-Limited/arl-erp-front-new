import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";

const initData = {};
export default function RMPRItemList() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  const location = useLocation();
  const [rowData, getRowData, getLoading] = useAxiosPost();

  const prItemList = location?.state;

  let modifyItem = [];
  for (let element of prItemList?.qcList) {
    if (element?.isPRCompleted && !element?.intPurchaseRequestId) {
      modifyItem.push(element?.intWeightmentId);
    }
  }

  useEffect(() => {
    getRowData(`/mes/WeightBridge/GetAllQCRawMaterialListForPR`, modifyItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    const payload = {
      itemList: rowData?.itemList,
      weightmentId: modifyItem,
      intActionBy: profileData?.userId,
      intBusinessUnitId: selectedBusinessUnit?.value,
    };
    saveData(
      `/mes/WeightBridge/CreateAndEditPurchaseRequestForQC`,
      payload,
      cb,
      true
    );
  };

  return (
    <IForm
      customTitle="Raw Material Auto PR Create"
      getProps={setObjprops}
      isHiddenReset
    >
      {getLoading && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => { });
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

                {/* <div className="row">
                  <div className="col-lg-12">
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
                </div> */}

                <div className="row mt-4">
                  <div className="col-lg-4">
                    <b style={{ fontSize: "16px" }}>Item List</b>
                  </div>
                  <div className="col-lg-8">
                    <strong style={{ marginRight: "30px" }}>
                      Less Quantity : {rowData?.numTotalLessQuantity} MT
                    </strong>
                    <strong>
                      Over Size Quantity : {rowData?.numTotalOverSizeQuantity}{" "}
                      MT
                    </strong>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.itemList?.length > 0 &&
                          rowData?.itemList.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strItemCode}</td>
                              <td>{item?.strItemName}</td>
                              <td>{"Metric Tons"}</td>
                              <td>{item?.numQuantity}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
