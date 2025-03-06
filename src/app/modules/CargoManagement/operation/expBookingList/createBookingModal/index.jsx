import CryptoJS from "crypto-js";
import React from "react";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../../App";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function CreateBookingModal({ CB, rowClickData, isExport }) {
  const [option, getOptions] = useAxiosGet();
  const [value, setValue] = React.useState(null);
  // Go to Create Booking
  const handleGoToCreate = (item) => {
    const targetUrl =
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3010"
        : "https://cargo.ibos.io/";

    if (!value?.email) {
      toast.error(
        `Selected ${isExport ? "Shipper" : "Consignee "} has no email address`
      );
      return;
    }
    // Encrypt the userIDEmail using base64 encoding

    const encryptedUserEmail = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(value?.email)
    );

    let url;
    if (isExport) {
      url = "export-from-erp/1";
    } else {
      url = "import-from-erp/2";
    }
    window.open(`${targetUrl}/${url}?email=${encryptedUserEmail}`, "_blank");
  };

  // Get ALL DDL
  React.useEffect(() => {
    if (isExport) {
      getOptions(
        `${imarineBaseUrl}/domain/ShippingService/GetRegistrationPartnerDDL?typeId=1`
      );
    }
    if (!isExport) {
      getOptions(
        `${imarineBaseUrl}/domain/ShippingService/ImportorExportTypeWisePartnerDDL?typeId=2`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <NewSelect
        label={isExport ? "Shipper" : "Consignee"}
        options={option || []}
        value={value}
        onChange={(valueOption) => {
          setValue(valueOption || "");
        }}
        name={isExport ? "shipper" : "consignee"}
        placeholder={`Select ${isExport ? "Shipper" : "Consignee"}`}
      />
      <button
        onClick={() => handleGoToCreate(value)}
        className="btn btn-primary mt-2"
      >
        Go
      </button>
    </div>
  );
}
