/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getGoodsOrServiceNotAdmissible_api,
  getSupplyinputTax,
  getOutputTaxDetailsFor4_api,
} from "../helper";
import InputTaxModal from "../inputTaxModal/inputTaxModal";
import InputTaxModal_18 from "../inputTaxModal/inputTaxModal_18";

export default function InputPutTaxReport({
  gridData,
  parentValues,
  commonNumberFormat,
  allGridData,
  monthlyReturn,
}) {
  const [inputTaxModal_18, setInputTaxModal_18] = useState(false);
  const [inputTaxModal, setInputTaxModal] = useState(false);
  const [singleInputTax, setSingleInputTax] = useState([]);
  const [suplyTypeId, setSuplyTypeId] = useState("");
  const [tradeTypeId, setTradeTypeId] = useState("");
  const [goodsOrServNotAdmissible, setGoodsOrServNotAdmissible] = useState([]);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const commonNoteFind = (noteNo) => {
    const { objRowList } = monthlyReturn;
    if (objRowList?.length > 0) {
      return objRowList?.find((data) => +data.noteNo === +noteNo);
    } else {
      return false;
    }
  };
  const getNote_10 = commonNoteFind(10);
  const getNote_11 = commonNoteFind(11);
  const getNote_12 = commonNoteFind(12);
  const getNote_13 = commonNoteFind(13);
  const getNote_14 = commonNoteFind(14);
  const getNote_15 = commonNoteFind(15);
  const getNote_16 = commonNoteFind(16);
  const getNote_17 = commonNoteFind(17);
  const getNote_18 = commonNoteFind(18);
  const getNote_19 = commonNoteFind(19);
  const getNote_20 = commonNoteFind(20);
  const getNote_21 = commonNoteFind(21);
  const getNote_22 = commonNoteFind(22);
  const getNote_23 = commonNoteFind(23);

  const zeroRatedGoods = gridData?.filter((itm) => {
    return itm?.nameOfSupplyId === 1;
  });
  const exemptedRatedGoods = gridData?.filter((itm) => {
    return itm?.nameOfSupplyId === 2;
  });
  const standardRatedGoods = gridData?.filter((itm) => {
    return itm?.nameOfSupplyId === 3;
  });
  const serviceOtherThan = gridData?.filter((itm) => {
    return itm?.nameOfSupplyId === 6;
  });
  const serviceBasedOnSpecificVAT = gridData?.filter((itm) => {
    return itm?.nameOfSupplyId === 5;
  });
  const serviceNotAdmissibleForCredit = gridData?.filter((itm) => {
    return itm?.nameOfSupplyId === 7;
  });

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      parentValues?.mushakDate
    )
      getGoodsOrServiceNotAdmissible_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentValues?.mushakDate,
        setGoodsOrServNotAdmissible
      );
  }, [profileData, selectedBusinessUnit, parentValues]);

  const note_10 = {
    noteNo: "note_10",
    value:
      getNote_10?.value ||
      (zeroRatedGoods[0]?.nameOfSupplyId === 1 &&
      zeroRatedGoods[0]?.tradeTypeId === 1
        ? zeroRatedGoods[0]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_10?.vat ||
      (zeroRatedGoods[0]?.nameOfSupplyId === 1 &&
      zeroRatedGoods[0]?.tradeTypeId === 1
        ? zeroRatedGoods[0]?.vaT_b
        : ""),
  };

  const note_11 = {
    noteNo: "note_11",
    value:
      getNote_11?.value ||
      (zeroRatedGoods[1]?.nameOfSupplyId === 1 &&
      zeroRatedGoods[1]?.tradeTypeId === 2
        ? zeroRatedGoods[1]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_11?.vat ||
      (zeroRatedGoods[1]?.nameOfSupplyId === 1 &&
      zeroRatedGoods[1]?.tradeTypeId === 2
        ? zeroRatedGoods[1]?.vaT_b
        : ""),
  };
  const note_12 = {
    noteNo: "note_12",
    value:
      getNote_12?.value ||
      (exemptedRatedGoods[0]?.nameOfSupplyId === 2 &&
      exemptedRatedGoods[0]?.tradeTypeId === 1
        ? exemptedRatedGoods[0]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_12?.vat ||
      (exemptedRatedGoods[0]?.nameOfSupplyId === 2 &&
      exemptedRatedGoods[0]?.tradeTypeId === 1
        ? exemptedRatedGoods[0]?.vaT_b
        : ""),
  };

  const note_13 = {
    noteNo: "note_13",
    value:
      getNote_13?.value ||
      (exemptedRatedGoods[1]?.nameOfSupplyId === 2 &&
      exemptedRatedGoods[1]?.tradeTypeId === 2
        ? exemptedRatedGoods[1]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_13?.vat ||
      (exemptedRatedGoods[1]?.nameOfSupplyId === 2 &&
      exemptedRatedGoods[1]?.tradeTypeId === 2
        ? exemptedRatedGoods[1]?.vaT_b
        : ""),
  };

  const note_14 = {
    noteNo: "note_14",
    value:
      getNote_14?.value ||
      (standardRatedGoods[0]?.nameOfSupplyId === 3 &&
      standardRatedGoods[0]?.tradeTypeId === 1
        ? standardRatedGoods[0]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_14?.vat ||
      (standardRatedGoods[0]?.nameOfSupplyId === 3 &&
      standardRatedGoods[0]?.tradeTypeId === 1
        ? standardRatedGoods[0]?.vaT_b
        : ""),
  };

  const note_15 = {
    noteNo: "note_15",
    value:
      getNote_15?.value ||
      (standardRatedGoods[1]?.nameOfSupplyId === 3 &&
      standardRatedGoods[1]?.tradeTypeId === 2
        ? standardRatedGoods[1]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_15?.vat ||
      (standardRatedGoods[1]?.nameOfSupplyId === 3 &&
      standardRatedGoods[1]?.tradeTypeId === 2
        ? standardRatedGoods[1]?.vaT_b
        : ""),
  };

  const note_16 = {
    noteNo: "note_16",
    value:
      getNote_16?.value ||
      (serviceOtherThan[0]?.nameOfSupplyId === 6 &&
      serviceOtherThan[0]?.tradeTypeId === 1
        ? serviceOtherThan[0]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_16?.vat ||
      (serviceOtherThan[0]?.nameOfSupplyId === 6 &&
      serviceOtherThan[0]?.tradeTypeId === 1
        ? serviceOtherThan[0]?.vaT_b
        : ""),
  };

  const note_17 = {
    noteNo: "note_17",
    value:
      getNote_17?.value ||
      (serviceOtherThan[1]?.nameOfSupplyId === 6 &&
      serviceOtherThan[1]?.tradeTypeId === 2
        ? serviceOtherThan[1]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_17?.vat ||
      (serviceOtherThan[1]?.nameOfSupplyId === 6 &&
      serviceOtherThan[1]?.tradeTypeId === 2
        ? serviceOtherThan[1]?.vaT_b
        : ""),
  };

  const note_18 = {
    noteNo: "note_18",
    value:
      getNote_18?.value ||
      (serviceBasedOnSpecificVAT[0]?.nameOfSupplyId === 5 &&
      serviceBasedOnSpecificVAT[0]?.tradeTypeId === 1
        ? serviceBasedOnSpecificVAT[0]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_18?.vat ||
      (serviceBasedOnSpecificVAT[0]?.nameOfSupplyId === 5 &&
      serviceBasedOnSpecificVAT[0]?.tradeTypeId === 1
        ? serviceBasedOnSpecificVAT[0]?.vaT_b
        : ""),
  };

  const note_19 = {
    noteNo: "note_19",
    value:
      getNote_19?.value ||
      (serviceNotAdmissibleForCredit[0]?.nameOfSupplyId === 7 &&
      serviceNotAdmissibleForCredit[0]?.tradeTypeId === 4
        ? serviceNotAdmissibleForCredit[0]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_19?.vat ||
      (serviceNotAdmissibleForCredit[0]?.nameOfSupplyId === 7 &&
      serviceNotAdmissibleForCredit[0]?.tradeTypeId === 4
        ? serviceNotAdmissibleForCredit[0]?.vaT_b
        : ""),
  };

  const note_20 = {
    noteNo: "note_20",
    value:
      getNote_20?.value ||
      (serviceNotAdmissibleForCredit[1]?.nameOfSupplyId === 7 &&
      serviceNotAdmissibleForCredit[1]?.tradeTypeId === 5
        ? serviceNotAdmissibleForCredit[1]?.value_a
        : ""),
    sd: 0,
    vat:
      getNote_20?.vat ||
      (serviceNotAdmissibleForCredit[1]?.nameOfSupplyId === 7 &&
      serviceNotAdmissibleForCredit[1]?.tradeTypeId === 5
        ? serviceNotAdmissibleForCredit[1]?.vaT_b
        : ""),
  };

  const note_21 = {
    noteNo: "note_21",
    value:
      getNote_21?.value ||
      (goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
        ? goodsOrServNotAdmissible[1]?.value_a || ""
        : goodsOrServNotAdmissible[0]?.value_a || ""),
    sd: 0,
    vat:
      getNote_21?.vat ||
      (goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
        ? goodsOrServNotAdmissible[1]?.vaT_b || ""
        : goodsOrServNotAdmissible[0]?.vaT_b || ""),
  };

  const note_22 = {
    noteNo: "note_22",
    value:
      getNote_22?.value ||
      (goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
        ? goodsOrServNotAdmissible[0]?.value_a || ""
        : goodsOrServNotAdmissible[1]?.value_a || ""),
    sd: 0,
    vat:
      getNote_22?.vat ||
      (goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
        ? goodsOrServNotAdmissible[0]?.vaT_b || ""
        : goodsOrServNotAdmissible[1]?.vaT_b || ""),
  };

  const valueSome =
    Number(note_10.value) +
    Number(note_11.value) +
    Number(note_12.value) +
    Number(note_13.value) +
    Number(note_14.value) +
    Number(note_15.value) +
    Number(note_16.value) +
    Number(note_17.value) +
    Number(note_18.value) +
    Number(note_19.value) +
    Number(note_20.value) +
    Number(note_21.value) +
    Number(note_22.value);

  const vatSome =
    Number(note_10.vat) +
    Number(note_11.vat) +
    Number(note_12.vat) +
    Number(note_13.vat) +
    Number(note_14.vat) +
    Number(note_15.vat) +
    Number(note_16.vat) +
    Number(note_17.vat) +
    Number(note_18.vat) +
    Number(note_19.vat) +
    Number(note_20.vat) +
    Number(note_21.vat) +
    Number(note_22.vat);

  const note_23 = {
    noteNo: "note_23",
    value: getNote_23?.value || valueSome,
    sd: 0,
    vat: getNote_23?.vat || vatSome,
  };

  allGridData[9] = note_10;
  allGridData[10] = note_11;
  allGridData[11] = note_12;
  allGridData[12] = note_13;
  allGridData[13] = note_14;
  allGridData[14] = note_15;
  allGridData[15] = note_16;
  allGridData[16] = note_17;
  allGridData[17] = note_18;
  allGridData[18] = note_19;
  allGridData[19] = note_20;
  allGridData[20] = note_21;
  allGridData[21] = note_22;
  allGridData[22] = note_23;
  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="6">Part-4: SUPPLY - INPPUT TAX</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              1) If all the products/services you supply are standard rated up
              note 10-20 <br />
              2) All the products/services you supply are not standard rated or
              input tax credit not taken within stipulated time period under
              section 46,fill up note 21-22 <br />
              3) If the products/services you supply consist of both standard
              rated and non-standard rated,then fill up note 10-20 for the raw
              materials that ware used to produce/supply standard rated
              goods/services and fill up note 21-22 for the raw materials that
              ware used to produce/supply non-standard rated goods/services and
              show the value proportionately in note 10-22 as applicable.
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="2">Name of Supply</th>
            <th>Note</th>
            <th>Value (a) </th>
            <th>Vat (b) </th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td rowspan="2">
              <div className="pl-2">Zero Rated Goods/Service</div>
            </td>
            <td>
              <div className="pl-2">Local Purchase</div>
            </td>
            <td>
              <div className="text-right pr-2">10</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_10?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_10?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(1);
                  setTradeTypeId(1);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 2nd row */}
          <tr>
            <td>
              <div className="pl-2">Import</div>
            </td>
            <td>
              <div className="text-right pr-2">11</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_11?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_11?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(1);
                  setTradeTypeId(2);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 3rd row */}
          <tr>
            <td rowspan="2">
              <div className="pl-2">Exempted Goods/Service</div>
            </td>
            <td>
              <div className="pl-2">Local Purchase</div>
            </td>
            <td>
              <div className="text-right pr-2">12</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_12?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_12?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    2,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(2);
                  setTradeTypeId(1);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 4th row */}
          <tr>
            <td>
              <div className="pl-2">Import</div>
            </td>
            <td>
              <div className="text-right pr-2">13</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_13?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_13?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    2,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(2);
                  setTradeTypeId(2);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 5th row */}
          <tr>
            <td rowspan="2">
              <div className="pl-2">Standard Rated Goods/Service</div>
            </td>
            <td>
              <div className="pl-2">Local Purchase</div>
            </td>
            <td>
              <div className="text-right pr-2">14</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_14?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_14?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    3,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(3);
                  setTradeTypeId(1);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 6th row */}
          <tr>
            <td>
              <div className="pl-2">Import</div>
            </td>
            <td>
              <div className="text-right pr-2">15</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_15?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_15?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    3,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(3);
                  setTradeTypeId(2);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 7th row */}
          <tr>
            <td rowspan="2">
              <div className="pl-2">Goods/Service Other than Standard Rate</div>
            </td>
            <td>
              <div className="pl-2">Local Purchase</div>
            </td>
            <td>
              <div className="text-right pr-2">16</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_16?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_16?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    6,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(6);
                  setTradeTypeId(1);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 8th row */}
          <tr>
            <td>
              <div className="pl-2">Import</div>
            </td>
            <td>
              <div className="text-right pr-2">17</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_17?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_17?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    6,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(6);
                  setTradeTypeId(2);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 9th row */}
          <tr>
            <td>
              <div className="pl-2">Goods/Service Based on Specific VAT</div>
            </td>
            <td>
              <div className="pl-2">Local Purchase</div>
            </td>
            <td>
              <div className="text-right pr-2">18</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_18?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_18?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    5,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal_18(true);
                  setSuplyTypeId(5);
                  setTradeTypeId(1);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 10th row */}
          <tr>
            <td rowSpan="2">
              <div className="pl-2">
                Goods/Service Not Admissible for Credit (Local Purchase)
              </div>
            </td>
            <td>
              <div className="pl-2">From Turnover Tax Units</div>
            </td>
            <td>
              <div className="text-right pr-2">19</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_19.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_19.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    7,
                    4,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(7);
                  setTradeTypeId(4);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 11th row */}
          <tr>
            <td>
              <div className="pl-2">From Unregistered Entities</div>
            </td>
            <td>
              <div className="text-right pr-2">20</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_20?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_20?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    7,
                    5,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
                  setSuplyTypeId(7);
                  setTradeTypeId(5);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 12th row */}
          <tr>
            <td rowSpan="2">
              <div className="pl-2">
                Goods/Service Not Admissible for Credit (Taxpayers who sell ONLY
                Exempted/ Specific VAT and Goods/Service Other than Standard
                Rate/Credits not taken within stipulated time)
              </div>
            </td>
            <td>
              <div className="pl-2">Local Purchase</div>
            </td>
            <td>
              <div className="text-right pr-2">21</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_21?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_21?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getOutputTaxDetailsFor4_api(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    parentValues?.mushakDate,
                    setSingleInputTax
                  );
                  setInputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 13th row */}
          <tr>
            <td>
              <div className="pl-2">Import</div>
            </td>
            <td>
              <div className="text-right pr-2">22</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_22?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_22?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getOutputTaxDetailsFor4_api(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    2,
                    parentValues?.mushakDate,
                    setSingleInputTax
                  );
                  setInputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 14th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Total Input Tax Credit</div>
            </td>
            <td>
              <div className="text-right pr-2">23</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_23?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_23?.vat)}
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Input Tax Modal */}
      {inputTaxModal && (
        <InputTaxModal
          show={inputTaxModal}
          onHide={(e) => {
            setSingleInputTax([]);
            setInputTaxModal(false);
          }}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setOutputTaxModal={setInputTaxModal}
          parentValues={parentValues}
          suplyTypeId={suplyTypeId}
          tradeTypeId={tradeTypeId}
          setSingleOutputTax={setSingleInputTax}
          singleInputTax={singleInputTax}
        />
      )}
      {inputTaxModal_18 && (
        <InputTaxModal_18
          show={inputTaxModal_18}
          onHide={(e) => setInputTaxModal_18(false)}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setOutputTaxModal={setInputTaxModal_18}
          parentValues={parentValues}
          suplyTypeId={suplyTypeId}
          tradeTypeId={tradeTypeId}
          setSingleOutputTax={setInputTaxModal_18}
          singleInputTax={singleInputTax}
        />
      )}
    </>
  );
}
