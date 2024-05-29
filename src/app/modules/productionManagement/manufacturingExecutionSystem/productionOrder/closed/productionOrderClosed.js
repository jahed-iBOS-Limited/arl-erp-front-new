import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { validateDigit } from "../../../../_helper/validateDigit";
import IForm from "../../../../_helper/_form";
import { IInput } from "../../../../_helper/_input";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  transDate: _todayDate(),
};
export default function ProductionOrderClosed() {
  const [objProps, setObjprops] = useState({});
  const [
    productionOrderList,
    getProductionOrderList,
    // eslint-disable-next-line no-unused-vars
    getLoading,
    setProductionOrderList,
  ] = useAxiosGet();
  const [, closedProductionOrder, closedLoading] = useAxiosPost();
  //const { id } = useParams();
  const location = useLocation();
  //const [modifyData, setModifyData] = useState(initData);
  const {
    productionOrderId,
    itemName,
    workCenterName,
    orderQty,
  } = location?.state;

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getProductionOrderList(
      `/mes/ProductionOrder/GetProductionOrderForClose?productionOrderId=${productionOrderId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productionOrderId]);

  const saveHandler = async (values, cb) => {
    const proOrderList = productionOrderList?.materialList?.map((itm) => {
      return {
        itemId: itm?.itemId,
        itemName: itm?.itemName,
        itemCode: itm?.itemCode,
        uomId: itm?.uomId,
        uomName: itm?.uomName,
        issueQuantity: itm?.issueQuantity,
        returnQuantity: +itm?.returnQuantity,
        warehouseId: itm?.warehouseId,
      };
    });

    const payload = {
      productionOrderId: productionOrderList?.productionOrderId,
      itemId: productionOrderList?.itemId,
      itemName: productionOrderList?.itemName,
      bomId: productionOrderList?.bomId,
      bomName: productionOrderList?.bomName,
      bomVersion: productionOrderList?.bomVersion,
      quantity: productionOrderList?.quantity,
      actionBy: profileData.userId,
      transDate: values?.transDate,
      materialList: proOrderList,
    };
    closedProductionOrder(
      `/mes/ProductionOrder/SaveProductionOrderForClose`,
      payload,
      null,
      true
    );
  };

  const rowDtoHandler = (name, index, value) => {
    const data = [...productionOrderList?.materialList];
    const obj = {
      ...productionOrderList,
      materialList: data,
    };
    obj.materialList[index][name] = value;
    setProductionOrderList(obj);
  };

  return (
    <IForm
      title="Production Order Closed"
      getProps={setObjprops}
      submitBtnText="Closed"
    >
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setProductionOrderList([]);
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
                {closedLoading && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-12">
                      <h6>
                        <b>Order Details</b>
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <p>Bom Name: {productionOrderList?.bomName}</p>
                    </div>
                    <div className="col-lg-4">
                      <p>Item Name: {itemName}</p>
                    </div>
                    <div className="col-lg-4">
                      <p>Work Center Name: {workCenterName}</p>
                    </div>
                    <div className="col-lg-4">
                      <p>Quantity: {orderQty}</p>
                    </div>
                    <div className="col-lg-3 mb-3">
                      <label>Trans Date</label>
                      <InputField
                        value={values?.transDate}
                        name="transDate"
                        placeholder="Trans Date"
                        type="date"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12 mt-3">
                    <h6>
                      <b>Material Description</b>
                    </h6>
                  </div>
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th className="text-left">Item Code </th>
                            <th className="text-left">Item Name </th>
                            <th className="text-left">UoM </th>
                            <th className="text-center">Issue Quantity</th>
                            <th className="" style={{ width: "140px" }}>
                              Return Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productionOrderList?.materialList?.length > 0 &&
                            productionOrderList?.materialList?.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td className="text-left">
                                    {item?.itemCode}
                                  </td>
                                  <td>{item?.itemName}</td>
                                  <td>{item?.uomName}</td>
                                  <td className="text-center">
                                    {item?.issueQuantity}
                                  </td>
                                  <td
                                    className="disabled-feedback disable-border"
                                    style={{ width: "100px" }}
                                  >
                                    <IInput
                                      value={
                                        productionOrderList?.materialList[index]
                                          ?.returnQuantity
                                      }
                                      name="returnQuantity"
                                      type="tel"
                                      min="0"
                                      // max={item?.referenceNo && item?.restofQty}
                                      onChange={(e) => {
                                        let validNum = validateDigit(
                                          e.target.value
                                        );
                                        //   if (validNum > item?.restofQty && item?.referenceNo) {
                                        //     alert(`Maximum ${item?.restofQty}`);
                                        //     validNum = "";
                                        //   }
                                        rowDtoHandler(
                                          "returnQuantity",
                                          index,
                                          validNum
                                        );
                                      }}
                                    />
                                  </td>
                                </tr>
                              )
                            )}
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
