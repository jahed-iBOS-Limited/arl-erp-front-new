/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

function Form({ menuListArray, editMode, onChangeFiledHandler, menuFormData }) {
  return (
    <div>
      <div className="table-responsive">
        <table className="global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Day</th>
              <th>Menu List</th>
            </tr>
          </thead>

          <tbody>
            {menuListArray &&
              menuListArray.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="border px-2">{item?.intDayOffId}</td>
                    <td className="border px-2">{item?.strDayName}</td>
                    <td className="border w-100">
                      {editMode ? (
                        <textarea
                          onChange={(e) =>
                            onChangeFiledHandler(
                              item.strDayName.toLowerCase(),
                              e.target.value
                            )
                          }
                          value={
                            menuFormData[`${item?.strDayName.toLowerCase()}`]
                          }
                          className="w-100 form-control"
                        ></textarea>
                      ) : (
                        <span className="d-block w-100 p-3">
                          {item?.strMenuList}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Form;
