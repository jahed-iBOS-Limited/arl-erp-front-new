/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import OutputTaxModal from "../outputTaxModal/outputTaxModal";
import OutputTaxModal_6 from "../outputTaxModal/outputTaxModal_6";
import Loading from "../../../../_helper/_loading";
import {
  getSupplyOutputTax,
  // getOutputTaxDetailsFor4_api,
} from "./../helper";

export default function OutPutTaxReport({
  gridData,
  parentValues,
  commonNumberFormat,
  allGridData,
  monthlyReturn,
}) {
  const [outputTaxModal_6, setOutputTaxModal_6] = useState(false);
  const [outputTaxModal, setOutputTaxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleOutputTax, setSingleOutputTax] = useState([]);
  const [suplyTypeId, setSuplyTypeId] = useState("");
  const [tradeTypeId, setTradeTypeId] = useState("");
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
  const getNote_01 = commonNoteFind(1);
  const getNote_02 = commonNoteFind(2);
  const getNote_03 = commonNoteFind(3);
  const getNote_04 = commonNoteFind(4);
  const getNote_05 = commonNoteFind(5);
  const getNote_06 = commonNoteFind(6);
  const getNote_07 = commonNoteFind(7);
  const getNote_08 = commonNoteFind(8);
  const getNote_09 = commonNoteFind(9);
  const note_01 = {
    noteNo: "note_01",
    value:
      getNote_01?.value ||
      (gridData[0]?.nameOfSupplyId === 1 && gridData[0]?.tradeTypeId === 3
        ? gridData[0]?.value_a
        : ""),
    sd:
      getNote_01?.sd ||
      (gridData[0]?.nameOfSupplyId === 1 && gridData[0]?.tradeTypeId === 3
        ? gridData[0]?.sD_b
        : ""),
    vat:
      getNote_01?.vat ||
      (gridData[0]?.nameOfSupplyId === 1 && gridData[0]?.tradeTypeId === 3
        ? gridData[0]?.vaT_b
        : ""),
  };

  const note_02 = {
    noteNo: "note_02",
    value:
      getNote_02?.value ||
      (gridData[1]?.nameOfSupplyId === 1 && gridData[1]?.tradeTypeId === 4
        ? gridData[1]?.value_a
        : ""),
    sd:
      getNote_02?.sd ||
      (gridData[1]?.nameOfSupplyId === 1 && gridData[1]?.tradeTypeId === 4
        ? gridData[1]?.sD_b
        : ""),
    vat:
      getNote_02?.vat ||
      (gridData[1]?.nameOfSupplyId === 1 && gridData[1]?.tradeTypeId === 4
        ? gridData[1]?.vaT_b
        : ""),
  };

  const note_03 = {
    noteNo: "note_03",
    value:
      getNote_03?.value ||
      (gridData[2]?.nameOfSupplyId === 2 ? gridData[2]?.value_a : ""),
    sd:
      getNote_03?.sd ||
      (gridData[2]?.nameOfSupplyId === 2 ? gridData[2]?.sD_b : ""),
    vat:
      getNote_03?.vat ||
      (gridData[2]?.nameOfSupplyId === 2 ? gridData[2]?.vaT_b : ""),
  };

  const note_04 = {
    noteNo: "note_04",
    value:
      getNote_04?.value ||
      (gridData[3]?.nameOfSupplyId === 3 ? gridData[3]?.value_a : ""),
    sd:
      getNote_04?.sd ||
      (gridData[3]?.nameOfSupplyId === 3 ? gridData[3]?.sD_b : ""),
    vat:
      getNote_04?.vat ||
      (gridData[3]?.nameOfSupplyId === 3 ? gridData[3]?.vaT_b : ""),
  };
  const note_05 = {
    noteNo: "note_05",
    value:
      getNote_05?.value ||
      (gridData[4]?.nameOfSupplyId === 4 ? gridData[4]?.value_a : ""),
    sd:
      getNote_05?.sd ||
      (gridData[4]?.nameOfSupplyId === 4 ? gridData[4]?.sD_b : ""),
    vat:
      getNote_05?.vat ||
      (gridData[4]?.nameOfSupplyId === 4 ? gridData[4]?.vaT_b : ""),
  };

  const note_06 = {
    noteNo: "note_06",
    value:
      getNote_06?.value ||
      (gridData[5]?.nameOfSupplyId === 5 ? gridData[5]?.value_a : ""),
    sd:
      getNote_06?.sd ||
      (gridData[5]?.nameOfSupplyId === 5 ? gridData[5]?.sD_b : ""),
    vat:
      getNote_06?.vat ||
      (gridData[5]?.nameOfSupplyId === 5 ? gridData[5]?.vaT_b : ""),
  };

  const note_07 = {
    noteNo: "note_07",
    value:
      getNote_07?.value ||
      (gridData[6]?.nameOfSupplyId === 6 ? gridData[6]?.value_a : ""),
    sd:
      getNote_07?.sd ||
      (gridData[6]?.nameOfSupplyId === 6 ? gridData[6]?.sD_b : ""),
    vat:
      getNote_07?.vat ||
      (gridData[6]?.nameOfSupplyId === 6 ? gridData[6]?.vaT_b : ""),
  };

  const note_08 = {
    noteNo: "note_08",
    value:
      getNote_08?.value ||
      (gridData[7]?.nameOfSupplyId === 7 ? gridData[7]?.value_a : ""),
    sd:
      getNote_08?.sd ||
      (gridData[7]?.nameOfSupplyId === 7 ? gridData[7]?.sD_b : ""),
    vat:
      getNote_08?.vat ||
      (gridData[7]?.nameOfSupplyId === 7 ? gridData[7]?.vaT_b : ""),
  };

  const valueSome =
    Number(note_01.value) +
    Number(note_02.value) +
    Number(note_03.value) +
    Number(note_04.value) +
    Number(note_05.value) +
    Number(note_06.value) +
    Number(note_07.value) +
    Number(note_08.value);

  const sdSome =
    Number(note_01.sd) +
    Number(note_02.sd) +
    Number(note_03.sd) +
    Number(note_04.sd) +
    Number(note_05.sd) +
    Number(note_06.sd) +
    Number(note_07.sd) +
    Number(note_08.sd);
  const vatSome =
    Number(note_01.vat) +
    Number(note_02.vat) +
    Number(note_03.vat) +
    Number(note_04.vat) +
    Number(note_05.vat) +
    Number(note_06.vat) +
    Number(note_07.vat) +
    Number(note_08.vat);

  const note_09 = {
    noteNo: "note_09",
    value: getNote_09?.value || valueSome,
    sd: getNote_09?.sd || sdSome,
    vat: getNote_09?.vat || vatSome,
  };

  allGridData[0] = note_01;
  allGridData[1] = note_02;
  allGridData[2] = note_03;
  allGridData[3] = note_04;
  allGridData[4] = note_05;
  allGridData[5] = note_06;
  allGridData[6] = note_07;
  allGridData[7] = note_08;
  allGridData[8] = note_09;

  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="7">Part-3: SUPPLY - OUTPUT TAX</th>
          </tr>
          <tr>
            <th colspan="2">Name of Supply</th>
            <th>Note</th>
            <th>Value (a) </th>
            <th>SD (b)</th>
            <th>Vat (c) </th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td rowspan="2">
              <div className="pl-2">Zero Rated Goods/Service</div>
            </td>
            <td>
              <div className="pl-2">Direct Export</div>
            </td>
            <td>
              <div className="text-right pr-2">1</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_01?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_01?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_01?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    3,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(1);
                  setTradeTypeId(3);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 2nd row */}
          <tr>
            <td>
              <div className="pl-2">Deemd Export</div>
            </td>
            <td>
              <div className="text-right pr-2">2</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_02?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_02?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_02?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    4,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(1);
                  setTradeTypeId(4);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 3rd row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Exempted Goods/Service</div>
            </td>
            <td>
              <div className="text-right pr-2">3</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_03?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {" "}
                {commonNumberFormat(note_03?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {" "}
                {commonNumberFormat(note_03?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[2]?.nameOfSupplyId,
                    gridData[2]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(gridData[2]?.nameOfSupplyId);
                  setTradeTypeId(gridData[2]?.tradeTypeId);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 4th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Standard Rated Goods/Service</div>
            </td>
            <td>
              <div className="text-right pr-2">4</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_04?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {" "}
                {commonNumberFormat(note_04?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {" "}
                {commonNumberFormat(note_04?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[3]?.nameOfSupplyId,
                    gridData[3]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(gridData[3]?.nameOfSupplyId);
                  setTradeTypeId(gridData[3]?.tradeTypeId);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 5th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Goods Based on MRP</div>
            </td>
            <td>
              <div className="text-right pr-2">5</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_05?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_05?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_05?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[4]?.nameOfSupplyId,
                    gridData[4]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(gridData[4]?.nameOfSupplyId);
                  setTradeTypeId(gridData[4]?.tradeTypeId);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 6th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Goods/Service Based on Specific VAT</div>
            </td>
            <td>
              <div className="text-right pr-2">6</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_06?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_06?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_06?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[5]?.nameOfSupplyId,
                    gridData[5]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(gridData[5]?.nameOfSupplyId);
                  setTradeTypeId(gridData[5]?.tradeTypeId);
                  setOutputTaxModal_6(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 7th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Goods/Service Other than Standard Rate</div>
            </td>
            <td>
              <div className="text-right pr-2">7</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_07?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_07?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_07?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[6]?.nameOfSupplyId,
                    gridData[6]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(gridData[6]?.nameOfSupplyId);
                  setTradeTypeId(gridData[6]?.tradeTypeId);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 8th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">Retail/Wholesale/Trade Based Supply</div>
            </td>
            <td>
              <div className="text-right pr-2">8</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_08?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_08?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_08?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTax(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[7]?.nameOfSupplyId,
                    gridData[7]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate,
                    setLoading
                  );
                  setSuplyTypeId(gridData[7]?.nameOfSupplyId);
                  setTradeTypeId(gridData[7]?.tradeTypeId);
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 9th row */}
          <tr>
            <td colSpan="2">
              <div className="pl-2">
                Total Sales Value & Total Payable Taxes
              </div>
            </td>
            <td>
              <div className="text-right pr-2">9</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_09?.value)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_09?.sd)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_09?.vat)}
              </div>
            </td>
            <td className="printSectionNone"></td>
          </tr>
        </tbody>
      </table>
      {loading && <Loading />}
      {/* Output Tax Modal */}
      {outputTaxModal && (
        <OutputTaxModal
          show={outputTaxModal}
          onHide={(e) => {
            setOutputTaxModal(false);
            setSingleOutputTax([]);
          }}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setOutputTaxModal={setOutputTaxModal}
          parentValues={parentValues}
          suplyTypeId={suplyTypeId}
          tradeTypeId={tradeTypeId}
          singleOutputTax={singleOutputTax}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {outputTaxModal_6 && (
        <OutputTaxModal_6
          show={outputTaxModal_6}
          onHide={(_e) => {
            setOutputTaxModal_6(false);
            setSingleOutputTax([]);
          }}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setOutputTaxModal={setOutputTaxModal_6}
          parentValues={parentValues}
          suplyTypeId={suplyTypeId}
          tradeTypeId={tradeTypeId}
          singleOutputTax={singleOutputTax}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
}
