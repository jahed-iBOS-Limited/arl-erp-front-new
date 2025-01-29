import { Form, Formik } from "formik";
import React from "react";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";

const TransferOutTableHeader = [
  "Transaction Code",
  "Item Name",
  "Available Stock",
  "UoM",
  "Item Price",
  "Transaction Quantity",
  "Transacton Value",
];

export default function TransferOutListModal({ obj }) {
  // destructure
  const { transferOutData, setTransferOutData } = obj;

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
          <IForm
            isHiddenBack
            isHiddenReset
            isHiddenSave
            customTitle={`Transfer Out`}
            // getProps={setObjprops}
          >
            <Form>
              <div className="table-responsive">
                {transferOutData?.length > 0 ? (
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        {TransferOutTableHeader?.map((item, index) => (
                          <th key={index}>{item}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transferOutData?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.inventoryTransactionCode}</td>
                          <td>{item?.itemName}</td>
                          <td className="text-right">{item?.availableStock}</td>
                          <td>{item?.uoMname}</td>
                          <td>{item?.itemPrice || 0}</td>
                          <td>
                            <InputField
                              value={item?.transactionQuantity || ""}
                              type="number"
                              onChange={(e) => {
                                const value = e.target.value;
                                const updatedData = [...transferOutData];
                                updatedData[index][
                                  "transactionQuantity"
                                ] = +value;
                                if (item?.itemPrice) {
                                  updatedData[index]["transactionValue"] =
                                    +value * +item?.itemPrice;
                                }
                                updatedData[index]["transactionValue"] = 0;
                                setTransferOutData(updatedData);
                              }}
                            />
                          </td>
                          <td>{item?.transactionValue || 0}</td>
                        </tr>
                      ))}
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
}
