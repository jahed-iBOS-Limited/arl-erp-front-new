import React from "react";
import { QrReader } from "react-qr-reader";

const QrCodeScanner = ({ QrCodeScannerCB }) => {
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
      />
    </div>
  );
};

export default QrCodeScanner;
