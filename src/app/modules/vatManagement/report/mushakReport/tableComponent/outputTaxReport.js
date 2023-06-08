import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import OutputTaxDetailsModal from "../outputTaxModal/outputTaxModal";
import {
  getSupplyOutputTaxDetails,
  // getOutputTaxDetailsFor4_api,
} from "./../helper";

export default function OutPutTaxReport({ gridData, parentValues }) {
  const [outputTaxModal, setOutputTaxModal] = useState(false);
  const [singleOutputTax, setSingleOutputTax] = useState([]);
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
                {gridData[0]?.nameOfSupplyId === 1 &&
                gridData[0]?.tradeTypeId === 3
                  ? gridData[0]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[0]?.nameOfSupplyId === 1 &&
                gridData[0]?.tradeTypeId === 3
                  ? gridData[0]?.sD_b
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[0]?.nameOfSupplyId === 1 &&
                gridData[0]?.tradeTypeId === 3
                  ? gridData[0]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    3,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {gridData[1]?.nameOfSupplyId === 1 &&
                gridData[1]?.tradeTypeId === 4
                  ? gridData[1]?.value_a
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[1]?.nameOfSupplyId === 1 &&
                gridData[1]?.tradeTypeId === 4
                  ? gridData[1]?.sD_b
                  : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[1]?.nameOfSupplyId === 1 &&
                gridData[1]?.tradeTypeId === 4
                  ? gridData[1]?.vaT_b
                  : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    1,
                    4,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {gridData[2]?.nameOfSupplyId === 2 ? gridData[2]?.value_a : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[2]?.nameOfSupplyId === 2 ? gridData[2]?.sD_b : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[2]?.nameOfSupplyId === 2 ? gridData[2]?.vaT_b : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[2]?.nameOfSupplyId,
                    gridData[2]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {gridData[3]?.nameOfSupplyId === 3 ? gridData[3]?.value_a : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[3]?.nameOfSupplyId === 3 ? gridData[3]?.sD_b : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[3]?.nameOfSupplyId === 3 ? gridData[3]?.vaT_b : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[3]?.nameOfSupplyId,
                    gridData[3]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {gridData[4]?.nameOfSupplyId === 4 ? gridData[4]?.value_a : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[4]?.nameOfSupplyId === 4 ? gridData[4]?.sD_b : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[4]?.nameOfSupplyId === 4 ? gridData[4]?.vaT_b : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[4]?.nameOfSupplyId,
                    gridData[4]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {gridData[5]?.nameOfSupplyId === 5 ? gridData[5]?.value_a : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[5]?.nameOfSupplyId === 5 ? gridData[5]?.sD_b : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[5]?.nameOfSupplyId === 5 ? gridData[5]?.vaT_b : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[5]?.nameOfSupplyId,
                    gridData[5]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
                  // getOutputTaxDetailsFor4_api(
                  //   profileData?.accountId,
                  //   selectedBusinessUnit?.value,
                  //   gridData[5]?.tradeTypeId,
                  //   parentValues?.mushakDate,
                  //   setSingleOutputTax
                  // );
                  setOutputTaxModal(true);
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
                {gridData[6]?.nameOfSupplyId === 6 ? gridData[6]?.value_a : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[6]?.nameOfSupplyId === 6 ? gridData[6]?.sD_b : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[6]?.nameOfSupplyId === 6 ? gridData[6]?.vaT_b : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[6]?.nameOfSupplyId,
                    gridData[6]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {gridData[7]?.nameOfSupplyId === 7 ? gridData[7]?.value_a : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[7]?.nameOfSupplyId === 7 ? gridData[7]?.sD_b : ""}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {gridData[7]?.nameOfSupplyId === 7 ? gridData[7]?.vaT_b : ""}
              </div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[7]?.nameOfSupplyId,
                    gridData[7]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
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
                {claculator(gridData, "value_a").toFixed(2)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {claculator(gridData, "sD_b").toFixed(2)}
              </div>
            </td>
            <td>
              <div className="text-right pr-2">
                {claculator(gridData, "vaT_b").toFixed(2)}
              </div>
            </td>
            <td>
              {/* <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getSupplyOutputTaxDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    gridData[8]?.nameOfSupplyId,
                    gridData[8]?.tradeTypeId,
                    setSingleOutputTax,
                    parentValues?.mushakDate
                  );
                  setOutputTaxModal(true);
                }}
              >
                Sub Form
              </button> */}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Output Tax Modal */}
      <OutputTaxDetailsModal
        show={outputTaxModal}
        onHide={(e) => setOutputTaxModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setOutputTaxModal={setOutputTaxModal}
        parentValues={parentValues}
        setSingleOutputTax={setSingleOutputTax}
        singleOutputTax={singleOutputTax}
      />
    </>
  );
}
