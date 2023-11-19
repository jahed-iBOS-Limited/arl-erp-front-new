import React from "react";
import InputField from "../../../../_helper/_inputField";
import IAdd from "../../../../_helper/_helperIcons/_add";

function RowTable({ rowDto, setRowDto }) {
  return (
    <div>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Code</th>
            <th>Category</th>
            <th>Expense Particulars</th>
            <th
              style={{
                width: "150px",
              }}
            >
              Estimated Amount
            </th>
            <th
              style={{
                width: "150px",
              }}
            >
              Customer Final Amount
            </th>
            <th>Actual Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>
                <InputField
                  value={item?.estimatedAmount}
                  name='estimatedAmount'
                  type='text'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].estimatedAmount = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.customerFinalAmount}
                  name='customerFinalAmount'
                  type='text'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].customerFinalAmount = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td></td>

              <td className='text-center'>
                <span
                  className='pointer'
                  onClick={() => {
                    const copyRowDto = rowDto.filter(
                      (itm, idx) => idx !== index
                    );
                    setRowDto(copyRowDto);
                  }}
                >
                  <IAdd />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RowTable;
