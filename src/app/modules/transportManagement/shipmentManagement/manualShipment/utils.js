import axios from "axios";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

export const getDataForPrint = async (
    loadingId,
    setLoading,
    cb
) => {
    setLoading(true);
    try {
        const res = await axios.get(`/tms/Vehicle/GetLoadingSlipById?LoadingId=${loadingId}`);
        cb(res?.data?.data);
        setLoading(false);
    } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
    }
};

export const DataPrintHandler = () => {
    const printRefCement = useRef();
    const handleInvoicePrintCement = useReactToPrint({
        content: () => printRefCement.current,
        documentTitle: "salesInvoice",
        pageStyle:
            "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
    });
    return { handleInvoicePrintCement, printRefCement };
};

export const updateLoadingSlip = async (
    payload,
    setLoading,
    cb
) => {
    setLoading(true);
    try {
        const res = await axios.put('/tms/Vehicle/EditLoadingSlip', payload);
        toast.success(res?.data?.message);
        cb(res?.data?.data);
        setLoading(false);
    } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
    }
};