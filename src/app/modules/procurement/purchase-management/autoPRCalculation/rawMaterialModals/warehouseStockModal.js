import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../purchaseOrder/customHooks/useAxiosGet";
import { fetchWarehouseStockDetailsData } from "./helper";

const WarehouseStockModal = ({ objProp }) => {
  // obj props
  const { singleRowData, setSingleRowData, values } = objProp;

  // state
  const [objProps, setObjprops] = useState({});

  const [
    warestockData,
    getWarehouseStockData,
    warehouseStockDataLoading,
  ] = useAxiosGet();

  useEffect(() => {
    fetchWarehouseStockDetailsData({
      getWarehouseStockData,
      singleRowData,
      setSingleRowData,
      values,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = warehouseStockDataLoading;
  return (
    <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => { }}>
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
            customTitle="Warehouse Stock Details"
            getProps={setObjprops}
          >
            <Form>
              <div className="table-responsive">
                <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>Item Code</th>
                      <th>UoM Name</th>
                      <th>Open Qty</th>
                      <th>In Qty</th>
                      <th>Out Qty</th>
                      <th>Closing Qty</th>
                      <th>Closing Value</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warestockData?.length > 0 &&
                      warestockData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="">{item?.strItemName}</td>
                          <td className="text-center">{item?.strItemCode}</td>
                          <td className="text-center">{item?.strBaseUOM}</td>
                          <td className="text-right">
                            {item?.numOpenQty || 0}
                          </td>
                          <td className="text-right">{item?.numInQty || 0}</td>
                          <td className="text-right">{item?.numOutQty || 0}</td>
                          <td className="text-right">{item?.numCloseQty || 0}</td>
                          <td className="text-right">{item?.numClosingValue || 0}</td>
                          <td className="text-right">{item?.numRate || 0}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default WarehouseStockModal;
