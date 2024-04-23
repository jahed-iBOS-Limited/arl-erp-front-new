import React, { useState } from "react";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";

const SalesOrderRowTable = ({
  //rowDto,
  // remover,
  //setRowDto,
  salesQuotationDetails,
  setSalesQuotationDetails,
  values,
  selectedBusinessUnit,
  profileData,
  setFieldValue,
}) => {
  // const [isShowModal, setIsShowModal] = useState(false);
  // const [currentRowData] = useState("");
  // const [currentIndex] = useState(null);
  // const [orderQtyCheck, setOrderQtyCheck] = useState(false);
  // const [basicPriceCheck, setBasicPriceCheck] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // const dispatch = useDispatch()

  // const setAllOrderQty = (orderQtyCheck) => {
  //   // set every row orderQty = restofQty
  //   // we use rowDtoHandler because this function will set orderQty, and also calculate net amount
  //   rowDto.forEach((item, index) => {
  //     rowDtoDynamicHandler(
  //       "orderQty",
  //       orderQtyCheck ? item?.restofQty : 0,
  //       index,
  //       rowDto,
  //       setRowDto
  //     );
  //   });
  // };
  // const setAllBasicPrice = (basicPriceCheck) => {
  //     rowDto.forEach((item, index) => {
  //       console.log("basci Item", item)
  //       rowDtoDynamicHandler(
  //         "basicPrice",
  //         basicPriceCheck ? item?.negotiationRate : 0,
  //         index,
  //         rowDto,
  //         setRowDto
  //       );
  //     });
  // };

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handlePopoverOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const [currentItem, setCurrentItem] = useState("");

  const totalFOBValue = (soRow, type) => {
    const totalCTN = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalCarton || 0),
      0
    );
    const totalPCS = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalPieces || 0),
      0
    );
    const totalFOBRatePCSBDT = soRow?.RowData?.reduce(
      (a, b) => a + (b?.FobRatePerPieceBDT || 0),
      0
    );
    const totalFOBAmountBDT = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalFobAmountBDT || 0),
      0
    );

    const totalCNFValue =
      totalFOBAmountBDT + soRow?.HeaderData?.FreightAmountBDT;

    if (type === 1) {
      return totalCTN;
    }
    if (type === 2) {
      return _formatMoney(totalPCS);
    }
    if (type === 3) {
      return _formatMoney(totalFOBRatePCSBDT);
    }
    if (type === 4) {
      return _formatMoney(totalFOBAmountBDT);
    }
    if (type === 5) {
      return _formatMoney(totalCNFValue);
    }
  };

  return (
    <div>
      {loading && <Loading />}
      {/* {rowDto?.length > 0 && ( */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div>
          <InputField
            name="modifyCiPercentage"
            value={values?.modifyCiPercentage || ""}
            placeholder="Modify CI Percentage"
            type="number"
            className="form-control"
            disabled={!salesQuotationDetails?.Data?.RowData?.length}
            onChange={(e) => {
              if (+e.target.value < 0 || +e.target.value > 100) return;
              setFieldValue("modifyCiPercentage", e.target.value || "");
              const modifyData = salesQuotationDetails?.Data?.RowData?.map(
                (item) => {
                  let numericTotalAmount =
                    parseFloat(+item?.FobRatePerPieceBDT) || 0;

                  let modifyCiRate =
                    ((numericTotalAmount || 0) * (+e?.target?.value || 0)) /
                    100;

                  return {
                    ...item,
                    ciRate: modifyCiRate,
                    ciValue: modifyCiRate * (item?.TotalPieces || 0),
                    modifyCiPercentage: +e.target.value || 0,
                  };
                }
              );
              const updatedData = { ...salesQuotationDetails };
              updatedData.Data.RowData = modifyData;
              setSalesQuotationDetails(updatedData);
            }}
          />
        </div>
      </div>
      <>
        <table className="table table-striped table-bordered mt-3 global-table po-table">
          <thead>
            <tr>
              {/* <th style={{ fontSize: "10px" }}>SL</th>
                <th style={{ width: "150px", fontSize: "10px" }}>Reference No</th>
                <th style={{ width: "70px", fontSize: "10px" }}>Specification</th>
                <th style={{ width: "150px", fontSize: "10px" }}>Ship To Party</th>
                <th style={{ fontSize: "10px" }}>Item Code</th>
                <th style={{ fontSize: "10px" }}>Item Name</th>
                <th style={{ fontSize: "10px" }}>Customer Item Name</th>               
                <th style={{ fontSize: "10px" }}>UOM</th>
                <th style={{ fontSize: "10px" }}>Is Free</th>
                <th style={{ fontSize: "10px" }}>Quantity</th>
                <th style={{ fontSize: "10px" }}>Basic Price</th>
                <th style={{ fontSize: "10px" }}>Amount</th>
                <th style={{ fontSize: "10px" }}>Discount</th>
                <th style={{ fontSize: "10px" }}>Net Value</th>
                <th style={{ fontSize: "10px" }}>Action</th> */}

              <th className="text-center">Sl</th>
              <th>PRODUCT CODE</th>
              <th>DESCRIPTION OF GOODS</th>
              <th>PACKING SIZE</th>
              {salesQuotationDetails?.Data?.Head?.map((item, index) => {
                return <th>{item?.HeaderName.toUpperCase()}</th>;
              })}
              <th>TOTAL PCS</th>
              <th>FOB RATE PCS BDT</th>
              <th>TOTAL AMOUNT FOB BDT</th>
              <th>COGS</th>
              <th>CI RATE</th>
              <th>CI VALUE</th>
            </tr>
          </thead>
          <tbody>
            {salesQuotationDetails?.Data?.RowData?.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item?.ItemCode.toUpperCase()}</td>
                <td>{item?.ItemName.toUpperCase()}</td>
                <td>{item?.PackingDetails.toUpperCase()}</td>
                {item?.Headings?.map((itm, index) => (
                  <td>{itm?.HeaderValue}</td>
                ))}
                <td>{item?.TotalPieces}</td>
                <td className="text-right">
                  {item?.FobRatePerPieceBDT
                    ? _formatMoney(item?.FobRatePerPieceBDT)
                    : ""}
                </td>
                <td className="text-right">
                  {item?.TotalFobAmountBDT
                    ? _formatMoney(item?.TotalFobAmountBDT)
                    : ""}
                </td>
                <td className="text-right">
                  <input
                    type="number"
                    value={item?.cogs || ""}
                    onChange={(e) => {
                      const updatedData = { ...salesQuotationDetails };
                      updatedData.Data.RowData[index].cogs =
                        e.target.value || "";
                      setSalesQuotationDetails(updatedData);
                    }}
                  />
                </td>
                <td className="text-right">
                  <input
                    type="number"
                    value={item?.ciRate}
                    // value={item?.ciRate ? item?.ciRate?.toFixed(4) : 0 || ""}
                    onChange={(e) => {
                      const updatedData = { ...salesQuotationDetails };
                      updatedData.Data.RowData[index].ciRate =
                        e.target.value || "";
                      updatedData.Data.RowData[index].ciValue =
                        e.target.value * item?.TotalPieces;
                      setSalesQuotationDetails(updatedData);
                    }}
                  />
                </td>
                <td className="text-right">
                  {item?.ciRate ? _formatMoney(item?.ciValue) : ""}
                </td>
              </tr>
            ))}
            <tr>
              <td
                className="font-weight-bold"
                colSpan={salesQuotationDetails?.Data?.Head?.length + 3}
              >
                Total FOB VALUE
              </td>
              <td>{totalFOBValue(salesQuotationDetails?.Data, 1)}</td>
              <td className="text-right font-weight-bold">
                {totalFOBValue(salesQuotationDetails?.Data, 2)}
              </td>
              <td>{""}</td>
              <td className="text-right font-weight-bold">
                {totalFOBValue(salesQuotationDetails?.Data, 4)}
              </td>
            </tr>
            <tr>
              <td
                className="font-weight-bold"
                colSpan={salesQuotationDetails?.Data?.Head?.length + 6}
              >
                FREIGHT
              </td>
              <td className="text-right">
                {salesQuotationDetails?.Data?.HeaderData?.FreightAmountBDT
                  ? _formatMoney(
                      salesQuotationDetails?.Data?.HeaderData?.FreightAmountBDT
                    )
                  : ""}
              </td>
            </tr>

            <tr>
              <td
                className="font-weight-bold"
                colSpan={salesQuotationDetails?.Data?.Head?.length + 6}
              >
                TOTAL CNF VALUE
              </td>
              <td className="text-right">
                {totalFOBValue(salesQuotationDetails?.Data, 5)}
              </td>
            </tr>

            {/* {rowDto?.map((item, index) => {
                //getUomDDL(item?.item?.value);

                return (
                  <tr key={index}>
                    <td className="text-center align-middle"> {index + 1} </td>
                    <td className="align-middle" style={{ fontSize: "10px" }}>
                      {item?.referenceNoName}
                    </td>
                    <td style={{ width: "100px" }}>
                      {item?.specification}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
                    >
                      {item?.shipToPartnerName}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
                    >
                      {item?.itemCode}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
                    >
                      {item?.itemName}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
                    >
                      {item?.customerItemName}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
                    >
                      {item?.uomName}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
                    >
                      {item?.isFree}
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.numRequestQuantity}
                        name="numRequestQuantity"
                        type="tel"
                        min="0"
                        required
                        onChange={(e) => {
                          let validNum = validateDigit(e.target.value);

                          // if (validNum > item?.restofQty && item?.referenceNo) {
                          //   alert(`Maximum ${item?.restofQty}`);
                          //   validNum = "";
                          // }
                          // rowDtoDynamicHandler(
                          //   "numRequestQuantity",
                          //   validNum,
                          //   index,
                          //   rowDto,
                          //   setRowDto
                          // );
                        }}
                      />
                    </td>
                    
                    <td
                      className="disabled-feedback disable-border"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.numItemPrice}
                        name="numItemPrice"
                        type="tel"
                        min="0"
                        required
                        onChange={(e) => {
                          const validNum = validateDigit(e.target.value);
                          // rowDtoDynamicHandler(
                          //   "numItemPrice",
                          //   validNum,
                          //   index,
                          //   rowDto,
                          //   setRowDto
                          // );
                        }}
                      />
                    </td>
                    <td className="text-center align-middle">
                        {item?.numOrderValue}
                    </td>
                    <td className="text-center align-middle">
                        {item?.numDiscountValue}
                    </td>
                    <td className="text-center align-middle">
                        {item?.netValue}
                    </td>
                    <td className="text-center align-middle">
                    <i className="fa fa-trash"
                        onClick={() => remover(index)}
                    ></i>
                    </td>
                  </tr>
                );
              })} */}
          </tbody>
        </table>
      </>
      {/* )} */}
    </div>
  );
};

export default SalesOrderRowTable;
