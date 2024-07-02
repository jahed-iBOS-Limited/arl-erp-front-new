import React from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = ({ QrCodeScannerCB }) => {
  const handleScan = (result) => {
    if (result) {
      QrCodeScannerCB(result.text);
    }
  };
  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader
        onResult={handleScan}
        onError={handleError}
        style={{ width: "100%" }}
        className="qr-scanner"
        videoContainerStyle={{ paddingTop: "70%" }}
        constraints={ {facingMode: 'environment'} }
      />
    </div>
  );
};
export default QRCodeScanner;
