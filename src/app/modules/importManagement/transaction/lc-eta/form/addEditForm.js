import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import { date } from "yup";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";

const initData = {
  poNo: "",
  etaDate: _todayDate(),
  invoiceNo: "",
  blNo: "",
  vesselName: "",
  numberOfContainer: "",
};

export default function LcEatAddEditForm() {
  const [, getCreateLetterOfCreaditETA, postLoading] = useAxiosPost();
  const [, getLetterOfCreaditETAById, getByIdLoading] = useAxiosGet("");
  const params = useParams();

  const [objProps, setObjprops] = useState({});

  // get singleData
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    if (params?.id) {
      getLetterOfCreaditETAById(
        `/imp/Shipment/GetLetterOfCreaditETAById?Id=${params?.id}`,
        (data) => {
          if (data) {
            const {
              lcid,
              etaDate,
              nvoiceNo,
              blno,
              vesselName,
              numberOfContainer,
              ponumber,
              poid,
            } = data || {};
            setSingleData({
              poNo: poid ? { value: poid, label: ponumber } : "",
              lcid: lcid || 0,
              etaDate: etaDate ? _dateFormatter(etaDate) : "",
              invoiceNo: nvoiceNo || "",
              blNo: blno || "",
              vesselName: vesselName || "",
              numberOfContainer: numberOfContainer || "",
            });
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    if (!values?.lcid) return toast.warning("LC Not Found");
    const paylaod = {
      lcidetanfoId: params?.id || 0,
      lcid: +values?.lcid || 0,
      poId: values?.poNo?.poId || 0,
      etaDate: values?.etaDate || "",
      nvoiceNo: values?.invoiceNo || "",
      blno: values?.blNo || "",
      vesselName: values?.vesselName || "",
      numberOfContainer: +values?.numberOfContainer || 0,
    };

    getCreateLetterOfCreaditETA(
      "/imp/Shipment/CreateLetterOfCreaditETA",
      paylaod,
      (data) => {
        if (!params?.id) {
          cb(initData);
        }
      },
      true
    );
  };
  console.log(singleData, "singleData");
  return (
    <IForm
      title={params?.id ? "Edit LC ETA" : "LC ETA"}
      getProps={setObjprops}
      isDisabled={postLoading || getByIdLoading}
    >
      {(postLoading || getByIdLoading) && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.id
            ? singleData
            : {
                ...initData,
              }
        }
        saveHandler={saveHandler}
        isEdit={params?.id ? true : false}
      />
    </IForm>
  );
}
