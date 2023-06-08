import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../_helper/_input";

const headers = [
    "SL",
    "Item Code",
    "Item Name",
    "Description",
    "Element",
    "PO Qty",
    "Net Value",
    "Vat",
    "Rest Qty",
    "Previous Receive",
    "Receive Qty",
    "Service Amount",
    "Action"
]

const TBody = ({rowDto,rowDtoHandler,isEdit,remover}) => {
  return (
    <>
    {rowDto &&
      rowDto.length > 0 &&
      rowDto.map((item, index) => {
        return (
          <tr key={index}>
            <td style={{ textAlign: "center" }}>{index + 1}</td>
        <td style={{ textAlign: "center" }}>{item.itemCode}</td>
        <td>{item.itemName}</td>
        <td>{item?.itemDescription}</td>
        <td>{item?.costRevenueName+ " " + item?.elementName}</td>
        <td style={{ textAlign: "center" }}>{item?.poQuantity}</td>
        <td style={{ textAlign: "center" }}>{item?.totalValue}</td>
        <td style={{ textAlign: "center" }}>{item?.vatValue}</td>
        <td style={{ textAlign: "center" }}>{item.poQuantity - item.receiveQuantity}</td>
        <td style={{ textAlign: "center" }}>{item?.receiveQuantity}</td>
        <td style={{ width: "150px" }} className="disabled-feedback disable-border">
                    <IInput
                      value={rowDto[index]?.quantity}
                      name="quantity"
                      type="number"
                      placeholder="Quantity"
                      required
                      step="any"
                      onChange={(e) => {
                        const refQty = item?.poQuantity
                        const restQty = item.poQuantity - item.receiveQuantity
                        //user can take 7% extra qty
                        let calcWithFivePercent = (refQty * 7) / 100;
                        let canTakeQty = (restQty + calcWithFivePercent).toFixed(4);
                        if (+e.target.value > canTakeQty) {
                          alert(`Max ${canTakeQty}`);
                          return null;
                        }
                        rowDtoHandler("quantity", e.target.value, index);
                      }}
                      min={0}
                    />
                  </td>          
                  <td style={{ textAlign: "center" }}>{item.serviceAmount.toFixed(4)}</td>
                  <td className="text-center align-middle">
                    <IDelete remover={remover} id={index} />
                  </td>
          </tr>
        );
      })}
  </>
  );
};

function CreatePageTable({rowDto,rowDtoHandler,isEdit,remover}) {
    return <ICustomTable ths={headers} children={<TBody rowDto={rowDto} rowDtoHandler={rowDtoHandler} isEdit={isEdit} remover={remover} />} />;
}

export default CreatePageTable;
