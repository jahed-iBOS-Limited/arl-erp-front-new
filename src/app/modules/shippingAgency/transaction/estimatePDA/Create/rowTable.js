import React from "react";
import InputField from "../../../../_helper/_inputField";
import IAdd from "../../../../_helper/_helperIcons/_add";
import IViewModal from "../../../../_helper/_viewModal";
import BillForm from "./billForm";

function RowTable({ rowDto, setRowDto }) {
  const [isBillModal, isShowBillModal] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});

  return (
    <div className='table-responsive'>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
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
              <td>{item?.category}</td>
              <td>{item?.particularName}</td>
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
              <td>
                {item?.estimatePDABillCreateDtos?.length > 0 && (
                  <>{item?.actualAmount}</>
                )}
              </td>
              <td className='text-center'>
                <span
                  className='pointer'
                  onClick={() => {
                    isShowBillModal(true);
                    setClickRowData({
                      ...item,
                      rowIdx: index,
                    });
                  }}
                >
                  <IAdd title={"Bill Add"} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {// Bill Modal
      isBillModal && (
        <>
          <IViewModal
            show={isBillModal}
            onHide={() => {
              isShowBillModal(false);
              setClickRowData({});
            }}
          >
            <BillForm
              clickRowData={clickRowData}
              estimatePDABillAddHandler={({ billRowDto, cb }) => {
                const copyRowDto = [...rowDto];
                copyRowDto[
                  clickRowData?.rowIdx
                ].estimatePDABillCreateDtos = billRowDto;
                const actualAmount =  billRowDto?.reduce(
                  (acc, cur) => acc + (+cur?.total || 0),
                  0
                ) || 0 
                copyRowDto[clickRowData?.rowIdx].actualAmount = actualAmount;
                setRowDto(copyRowDto);
                isShowBillModal(false);
                setClickRowData({});
              }}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
}

export default RowTable;
