/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import shortid from "shortid";
import { toArray } from "lodash";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const initData = {
  priceStructureCode: "",
  priceStructureName: "",
  priceStructureType: { value: "", label: "" },
};

export default function AddForm({ history }) {
  const [isDisabled, setDisabled] = useState(false);
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const saveData = async (values, cb) => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      values &&
      values.rowDto
    ) {
      const { rowDto } = values;
      const rowDtoArray = toArray(rowDto);
      if (rowDtoArray.length) {
        if (
          rowDto[rowDtoArray.length - 1]?.priceComponent
            ?.priceComponentTypeId !== 6
        ) {
          toast.info(
            "Price Structure last row must be a non contributing type!"
          );
        } else {
          const createPriceStructureRowDTO = rowDtoArray.map((itm, idx) => {
            return {
              priceComponentId: itm?.priceComponent?.value,
              priceComponentTypeId: itm?.priceComponent?.priceComponentTypeId,
              valueType: itm?.valueType?.value || "amount",
              numValue: +itm?.numValue || 0,
              baseComponentId: itm?.baseComponent?.value || 0,
              serialNo: idx + 1,
              sumFromSerial: itm?.sumFromSerial?.value || 0,
              sumToSerial: itm?.sumToSerial?.value || 0,
              isMannual: itm?.isManual || false,
            };
          });

          const priceStructureData = {
            createPriceStructureHeaderDTO: {
              priceStructureCode: values.priceStructureCode,
              priceStructureName: values.priceStructureName,
              priceStructureTypeId: values.priceStructureType?.value,
              priceComponentId: values.priceComponentId,
              businessUnitId: selectedBusinessUnit.value,
              accountId: profileData.accountId,
              actionBy: profileData.userId,
            },
            createPriceStructureRowDTO,
          };
          try {
            setDisabled(true);
            const res = await Axios.post(
              "/item/PriceStructure/CreatePriceStructure",
              priceStructureData
            );
            cb(initData);
            toast.success(res.data?.message || "Submitted successfully", {
              toastId: shortid(),
            });
            setDisabled(false);
          } catch (error) {
            toast.error(error?.response?.data?.message, { toastId: shortid() });
            setDisabled(false);
          }
        }
      }
    } else {
      setDisabled(false);
      
    }
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const backHandler = () => {
    history.push(`/config/material-management/price-structure`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}

      <CardHeader title="Create Price Structure">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveBtnClicker}
            ref={btnRef}
            disabled={isDisabled}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          <Form
            data={initData}
            btnRef={btnRef}
            saveData={saveData}
            resetBtnRef={resetBtnRef}
          />
        </div>
      </CardBody>
    </Card>
  );
}
