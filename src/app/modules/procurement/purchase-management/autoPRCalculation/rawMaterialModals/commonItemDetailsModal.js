import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../purchaseOrder/customHooks/useAxiosGet";
import {
  fetchCommonItemDetailsData,
  floatingStockTableHeader,
  openPOTableHeader,
} from "./helper";

const CommonItemDetailsModal = ({ objProp }) => {
  // obj props
  const { commonItemDetailsState, commonItemDetailsDispatch, values } = objProp;

  // state
  const [objProps, setObjprops] = useState({});

  // api action
  const [
    commonItemData,
    getCommonItemData,
    getCommonItemDataLoading,
  ] = useAxiosGet();

  // use effect
  useEffect(() => {
    fetchCommonItemDetailsData({
      getCommonItemData,
      commonItemDetailsState,
      commonItemDetailsDispatch,
      values
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("Common", commonItemDetailsState);

  // loading
  const isLoading = getCommonItemDataLoading;

  // common item details state
  const { partName } = commonItemDetailsState;

  // total po qty (common item data)
  const totalPOQty = commonItemData?.reduce(
    (acc, item) => acc + item?.numQTY || 0,
    0
  );

  // balance on ghat (common item details => single item)
  const {
    singleRowData: { balanceOnGhat },
  } = commonItemDetailsState;

  return (
    <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => {}}>
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
          {isLoading && <Loading />}
          <IForm
            isHiddenBack
            isHiddenReset
            isHiddenSave
            customTitle={`${commonItemDetailsState?.partName} Details`}
            getProps={setObjprops}
          >
            <Form>
              <div className="table-responsive">
                {commonItemData?.length > 0 ? (
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        {partName === "FloatingStock" || partName === "OpenPR"
                          ? floatingStockTableHeader?.map((item, index) => (
                              <th key={index}>{item}</th>
                            ))
                          : openPOTableHeader?.map((item, index) => (
                              <th key={index}>{item}</th>
                            ))}
                      </tr>
                    </thead>
                    <tbody>
                      {commonItemData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">{item?.strPlantName}</td>
                          <td>{item?.strWarehouseName}</td>
                          <td className="text-center">
                            {partName === "FloatingStock" ||
                            partName === "OpenPR"
                              ? item?.strPurchaseRequestCode
                              : item?.strPurchaseOrderNo}
                          </td>
                          <td className="text-right">{item?.numQTY}</td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan={4}>Total</td>
                        <td className="text-right">
                          {totalPOQty - balanceOnGhat || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default CommonItemDetailsModal;
