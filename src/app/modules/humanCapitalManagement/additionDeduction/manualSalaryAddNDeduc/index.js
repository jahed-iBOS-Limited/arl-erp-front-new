import React, { useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Loading from "./../../../_helper/_loading";
import Form from "./form";
import { excelFileToArray } from "./excelFileToJSON";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "./../../../../../_metronic/_partials/controls";
import { updateManualAddNDeduct, IConfirmModal } from "./helper";

let initData = {
  month: "",
  year: "",
};

const ManualSalaryAddNDeducForm = () => {
  const btnRef = useRef();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (!values?.month) return toast.warn("Please select month");
    if (!values?.year) return toast.warn("Please select year");
    if (rowDto.length < 1) return toast.warn("Please add at least one row");
    const newRowDto = rowDto.map((itm) => {
      return {
        businessUnitId: selectedBusinessUnit?.value,
        enroll: itm?.enroll,
        additionAmount: itm?.additionAmount,
        deductionAmount: itm?.deductionAmount,
        actionBy: profileData?.userId,
        monthId: values?.month?.value,
        yearId: values?.year?.value,
      };
    });
    const payload = newRowDto;
    const callBack = () => {
      cb();
    };
    updateManualAddNDeduct(payload, setDisabled, callBack);
  };

  const fileUpload = async (file, values) => {
    const data = await excelFileToArray(file);

    let isValid = true;
    let newData = [];

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (!item.Enroll) {
        isValid = false;
        newData = [];
        break;
      }
      let obj = {
        sl: item?.SL,
        enroll: item?.Enroll,
        additionAmount: item["AdditionAmount"] || 0,
        deductionAmount: item["DeductionAmount"] || 0,
      };

      newData.push(obj);
    }

    if (isValid) {
      setRowDto(newData);
    } else {
      let confirmObject = {
        title: `Are you sure?`,
        message: `Enroll is required. Please Refress the page & try again.`,
        closeOnClickOutside: false,
        yesAlertFunc: () => {
          window.location.reload();
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
      // toast.warn("Enroll is required. Please Refress the page & try again.");
      setRowDto([]);
    }
  };

  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Manual Salary Addition & Deduction"}>
          <CardHeaderToolbar>
            <button
              onClick={saveBtnClicker}
              className="btn btn-primary ml-2"
              type="submit"
              ref={btnRef}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            <Form
              btnRef={btnRef}
              initData={initData}
              saveHandler={saveHandler}
              fileUpload={fileUpload}
              rowDto={rowDto}
              setLoading={setDisabled}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ManualSalaryAddNDeducForm;
