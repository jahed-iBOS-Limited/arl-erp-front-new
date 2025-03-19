import React, { useState } from "react";
import PaginationTable from "../../../../../chartering/_chartinghelper/_tablePagination";
import IConfirmModal from "../../../../../_helper/_confirmModal";
import ICustomTable from "../../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IClose from "../../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../../_helper/_helperIcons/_edit";
import IView from "../../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../../_helper/_viewModal";
import { RFQViewDetails } from "../detailsModal/rfqDetails";
import { closedRFQById } from "../helper";
const GridData = ({
  history,
  paginationState,
  setPositionHandler,
  paginationSearchHandler,
  values,
  cb,
  selectedBusinessUnit,
  profileData,
  landingData,
  getLandingData,
}) => {
  let ths = [
    "SL",
    "Vessel",
    "Warehouse",
    "Reference Code",
    "RFQ Code",
    "RFQ Date",
    "Currency",
    "RFQ Start Date",
    "RFQ End Date",
    "Status",
    "Action",
  ];
  // gridData ddl

  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  // const dispatch = useDispatch();
  const [currentItem, setCurrentItem] = useState()
  const [isFfqDetailsModal, setRfqDetailsModal] = useState(false);

  const closedConfirmModal = (rfqID, userId, cb) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to Close this RFQ`,
      yesAlertFunc: () => {
        closedRFQById(rfqID, userId, cb)
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  }

  // const approveSubmitlHandler = (POId, POorderTypeID, PORefType) => {
    
  // };

  return (
    <div style={{ marginTop: "-35px" }}>     
      <ICustomTable ths={ths} className="table-font-size-sm">
        {landingData?.data?.map((td, index) => {
          return (
            <tr key={index}>
              <td> {td.sl} </td>
              <td> {td.plantName} </td>
              <td> {td.warehouseName} </td>
              <td> {td.referenceCode} </td>
              <td> {td.strRequestForQuotationCode} </td>
              <td> {_dateFormatter(td.rfqdate)} </td>
              <td> {td.currencyCode} </td>
              <td> {`${td?.startDate?.split("T")[0]} / ${td?.startDate?.split("T")[1]}`} </td>
              <td> {`${td?.endDate?.split("T")[0]} / ${td?.endDate?.split("T")[1]}`} </td>
              <td> {td?.strStatus} </td>
              <td>
                <div className="d-flex justify-content-center align-items-center">              
                    <IView
                      title="View"
                      classes="mr-3"
                      clickHandler={() => {
                        setCurrentItem(td)
                        setRfqDetailsModal(true);                         
                      }}
                    />                   
                    {td?.strStatus === "Not Started" && 
                      <span
                        onClick={() =>
                          history.push({
                            pathname:`/mngProcurement/comparative-statement/shipping-rfq/edit/${td?.intRequestForQuotationId}`,
                            state: values,
                            rfqSingleData: td
                          })
                        }
                        className="mr-3 ml-3 pointer"
                      >
                        <IEdit />
                      </span> 
                    }
                    {td?.strStatus !== "Not Started" && 
                      <span
                        onClick={() =>
                          history.push({
                            pathname:`/mngProcurement/comparative-statement/shipping-rfq/edit/${td?.intRequestForQuotationId}`,
                            state: values,
                            rfqSingleData: td
                          })
                        }
                        className="mr-3 ml-3 pointer"
                      >
                        <IEdit />
                      </span> 
                    } 
                    {td?.strStatus === "Open" &&  
                      <IClose
                          title="Close"
                          closer={() =>
                            closedConfirmModal(
                              td?.intRequestForQuotationId,
                              profileData?.userId,
                              ()=>{
                                getLandingData(`/procurement/ShipRequestForQuotation/GetRequestForQuotationShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&RequestTypeId=1&SBUId=${values?.sbu?.value}&PurchaseOrganizationId=${values?.purchaseOrg?.value}&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value}&status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`)
                              }
                            )
                          }
                        />
                      }                                                   
                </div>
              </td>
            </tr>
          );
        })}
      </ICustomTable>
      {/* for shipping iFrame */}

      <IViewModal
        show={isFfqDetailsModal}
        onHide={() => setRfqDetailsModal(false)}
        title="View Request for Quotation"
      >
        <RFQViewDetails
          currentItem={currentItem}
          isHiddenBackBtn={true}
        />
      </IViewModal>

      {landingData?.data?.length > 0 && (
        <PaginationTable
          count={landingData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          values={values}
        />
      )}
    </div>
  );
};

export default GridData;
