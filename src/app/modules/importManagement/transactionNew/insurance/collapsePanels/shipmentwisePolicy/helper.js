import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import * as Yup from "yup";

// Get Shipment Type DDL
export const GetShipmentDDL = async (accId, buId, PoNo, setter) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accId}&businessUnitId=${buId}&search=${PoNo}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// Create Insurance Policy
export const CreateInstancePolicy = async (
  data,
  cb,
  GetInsurancePolicyLandingData
) => {
  try {
    const res = await axios.post(
      "/imp/InsurancePolicy/CreateInsurancePolicy",
      data
    );
    if (res.status === 200 && res.data) {
      toast.success(res.message || "Submitted  successfully");
      cb();
      GetInsurancePolicyLandingData();
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Get Landing Data for Insurance Policy
export const GetInsurancePolicyLandingData = async (
  accId,
  buId,
  poNo,
  setter
) => {
  try {
    const res = await axios.get(
      `imp/InsurancePolicy/GetInsurancePolicyLanding?accountId=${accId}&businessUnitId=${buId}&PONumber=${poNo}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// Get Shipment Wise Insurance Policy By Id
export const GetShipmentWiseInsurancePolicyById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/imp/InsurancePolicy/GetInsurancePolicyById?shipmentId=${id}`
    );
    if (res.status === 200 && res.data) {
      const data = {
        shipment: {
          value: res?.data?.shipmentId,
          label: res?.data?.shipmentCode,
        },
        policyNumber: res?.data?.policyNumber,
        policyDate: _dateFormatter(res?.data?.dtePolicyDate),
        billNo: res?.data?.billNumber ? res?.data?.billNumber : '',
        invoiceAmount: res?.data?.numInvoiceAmount,
        insuredBDT: res?.data?.numInsuredBdt,
        totalAmount: res?.data?.numTotalAmount,
        vat: res?.data?.numVatamount,
        dueDate: _dateFormatter(res?.data?.dueDate),
      };
      setter(data);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Save Edited data of Shipment Wise Insurance Policy
export const EditShipmentWiseInsurancePolicy = async (data, cb) => {
  try{
    const res = await axios.put('/imp/InsurancePolicy/EditInsurancePolicy', data);
    toast.success(res?.message || 'Updated Successfully');
    cb();
  }
  catch(error){
    toast.error(error?.response?.data?.message);
  }
}



export const EditInsurancePolicy = async (data, cb,GetInsurancePolicyLandingData) => {
  try {
    const res = await axios.put(
      "/imp/InsurancePolicy/EditInsurancePolicy",
      data
    );
    if (res.status === 200 && res.data) {
      toast.success(res.message || "Updated  successfully");
      // cb();
      GetInsurancePolicyLandingData()
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  shipment: Yup.object()
    .shape({
      label: Yup.string().required("Shipment is required"),
      value: Yup.string().required("Shipment is required"),
    })
    .typeError("Shipment is required"),
  policyNumber: Yup.string()
    .required("Policy Number is required")
    .typeError("Policy Number is required"),
  policyDate: Yup.string().required("Policy Date Number is required"),
  // billNo: Yup.string().required("Bill No is required"),
  invoiceAmount: Yup.string().required("Invoice Amount is required"),
  vat: Yup.string().required("VAT is required"),
  totalAmount:Yup.number().positive("Total Amount is always positive").required("Total Amount is required")
});
