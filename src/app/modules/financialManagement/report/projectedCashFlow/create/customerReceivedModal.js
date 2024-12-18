import React from "react";
import InputField from "../../../../_helper/_inputField";
import IButton from "../../../../_helper/iButton";

const CustomerReceivedModal = ({ objProps }) => {
  // destrcuture
  const {
    customerReceivedRowData,
    setCustomerReceivedRowData,
    crSaveButtonRef,
  } = objProps;

  // handle common input value change
  const commonInputValueChange = (name, index, value) => {
    // set customer received row data
    setCustomerReceivedRowData((prevData) => {
      // create a shallow copy
      const newData = [...prevData];

      // get index's item
      newData[index] = {
        ...newData[index], // keep all index's item property
        [name]: value, // update input filed name with value
      };

      return newData;
    });
  };

  return (
    <div className="row">
      <div class="col-lg-12 justify-content-end">
        <IButton
          onClick={() => crSaveButtonRef.current.click()}
          title="Save"
        ></IButton>
      </div>
      <div className="table-responsive mt-5 col-lg-12">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Date</th>
              <th>Business Unit</th>
              <th>Amount</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {customerReceivedRowData?.length > 0 ? (
              customerReceivedRowData?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.paymentDate}</td>
                  <td>{item?.businessUnitName}</td>
                  <td>
                    <InputField
                      value={item?.receivedAmount}
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        commonInputValueChange("receivedAmount", index, value);
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.remarks}
                      type="text"
                      onChange={(e) => {
                        const value = e.target.value;
                        commonInputValueChange("remarks", index, value);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerReceivedModal;
