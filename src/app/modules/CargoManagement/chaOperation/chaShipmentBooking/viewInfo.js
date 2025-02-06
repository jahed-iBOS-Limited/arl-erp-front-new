import React, { useEffect } from 'react';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import Loading from '../../../_helper/_loading';
import { imarineBaseUrl } from '../../../../App';
import './viewInfo.css';
import { _dateFormatter } from '../../../_helper/_dateFormate';

function ViewInfo({ clickRowDto }) {
  const [
    singleChaShipmentBooking,
    getSingleChaShipmentBooking,
    singleChaShipmentBookingLoading,
  ] = useAxiosGet();

  useEffect(() => {
    if (clickRowDto?.chabookingId) {
      getSingleChaShipmentBooking(
        `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingById?ChaShipmentbookingId=${clickRowDto?.chabookingId}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowDto]);

  if (singleChaShipmentBookingLoading) {
    return <Loading />;
  }
  return (
    <div className="chaShipmentBooking-view-container">
      {singleChaShipmentBooking ? (
        <div className="info-card">
          {/* impExp */}
          <div className="info-item">
            <span className="info-item-label">Imp/Exp:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.impExp}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">HBL No:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.hblNo}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">MBL No:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.mblNo}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Carrier:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.carrierName}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Customer:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.customerName}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Mode of Transport:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.modeOfTransportName}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Shipper:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.shipperName}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Consignee:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.consignee}
            </span>
          </div>
          {/* fcllclName */}
          <div className="info-item">
            <span className="info-item-label">FCL/LCL:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.fcllclName}
            </span>
          </div>
          {/* portOfReceive */}
          <div className="info-item">
            <span className="info-item-label">Port of Receive:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.portOfReceive}
            </span>
          </div>
          {/* portOfLoading */}
          <div className="info-item">
            <span className="info-item-label">Port of Loading:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.portOfLoading}
            </span>
          </div>
          {/* portOfDelivery */}
          <div className="info-item">
            <span className="info-item-label">Port of Delivery:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.portOfDelivery}
            </span>
          </div>
          {/* placeOfDelivery */}
          <div className="info-item">
            <span className="info-item-label">Place of Delivery:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.placeOfDelivery}
            </span>
          </div>
          {/* depoPlaceName */}
          <div className="info-item">
            <span className="info-item-label">Depo Place:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.depoPlaceName}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Incoterm:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.incotermName}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Commodity:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.commodityName}
            </span>
          </div>
          {/* thirdPartyName */}
          <div className="info-item">
            <span className="info-item-label">Third Party:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.thirdPartyName}
            </span>
          </div>
          {/* csSalesPic */}
          <div className="info-item">
            <span className="info-item-label">CS Sales Pic:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.csSalesPic}
            </span>
          </div>
          {/* containerQty */}
          <div className="info-item">
            <span className="info-item-label">Container Qty:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.containerQty}
            </span>
          </div>

          {/* originCountry */}
          <div className="info-item">
            <span className="info-item-label">Origin Country:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.originCountry}
            </span>
          </div>
          {/* dischargingVesselNo */}
          <div className="info-item">
            <span className="info-item-label">Discharging Vessel No:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.dischargingVesselNo}
            </span>
          </div>
          {/* invoiceValue */}
          <div className="info-item">
            <span className="info-item-label">Invoice Value:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.invoiceValue}
            </span>
          </div>
          {/* commercialInvoiceNo */}
          <div className="info-item">
            <span className="info-item-label">Commercial Invoice No:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.commercialInvoiceNo}
            </span>
          </div>
          {/* invoiceDate */}
          <div className="info-item">
            <span className="info-item-label">Invoice Date:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.invoiceDate
                ? _dateFormatter(singleChaShipmentBooking?.invoiceDate)
                : ''}
            </span>
          </div>
          {/* assessed */}
          <div className="info-item">
            <span className="info-item-label">Assessed:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.assessed}
            </span>
          </div>
          {/* assessedDate */}
          <div className="info-item">
            <span className="info-item-label">Assessed Date:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.assessedDate
                ? _dateFormatter(singleChaShipmentBooking?.assessedDate)
                : ''}
            </span>
          </div>

          {/* exp */}
          <div className="info-item">
            <span className="info-item-label">Exp:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.exp}
            </span>
          </div>

          {/* expDate */}
          <div className="info-item">
            <span className="info-item-label">Exp Date:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.expDate
                ? _dateFormatter(singleChaShipmentBooking?.expDate)
                : ''}
            </span>
          </div>
          {/* billOfEntry */}
          <div className="info-item">
            <span className="info-item-label">Bill of Entry:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.billOfEntry}
            </span>
          </div>
          {/* billOfEntryDate */}
          <div className="info-item">
            <span className="info-item-label">Bill of Entry Date:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.billOfEntryDate
                ? _dateFormatter(singleChaShipmentBooking?.billOfEntryDate)
                : ''}
            </span>
          </div>
          {/* grossWeight */}
          <div className="info-item">
            <span className="info-item-label">Gross Weight:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.grossWeight}
            </span>
          </div>
          {/* cbmWeight */}
          <div className="info-item">
            <span className="info-item-label">CBM Weight:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.cbmWeight}
            </span>
          </div>
          {/* volumetricWeight */}
          <div className="info-item">
            <span className="info-item-label">Volumetric Weight:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.volumetricWeight}
            </span>
          </div>
          {/* exchangeRate */}
          <div className="info-item">
            <span className="info-item-label">Exchange Rate:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.exchangeRate}
            </span>
          </div>

          <div className="info-item">
            <span className="info-item-label">Currency:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.currency}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">ETA:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.eta
                ? _dateFormatter(singleChaShipmentBooking?.eta)
                : ''}
            </span>
          </div>
          <div className="info-item">
            <span className="info-item-label">ATA:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.ata
                ? _dateFormatter(singleChaShipmentBooking?.ata)
                : ''}
            </span>
          </div>
          {/* LC No */}
          <div className="info-item">
            <span className="info-item-label">LC No:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.lcNo}
            </span>
          </div>
          {/* LC Date */}
          <div className="info-item">
            <span className="info-item-label">LC Date:</span>
            <span className="info-item-value">
              {singleChaShipmentBooking?.lcDate
                ? _dateFormatter(singleChaShipmentBooking?.lcDate)
                : ''}
            </span>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default ViewInfo;
