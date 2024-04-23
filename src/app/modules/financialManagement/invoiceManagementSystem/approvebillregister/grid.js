import React, { useState } from "react";
// import ViewG2GCustomizeBill from "../billregister/g2gCustomizeBill/view/viewBillRegister";
import ViewCNFBill from "../billregister/cnfBill/view/table";
import ViewG2GGodownUnloadBill from "../billregister/g2gGodownUnloadBill/view/viewBillRegister";
import ViewG2GLighterBill from "../billregister/g2gLighterBill/view/viewBillRegister";
import ViewG2GTruckBill from "../billregister/g2gTruckBill/view/viewBillRegister";
import ViewGhatLoadUnloadBill from "../billregister/ghatLoadUnloadBill/view/viewBillRegister";
import ViewHatchLaborBill from "../billregister/hatchLaborBill/view/table";
import OthersBillView from "../billregister/othersBillNew/view/othersBillView";
import ViewPumpFoodingBill from "../billregister/pumpFoodingBill/view/viewPumpFoodingBill";
import ViewSalesCommission from "../billregister/salesCommission/view/viewSalesCommission";
import ViewStevedoreBill from "../billregister/stevedoreBill/view/table";
import ViewSurveyorBill from "../billregister/surveyorBill/view/table";
import ViewTransportBill from "../billregister/transportBill/view/viewBillRegister";
import ShippingInvoiceView from "../shippingBillRegister/shippingInvoiceView";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../_helper/_fixedPoint";
import IDelete from "./../../../_helper/_helperIcons/_delete";
import IView from "./../../../_helper/_helperIcons/_view";
import IViewModal from "./../../../_helper/_viewModal";
import ViewFuelBill from "./../billregister/fuelBill/view/viewBillRegister";
import ViewInternalTransportBill from "./../billregister/internalTransportBill/view/viewBillRegister";
import ViewLabourBill from "./../billregister/labourBill/view/viewBillRegister";
import AdvForInternalView from "./advForInternal";
import CommercialBillTypeDetails from "./commercialBillType";
import ExpenseView from "./expenseView";
import RejectModel from "./rejectModel/form";
import SupplerInvoiceView from "./supplerInvoiceView";
import SupplierAdvanceView from "./supplierAdvanceView";
import ViewDamDeliveryBill from "../billregister/damDelivery/view/table";
import CustomerViewModal from "../billregister/customerRefund/customerViewModal";
const GridData = ({
  rowDto,
  setRowDto,
  allGridCheck,
  itemSlectedHandler,
  values,
  girdDataFunc,
  setIsReject,
  isReject,
  rejectSaveHandler,
}) => {
  const [mdalShow, setModalShow] = useState(false);
  const [gridItem, setGridItem] = useState("");

  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered global-table table-font-size-sm">
            <thead>
              <tr>
                {values?.status?.value === 1 && (
                  <th style={{ width: "25px" }}>
                    <input
                      type="checkbox"
                      id="parent"
                      onChange={(event) => {
                        setRowDto(allGridCheck(event.target.checked, rowDto));
                      }}
                    />
                  </th>
                )}

                <th style={{ width: "20px" }}>SL</th>
                <th style={{ width: "80px" }}>Bill Code</th>
                <th style={{ width: "50px" }}>Bill Date</th>
                <th style={{ width: "75px" }}>Type Name</th>
                {[4].includes(values?.billType?.value) && (
                  <th style={{ width: "100px" }}>Group</th>
                )}

                <th style={{ width: "100px" }}>Partner Name</th>
                <th style={{ width: "100px" }}>Adj. Amount</th>
                <th style={{ width: "80px" }}>Req. Amount</th>
                <th style={{ width: "80px" }}>Approval Amount</th>
                {[1, 2].includes(values?.status?.value) && (
                  <th style={{ width: "50px" }}>Approve Date</th>
                )}

                <th style={{ width: "50px" }}>Is Payment</th>
                <th style={{ width: "220px" }}>Status</th>
                <th style={{ width: "220px" }}>Remarks</th>
                <th style={{ width: "50px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((tableData, index) => (
                <tr key={index}>
                  {values?.status?.value === 1 && (
                    <td>
                      <input
                        id="itemCheck"
                        type="checkbox"
                        className=""
                        value={tableData?.itemCheck}
                        checked={tableData?.itemCheck}
                        name={tableData?.itemCheck}
                        onChange={(e) => {
                          setRowDto(
                            itemSlectedHandler(e.target.checked, index, rowDto)
                          );
                        }}
                      />
                    </td>
                  )}

                  <td> {tableData.sl} </td>
                  <td> {tableData.billRegisterCode} </td>
                  <td> {_dateFormatter(tableData.billRegisterDate)} </td>
                  <td> {tableData.billTypeName} </td>
                  {[4].includes(values?.billType.value) && (
                    <td>{tableData?.expenseGroup}</td>
                  )}
                  <td> {tableData?.partnerName} </td>
                  <td
                    className="text-right"
                    style={
                      tableData?.adjustmentAmount > 0 ? { color: "red" } : {}
                    }
                  >
                    {_fixedPoint(tableData.adjustmentAmount || 0)}
                  </td>
                  <td className="text-right"> {tableData.monTotalAmount} </td>
                  <td className="text-right"> {tableData.monApproveAmount} </td>
                  {[1, 2].includes(values?.status?.value) && (
                    <td>{_dateFormatter(tableData?.approvalDate)}</td>
                  )}
                  <td className="text-center">
                    {" "}
                    {tableData?.requsetPosted ? "True" : "False"}{" "}
                  </td>
                  <td> {tableData?.billStatus} </td>
                  <td> {tableData.remarks} </td>
                  <td>
                    {
                      <div className="d-flex justify-content-around align-items-center">
                        <span className="view">
                          <IView
                            title={"Edit & View"}
                            clickHandler={() => {
                              setModalShow(true);
                              setGridItem(tableData);
                            }}
                          />
                        </span>
                        {values?.status?.value === 1 && (
                          <span
                            className="view"
                            onClick={() => {
                              setIsReject(true);
                              setGridItem(tableData);
                            }}
                          >
                            <IDelete title={"Bill Cancel"} />
                          </span>
                        )}
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <IViewModal show={mdalShow} onHide={() => setModalShow(false)}>
        {gridItem?.billType === 1 && (
          <SupplerInvoiceView
            gridItem={gridItem}
            laingValues={values}
            girdDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 2 && (
          <SupplierAdvanceView
            gridItem={gridItem}
            laingValues={values}
            girdDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 3 && (
          <AdvForInternalView
            gridItem={gridItem}
            laingValues={values}
            girdDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 4 && (
          <ExpenseView
            gridItem={gridItem}
            laingValues={values}
            girdDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 5 && (
          <CommercialBillTypeDetails
            gridItem={gridItem}
            laingValues={values}
            girdDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 6 && (
          <ViewTransportBill
            landingValues={values}
            gridItem={gridItem}
            setDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 7 && (
          <ViewSalesCommission
            billRegisterId={gridItem?.billRegisterId}
            landingValues={values}
            gridItem={gridItem}
            setDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 8 && (
          <ViewFuelBill
            landingValues={values}
            gridItem={gridItem}
            setDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}

        {(gridItem?.billType === 9 || gridItem?.billType === 10) && (
          <ViewLabourBill
            landingValues={values}
            gridItem={gridItem}
            setDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 12 && (
          <OthersBillView
            landingValues={values}
            gridItem={gridItem}
            setDataFunc={girdDataFunc}
            setModalShow={setModalShow}
            isView={false}
            girdDataFunc={girdDataFunc}
          />
        )}
        {gridItem?.billType === 13 && (
          <ViewInternalTransportBill
            landingValues={values}
            gridItem={gridItem}
            setDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 15 && (
          <ShippingInvoiceView
            gridItem={gridItem}
            laingValues={values}
            girdDataFunc={girdDataFunc}
            setModalShow={setModalShow}
          />
        )}
        {gridItem?.billType === 16 && (
          <ViewG2GTruckBill
            billRegisterId={gridItem?.billRegisterId}
            landingValues={values}
            gridItem={gridItem}
            setModalShow={setModalShow}
            gridDataFunc={girdDataFunc}
          />
        )}
        {gridItem?.billType === 17 && (
          <ViewG2GLighterBill
            billRegisterId={gridItem?.billRegisterId}
            landingValues={values}
            gridItem={gridItem}
            setModalShow={setModalShow}
            girdDataFunc={girdDataFunc}
          />
        )}
        {gridItem?.billType === 18 && (
          <ViewPumpFoodingBill // this component import from bill register orderby sakib vai
            billRegisterId={gridItem?.billRegisterId}
          />
        )}
        {gridItem?.billType === 21 && (
          <ViewG2GGodownUnloadBill billRegisterId={gridItem?.billRegisterId} />
        )}
        {gridItem?.billType === 22 && (
          <ViewGhatLoadUnloadBill
            billRegisterId={gridItem?.billRegisterId}
            landingValues={values}
            gridItem={gridItem}
            setModalShow={setModalShow}
            gridDataFunc={girdDataFunc}
          />
        )}
        {gridItem?.billType === 25 && (
          <ViewCNFBill
            billRegisterId={gridItem?.billRegisterId}
            landingValues={values}
            gridItem={gridItem}
            setModalShow={setModalShow}
            gridDataFunc={girdDataFunc}
          />
        )}
        {gridItem?.billType === 26 && (
          <ViewStevedoreBill billRegisterId={gridItem?.billRegisterId} />
        )}
        {gridItem?.billType === 27 && (
          <ViewSurveyorBill billRegisterId={gridItem?.billRegisterId} />
        )}
        {gridItem?.billType === 28 && (
          <ViewHatchLaborBill billRegisterId={gridItem?.billRegisterId} />
        )}
        {[31, 32].includes(gridItem?.billType) && (
          /* 31: G2G Dump Unload Bill
              32: G2G Dump Delivery(Load) Bill
            */
          <ViewDamDeliveryBill
            billRegisterId={gridItem?.billRegisterId}
            billTypeId={gridItem?.billType}
            values={values}
          />
        )}

        {gridItem?.billType === 33 && (
          <CustomerViewModal landingValues={values} gridItem={gridItem} />
        )}
      </IViewModal>
      {/* RejectModel */}
      <IViewModal
        show={isReject}
        onHide={() => {
          setIsReject(false);
          setGridItem("");
        }}
      >
        <RejectModel
          gridItem={gridItem}
          laingValues={values}
          girdDataFunc={girdDataFunc}
          setIsReject={setIsReject}
          rejectSaveHandler={rejectSaveHandler}
        />
      </IViewModal>
    </>
  );
};

export default GridData;
