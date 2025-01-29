import React, { useState, useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import IViewModal from "../../../../_helper/_viewModal";
import { getHeaderData, PurchaseRegister_Report_api } from "./helper";
import moment from "moment";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { getSupplyInputTaxDetails } from "../helper";
import InputTaxDetailsModal from "../inputTaxDetailsModal/inputTaxDetailsModal";
import Mushak61 from "../../purchaseReg/Table/grid";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function InputTaxModal_18({
  show,
  onHide,
  singleInputTax,
  profileData,
  selectedBusinessUnit,
  suplyTypeId,
  tradeTypeId,
  parentValues,
}) {
  const printRef = useRef();
  const [modal6_1, setModal6_1] = useState(false);
  const [inputTaxDetailsModal, setInputTaxDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputTaxDetailsData, setInputTaxDetailsData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [headerData, setHeaderData] = useState({});

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getHeaderData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderData
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const startOfMonth = moment(parentValues?.mushakDate)
    .startOf("month")
    .format();
  const endOfMonth = moment(parentValues?.mushakDate)
    .endOf("month")
    .format();

  let totalVAT = 0,
    totalSD = 0,
    totalValue = 0,
    totalQty = 0;
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"Supply InputTax"}
        btnText="Close"
      >
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end mt-2">
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className="btn btn-primary px-1 py-1 my-0"
                  >
                    <img
                      style={{ width: "25px", paddingRight: "5px" }}
                      src={printIcon}
                      alt="print-icon"
                    />
                    Print
                  </button>
                )}
                content={() => printRef.current}
              />
            </div>

            {/* Table Start */}
            <div ref={printRef} className="row cash_journal my-2">
              <div className="col-lg-12">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>Serial No.</th>
                      <th>Goods/Service Commercial Description</th>
                      <th>Goods/Service Code</th>
                      <th>Goods/Service Name</th>
                      <th>
                        Unit Of Measure <br />
                        (a)
                      </th>
                      <th>
                        Quantity <br />
                        (b)
                      </th>
                      <th>
                        Actual Sales Purchase Value <br />
                        (c)
                      </th>
                      <th>
                        SD
                        <br />
                        (d)
                      </th>
                      <th>
                        Vat
                        <br />
                        (e)
                      </th>
                      <th>Notes</th>
                      <th style={{ width: "190px" }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleInputTax?.length > 0 &&
                      singleInputTax?.map((item, index) => {
                        totalVAT += item.vat || 0;
                        totalSD += item.sd || 0;
                        totalValue += item.value || 0;
                        totalQty += item.qty || 0;
                        return (
                          <tr>
                            <td> {index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {item?.goodsOrServiceCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.goodsOrServiceDesp}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.goodsOrServiceName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.uomName || ""}</div>
                            </td>
                            <td>
                              <div className="pl-2">{_fixedPoint(item.qty || 0)}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">{_fixedPoint(item?.sd)}</div>
                            </td>
                            <td>
                              {" "}
                              <div className="text-right pr-2">{_fixedPoint(item?.vat)}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {_fixedPoint(item.value)}
                              </div>
                            </td>
                            <td>
                              {" "}
                              <div className="pl-2">{item?.notes}</div>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-primary"
                                style={{ padding: "3px 10px 5px 10px" }}
                                type="button"
                                onClick={() => {
                                  getSupplyInputTaxDetails(
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    suplyTypeId,
                                    tradeTypeId,
                                    setInputTaxDetailsData,
                                    parentValues?.mushakDate,
                                    item?.goodsOrServiceId
                                  );
                                  setInputTaxDetailsModal(true);
                                }}
                              >
                                View Details
                              </button>
                              <button
                                className="btn btn-primary ml-2"
                                style={{ padding: "3px 10px 5px 10px" }}
                                type="button"
                                onClick={() => {
                                  setModal6_1(true);
                                  PurchaseRegister_Report_api(
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    _dateFormatter(startOfMonth),
                                    _dateFormatter(endOfMonth),
                                    item?.goodsOrServiceId,
                                    0,
                                    setRowDto,
                                    setLoading
                                  );
                                }}
                              >
                                View (6.1)
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    <tr>
                      <td className="text-right" colspan="5">
                        {" "}
                        <b>Total</b>
                      </td>

                      <td>
                        <div className="text-right pr-2">
                          <b>{_fixedPoint(totalQty || 0, true)}</b>
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          <b>{_fixedPoint(totalValue, true)}</b>
                        </div>
                      </td>

                      <td>
                        <div className="text-right pr-2">
                          <b>{_fixedPoint(totalSD, true)}</b>
                        </div>
                      </td>
                      <td>
                        {" "}
                        <div className="text-right pr-2">
                          <b>{_fixedPoint(totalVAT, true)}</b>
                        </div>
                      </td>

                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>
      </IViewModal>
      <InputTaxDetailsModal
        show={inputTaxDetailsModal}
        onHide={(e) => setInputTaxDetailsModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setOutputTaxDetailsModal={setInputTaxDetailsModal}
        parentValues={parentValues}
        suplyTypeId={suplyTypeId}
        tradeTypeId={tradeTypeId}
        inputTaxDetailsData={inputTaxDetailsData}
      />
      <IViewModal
        show={modal6_1}
        onHide={() => {
          setModal6_1();
        }}
        title={"Mushak 6.1"}
        btnText="Close"
      >
        <Mushak61 rowDto={rowDto} loading={loading} headerData={headerData} />
      </IViewModal>
    </div>
  );
}
