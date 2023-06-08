import React, { useState, useRef, useEffect } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { getSupplyOutputTaxDetails } from "../helper";
import OutputTaxDetailsModal from "../outputTaxDetailsModal/outputTaxDetailsModal";
import Mushak62 from "../../salesRegister/Table/grid";
import { getHeaderData, SalesRegister_Report_api } from "./helper";
import moment from "moment";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from '../../../../_helper/_fixedPoint';
export default function OutputTaxModal_6({
  show,
  onHide,
  singleOutputTax,
  profileData,
  selectedBusinessUnit,
  suplyTypeId,
  tradeTypeId,
  parentValues,
  loading,
  setLoading,
}) {
  const printRef = useRef();
  const [modal6_2, setModal6_2] = useState(false);
  const [outputTaxDetailsModal, setOutputTaxDetailsModal] = useState(false);
  const [outputTaxDetailsData, setOutputTaxDetailsData] = useState([]);
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
        title={"SUPPLY-OUTPUT [SUB-FORM]"}
        btnText="Close"
        isShow={loading}
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
            <div ref={printRef}>
              <div className="row cash_journal my-2">
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
                        <th
                          style={{ width: "190px" }}
                          className="printSectionNone"
                        >
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleOutputTax?.length > 0 &&
                        singleOutputTax?.map((item, index) => {
                          totalVAT += item.vat || 0;
                          totalSD += item.sd || 0;
                          totalValue += item.value || 0;
                          totalQty += item.qty || 0;
                          return (
                            <tr>
                              <td> {index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {item?.goodsOrServiceDesp}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.goodsOrServiceCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.goodsOrServiceName || ""}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{item?.uomName}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {_fixedPoint(item.qty || 0)}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {_fixedPoint(item.value)}
                                </div>
                              </td>

                              <td>
                                <div className="text-right pr-2">
                                  {_fixedPoint(item?.sd)}
                                </div>
                              </td>
                              <td>
                                {" "}
                                <div className="text-right pr-2">
                                  {_fixedPoint(item?.vat)}
                                </div>
                              </td>

                              <td>
                                {" "}
                                <div className="pl-2">{item?.notes}</div>
                              </td>
                              <td className="text-center printSectionNone">
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: "3px 10px 5px 10px" }}
                                  type="button"
                                  onClick={() => {
                                    getSupplyOutputTaxDetails(
                                      profileData?.accountId,
                                      selectedBusinessUnit?.value,
                                      suplyTypeId,
                                      tradeTypeId,
                                      setOutputTaxDetailsData,
                                      parentValues?.mushakDate,
                                      item?.goodsOrServiceId
                                    );
                                    setOutputTaxDetailsModal(true);
                                  }}
                                >
                                  View Details
                                </button>
                                <button
                                  className="btn btn-primary ml-2"
                                  style={{ padding: "3px 10px 5px 10px" }}
                                  type="button"
                                  onClick={() => {
                                    setModal6_2(true);
                                    SalesRegister_Report_api(
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
                                  View (6.2)
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
            </div>
          </CardBody>
        </Card>
      </IViewModal>
      <OutputTaxDetailsModal
        show={outputTaxDetailsModal}
        onHide={(e) => setOutputTaxDetailsModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setOutputTaxDetailsModal={setOutputTaxDetailsModal}
        parentValues={parentValues}
        suplyTypeId={suplyTypeId}
        tradeTypeId={tradeTypeId}
        outputTaxDetailsData={outputTaxDetailsData}
      />

      <IViewModal
        show={modal6_2}
        onHide={() => {
          setModal6_2();
          setRowDto([]);
        }}
        title={"Mushak 6.2"}
        btnText="Close"
        isShow={loading}
      >
        <Mushak62 rowDto={rowDto} headerData={headerData} loading={loading} />
      </IViewModal>
    </div>
  );
}
