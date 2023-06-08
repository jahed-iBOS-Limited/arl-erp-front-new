import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getGoodsOrServiceNotAdmissible_api,
  getSupplyinputTaxDetails,
  getOutputTaxDetailsFor4_api,
} from "../helper";
import InputTaxDetailsModal from "../inputTaxModal/inputTaxModal";

export default function InputPutTaxReport({ gridData, parentValues }) {
  const [inputTaxModal, setInputTaxModal] = useState(false);
  const [singleInputTax, setSingleInputTax] = useState([]);
  const [goodsOrServNotAdmissible, setGoodsOrServNotAdmissible] = useState([]);
  const claculator = (arr, key) => {
    const total = arr?.reduce((acc, cur) => (acc += cur?.[key]), 0);
    return total;
  };
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

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
                {zeroRatedGoods[0]?.nameOfSupplyId === 1 &&
                zeroRatedGoods[0]?.tradeTypeId === 1
                  ? zeroRatedGoods[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {zeroRatedGoods[0]?.nameOfSupplyId === 1 &&
                zeroRatedGoods[0]?.tradeTypeId === 1
                  ? zeroRatedGoods[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {zeroRatedGoods[1]?.nameOfSupplyId === 1 &&
                zeroRatedGoods[1]?.tradeTypeId === 2
                  ? zeroRatedGoods[1]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {zeroRatedGoods[1]?.nameOfSupplyId === 1 &&
                zeroRatedGoods[1]?.tradeTypeId === 2
                  ? zeroRatedGoods[1]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {exemptedRatedGoods[0]?.nameOfSupplyId === 2 &&
                exemptedRatedGoods[0]?.tradeTypeId === 1
                  ? exemptedRatedGoods[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {exemptedRatedGoods[0]?.nameOfSupplyId === 2 &&
                exemptedRatedGoods[0]?.tradeTypeId === 1
                  ? exemptedRatedGoods[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    2,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {exemptedRatedGoods[1]?.nameOfSupplyId === 2 &&
                exemptedRatedGoods[1]?.tradeTypeId === 2
                  ? exemptedRatedGoods[1]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {exemptedRatedGoods[1]?.nameOfSupplyId === 2 &&
                exemptedRatedGoods[1]?.tradeTypeId === 2
                  ? exemptedRatedGoods[1]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    2,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {standardRatedGoods[0]?.nameOfSupplyId === 3 &&
                standardRatedGoods[0]?.tradeTypeId === 1
                  ? standardRatedGoods[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {standardRatedGoods[0]?.nameOfSupplyId === 3 &&
                standardRatedGoods[0]?.tradeTypeId === 1
                  ? standardRatedGoods[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    3,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {standardRatedGoods[1]?.nameOfSupplyId === 3 &&
                standardRatedGoods[1]?.tradeTypeId === 2
                  ? standardRatedGoods[1]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {standardRatedGoods[1]?.nameOfSupplyId === 3 &&
                standardRatedGoods[1]?.tradeTypeId === 2
                  ? standardRatedGoods[1]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    3,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {serviceOtherThan[0]?.nameOfSupplyId === 6 &&
                serviceOtherThan[0]?.tradeTypeId === 1
                  ? serviceOtherThan[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {serviceOtherThan[0]?.nameOfSupplyId === 6 &&
                serviceOtherThan[0]?.tradeTypeId === 1
                  ? serviceOtherThan[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    6,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {serviceOtherThan[1]?.nameOfSupplyId === 6 &&
                serviceOtherThan[1]?.tradeTypeId === 2
                  ? serviceOtherThan[1]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {serviceOtherThan[1]?.nameOfSupplyId === 6 &&
                serviceOtherThan[1]?.tradeTypeId === 2
                  ? serviceOtherThan[1]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    6,
                    2,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {serviceBasedOnSpecificVAT[0]?.nameOfSupplyId === 5 &&
                serviceBasedOnSpecificVAT[0]?.tradeTypeId === 1
                  ? serviceBasedOnSpecificVAT[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {serviceBasedOnSpecificVAT[0]?.nameOfSupplyId === 5 &&
                serviceBasedOnSpecificVAT[0]?.tradeTypeId === 1
                  ? serviceBasedOnSpecificVAT[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    5,
                    1,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {serviceNotAdmissibleForCredit[0]?.nameOfSupplyId === 7 &&
                serviceNotAdmissibleForCredit[0]?.tradeTypeId === 4
                  ? serviceNotAdmissibleForCredit[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {serviceNotAdmissibleForCredit[0]?.nameOfSupplyId === 7 &&
                serviceNotAdmissibleForCredit[0]?.tradeTypeId === 4
                  ? serviceNotAdmissibleForCredit[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    7,
                    4,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {serviceNotAdmissibleForCredit[1]?.nameOfSupplyId === 7 &&
                serviceNotAdmissibleForCredit[1]?.tradeTypeId === 5
                  ? serviceNotAdmissibleForCredit[1]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {serviceNotAdmissibleForCredit[1]?.nameOfSupplyId === 7 &&
                serviceNotAdmissibleForCredit[1]?.tradeTypeId === 5
                  ? serviceNotAdmissibleForCredit[1]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyinputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    7,
                    5,
                    setSingleInputTax,
                    parentValues?.mushakDate
                  );
                  setInputTaxModal(true);
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
                {goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
                  ? goodsOrServNotAdmissible[1]?.value_a || 0
                  : goodsOrServNotAdmissible[0]?.value_a || 0}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
                  ? goodsOrServNotAdmissible[1]?.vaT_b || 0
                  : goodsOrServNotAdmissible[0]?.vaT_b || 0}
              </div>
            </td>
            <td>
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
                {goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
                  ? goodsOrServNotAdmissible[0]?.value_a || 0
                  : goodsOrServNotAdmissible[1]?.value_a || 0}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {goodsOrServNotAdmissible[0]?.tradeTypeName === "Import"
                  ? goodsOrServNotAdmissible[0]?.vaT_b || 0
                  : goodsOrServNotAdmissible[1]?.vaT_b || 0}
              </div>
            </td>
            <td>
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
                {claculator(gridData, "value_a").toFixed(2)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {claculator(gridData, "vaT_b").toFixed(2)}
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Input Tax Modal */}
      <InputTaxDetailsModal
        show={inputTaxModal}
        onHide={(e) => setInputTaxModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setOutputTaxModal={setInputTaxModal}
        parentValues={parentValues}
        setSingleOutputTax={setSingleInputTax}
        singleInputTax={singleInputTax}
      />
    </>
  );
}
