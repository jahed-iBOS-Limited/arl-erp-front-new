import React, { useState } from "react";
import InputField from "../../../_helper/_inputField";

function MonthlyModal() {
  const [monthsArray, setMonthArray] = useState([
    { monthName: "January", monthId: 1, value: "" },
    { monthName: "February", monthId: 2, value: "" },
    { monthName: "March", monthId: 3, value: "" },
    { monthName: "April", monthId: 4, value: "" },
    { monthName: "May", monthId: 5, value: "" },
    { monthName: "June", monthId: 6, value: "" },
    { monthName: "July", monthId: 7, value: "" },
    { monthName: "August", monthId: 8, value: "" },
    { monthName: "September", monthId: 9, value: "" },
    { monthName: "October", monthId: 10, value: "" },
    { monthName: "November", monthId: 11, value: "" },
    { monthName: "December", monthId: 12, value: "" },
  ]);

  return (
    <>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary">Save</button>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered  global-table">
            {/* <thead>
            {monthsArray?.map((item, i) => (
              <tr>
                <th>{item?.monthName}</th>
              </tr>
            ))}
          </thead> */}
            <tbody>
              {monthsArray?.map((item, i) => (
                <tr>
                  <td>{item?.monthName}</td>
                  <td style={{ minWidth: "70px" }}>
                    <InputField
                      value={item?.standardValue}
                      type="number"
                      onChange={(e) => {
                        let modiFyRow = [...monthsArray];
                        modiFyRow[i]["value"] = +e.target.value || "";
                        setMonthArray(modiFyRow);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MonthlyModal;
