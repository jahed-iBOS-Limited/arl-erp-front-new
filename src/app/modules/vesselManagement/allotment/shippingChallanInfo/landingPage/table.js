import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";

const Table = ({ obj }) => {
  const {
    status,
    values,
    pageNo,
    rowData,
    pageSize,
    godownDDL,
    setPageNo,
    allSelect,
    selectedAll,
    loadOptions,
    setPageSize,
    // motherVessels,
    rowDataHandler,
    setPositionHandler,
  } = obj;

  return (
    <>
      {rowData?.data?.length > 0 && (
        <div className="">
          <div className="loan-scrollable-table inventory-statement-report">
            <div style={{ maxHeight: "500px" }} className="scroll-table _table">
              <table className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm">
                <thead>
                  <tr className="cursor-pointer">
                    {status && (
                      <th
                        onClick={() => allSelect(!selectedAll(), values)}
                        style={{ minWidth: "30px" }}
                      >
                        <input
                          type="checkbox"
                          value={selectedAll()}
                          checked={selectedAll()}
                          onChange={() => {}}
                        />
                      </th>
                    )}
                    <th style={{ minWidth: "30px" }}>SL</th>
                    <th style={{ minWidth: "100px" }}>Sales Order No</th>
                    <th style={{ minWidth: "100px" }}>Date</th>
                    <th style={{ minWidth: "100px" }}>DO No</th>
                    <th style={{ minWidth: "180px" }}>Mother Vessel</th>
                    {/* <th style={{ minWidth: "180px" }}>Remarks</th> */}
                    <th style={{ minWidth: "90px" }}>Vehicle No</th>
                    <th style={{ minWidth: "190px" }}>Ghat Name</th>
                    <th style={{ minWidth: "90px" }}>Delivery Address</th>
                    <th style={{ minWidth: "100px" }}>Quantity</th>

                    <th style={{ minWidth: "100px" }}>
                      Transport Rate (per bag)
                    </th>

                    <th style={{ minWidth: "100px" }}>
                      Godown Unloading Rate (per bag)
                    </th>

                    <th style={{ minWidth: "100px" }}>Bill Amount</th>
                    {[2, 3].includes(values?.confirmationType?.value) && (
                      <th style={{ minWidth: "80px" }}>Price</th>
                    )}
                    {[2, 3].includes(values?.confirmationType?.value) && (
                      <th style={{ minWidth: "80px" }}>Total Revenue</th>
                    )}
                    <th style={{ minWidth: "200px" }}>Ship to Partner</th>
                    <th style={{ minWidth: "160px" }}>{`${
                      values?.confirmationType?.value === 1
                        ? "Receive"
                        : "Challan"
                    } Date`}</th>

                    <th style={{ minWidth: "180px" }}>Transport Supplier</th>

                    {/* {values?.confirmationType?.value !== 3 && (
                      <th style={{ minWidth: "180px" }}>Transport Supplier</th>
                    )} */}

                    <th style={{ minWidth: "90px" }}>Driver Name</th>
                    <th style={{ minWidth: "80px" }}>Driver Mobile No</th>

                    <th style={{ minWidth: "200px" }}>
                      Godown Labour Supplier
                    </th>
                    {/* {values?.confirmationType?.value !== 2 && (
                      <th style={{ minWidth: "200px" }}>
                        Godown Labour Supplier
                      </th>
                    )} */}
                    <th style={{ minWidth: "100px" }}>Insert By</th>
                    {/* <th style={{ minWidth: "50px" }}>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {rowData?.data?.map((item, index) => {
                    // is Supervisor Confirmation (Truck Bill || Godown Unload Bill)
                    const isSupervisorConfirmation = [2, 3].includes(
                      values?.confirmationType?.value
                    );
                    // price is less than 0
                    let pricelessThanZero =
                      +item?.numItemPrice <= 0 && isSupervisorConfirmation;
                    return (
                      <tr
                        key={index}
                        style={{
                          background: pricelessThanZero ? "#ff0000a1" : "",
                        }}
                      >
                        {status && (
                          <td
                            onClick={() => {
                              // if (pricelessThanZero) return;
                              rowDataHandler(
                                "isSelected",
                                index,
                                !item.isSelected
                              );
                            }}
                            className="text-center"
                          >
                            <input
                              type="checkbox"
                              value={item?.isSelected}
                              checked={item?.isSelected}
                              onChange={() => {}}
                              // disabled={pricelessThanZero}
                            />
                          </td>
                        )}
                        <td
                          style={{ minWidth: "30px" }}
                          className="text-center"
                        >
                          {index + 1}
                        </td>
                        <td className="" style={{ width: "100px" }}>
                          {status ? (
                            <InputField
                              name="salesOrder"
                              placeholder="Sales Order"
                              value={item?.salesOrder}
                              onChange={(e) => {
                                rowDataHandler(
                                  "salesOrder",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          ) : (
                            item?.salesOrder
                          )}
                        </td>
                        <td>{_dateFormatter(item?.lastActionDateTime)}</td>
                        <td>{item?.deliveryCode}</td>
                        <td>
                          {/* <NewSelect
                            name="motherVessel"
                            value={item?.motherVessel}
                            options={motherVessels}
                            onChange={(e) => {
                              rowDataHandler("motherVessel", index, e);
                            }}
                          /> */}
                          {item?.motherVesselName}
                        </td>
                        {/* <td>
                          <TextArea
                            name="remarks"
                            value={item?.remarks}
                            onChange={(e) => {
                              rowDataHandler(
                                "remarks",
                                index,
                                e?.target?.value
                              );
                            }}
                          />
                        </td> */}
                        <td>{item?.vehicleRegNo}</td>
                        <td>{item?.shipPointName}</td>
                        <td>{item?.address}</td>
                        <td className="text-right" style={{ width: "100px" }}>
                          {status ? (
                            <InputField
                              name="quantity"
                              placeholder="Quantity"
                              type="number"
                              min="0"
                              max={item?.maxQty}
                              value={item?.quantity}
                              disabled={
                                true
                                // item?.truckSupplierBillRegisterId ||
                                // item?.unloadSupplierBillRegisterId
                              }
                              onChange={(e) => {
                                rowDataHandler(
                                  "quantity",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          ) : (
                            item?.quantity
                          )}
                        </td>
                        <td className="text-right" style={{ width: "100px" }}>
                          {status ? (
                            <InputField
                              name="transportRate"
                              placeholder="Transport Rate"
                              value={item?.transportRate || ""}
                              type="number"
                              min="0"
                              disabled={true}
                              // disabled={values?.confirmationType?.value === 3}
                              onChange={(e) => {
                                if (+e.target.value < 0) return;
                                rowDataHandler(
                                  "transportRate",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          ) : (
                            item?.transportRate || 0
                          )}
                        </td>
                        <td className="text-right">
                          {status ? (
                            <InputField
                              name="godownUnloadingRate"
                              placeholder="Unloading Rate"
                              value={item?.godownUnloadingRate || ""}
                              type="number"
                              min="0"
                              disabled={true}
                              // disabled={values?.confirmationType?.value === 2}
                              onChange={(e) => {
                                if (+e.target.value < 0) return;
                                rowDataHandler(
                                  "godownUnloadingRate",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          ) : (
                            item?.godownUnloadingRate
                          )}
                        </td>
                        <td className="text-right" style={{ width: "100px" }}>
                          {status ? (
                            <InputField
                              name="billAmount"
                              value={
                                (values?.confirmationType?.value === 2
                                  ? +item?.transportRate
                                  : values?.confirmationType?.value === 3
                                  ? +item?.godownUnloadingRate
                                  : +item?.transportRate +
                                    +item?.godownUnloadingRate) *
                                +item?.quantity
                              }
                              onChange={(e) => {
                                if (+e.target.value < 0) return;
                                rowDataHandler(
                                  "billAmount",
                                  index,
                                  e?.target?.value
                                );
                              }}
                              disabled
                            />
                          ) : (
                            (item?.quantity || 0) * (item?.transportRate || 0)
                          )}
                        </td>
                        {[2, 3].includes(values?.confirmationType?.value) && (
                          <td style={{ width: "100px" }} className="text-right">
                            {item?.numItemPrice}
                          </td>
                        )}
                        {[2, 3].includes(values?.confirmationType?.value) && (
                          <td style={{ width: "100px" }} className="text-right">
                            {_fixedPoint(
                              item?.numItemPrice * item?.quantityTon,
                              true,
                              2
                            )}
                          </td>
                        )}
                        <td style={{ width: "150px" }}>
                          {status ? (
                            <NewSelect
                              isClearable={false}
                              name="shipToPartner"
                              value={item?.shipToPartner}
                              options={godownDDL}
                              onChange={(e) => {
                                rowDataHandler("shipToPartner", index, e);
                              }}
                              isDisabled
                            />
                          ) : (
                            item?.shipToPartnerName
                          )}
                        </td>
                        <td className="text-right" style={{ width: "100px" }}>
                          {status ? (
                            <InputField
                              name="date"
                              placeholder="Date"
                              value={item?.date}
                              type="date"
                              onChange={(e) => {
                                rowDataHandler("date", index, e?.target?.value);
                              }}
                              disabled
                            />
                          ) : (
                            item?.date
                          )}
                        </td>{" "}
                        <td style={{ width: "100px" }}>{item?.supplierName}</td>
                        {/* {values?.confirmationType?.value !== 3 && (
                          <td style={{ width: "100px" }}>
                            {item?.supplierName}
                          </td>
                        )} */}
                        <td>{item?.driverName}</td>
                        <td>{item?.driverPhone}</td>
                        <td style={{ width: "150px" }}>
                          {status ? (
                            <SearchAsyncSelect
                              selectedValue={item?.godownLabourSupplier}
                              handleChange={(valueOption) => {
                                rowDataHandler(
                                  "godownLabourSupplier",
                                  index,
                                  valueOption
                                );
                              }}
                              loadOptions={loadOptions}
                              isDisabled
                            />
                          ) : (
                            item?.godownLabourSupplierName
                          )}
                        </td>
                        {/* {values?.confirmationType?.value !== 2 && (
                          <td style={{ width: "150px" }}>
                            {status ? (
                              <SearchAsyncSelect
                                selectedValue={item?.godownLabourSupplier}
                                handleChange={(valueOption) => {
                                  rowDataHandler(
                                    "godownLabourSupplier",
                                    index,
                                    valueOption
                                  );
                                }}
                                loadOptions={loadOptions}
                              />
                            ) : (
                              item?.godownLabourSupplierName
                            )}
                          </td>
                        )} */}
                        <td style={{ width: "100px" }}>{item?.actionByName}</td>
                        {/* <td>
                          <div className="d-flex justify-content-center align-items-center">
                            <span>
                              <IEdit />
                            </span>
                          </div>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
          values={values}
        />
      )}
    </>
  );
};

export default Table;
