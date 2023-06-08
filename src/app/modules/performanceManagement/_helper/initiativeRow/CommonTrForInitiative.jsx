/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import customStyles from "../../../selectCustomStyle";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IApproval from "../../../_helper/_helperIcons/_approval";
import IClose from "../../../_helper/_helperIcons/_close";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IUpdate from "../../../_helper/_helperIcons/_update";
import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import SlideReportView from "../../slideReportView/SlideReportView";
import { saveStrategicInitiativeRowAction } from "./helper";

export default function CommonTrForInitiative({ obj }) {
  const {
    edit,
    rowDtoHandler,
    data,
    setData,
    statusDDL,
    title,
    permission,
    setEdit,
    setLoading,
    values,
    deleteHandler,
    typeName,
    typeId,
    refName,
    refId,
    modalHeading,
    finance,
    customer,
    process,
    growth,
    isProject,
  } = obj;

  const [ownerDDL, getOwnerDDL] = useAxiosGet();
  const [currentItem, setCurrentItem] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    getOwnerDDL(
      `/domain/EmployeeBasicInformation/GetEmployeeDepertmentDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, [profileData, selectedBusinessUnit]);

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(`/hcm/HCMReport/GetARLEmployeeList?BusinessUnitId=${0}&Search=${v}`)
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <tr style={{ background: "rgb(155, 102, 255)" }}>
        <td className="kpi-new-table-firstTd">{title}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      {data?.length > 0 &&
        data.map((item, index) => (
          <tr>
            <td>{item?.particularsName}</td>
            {edit === item?.flatIndex ? (
              <>
                <td>
                  <input
                    style={{
                      border: "1px solid black",
                      height: "30px",
                      borderRadius: "5px",
                      width: "70px",
                    }}
                    type="number"
                    step="1"
                    value={item?.initiativeNo}
                    onChange={(e) => {
                      rowDtoHandler(
                        "initiativeNo",
                        e.target.value,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
                <td>
                  {isProject ? (
                    <div>
                      <SearchAsyncSelect
                        selectedValue={item?.ownerName}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          rowDtoHandler(
                            "ownerName",
                            valueOption,
                            index,
                            data,
                            setData
                          );
                        }}
                        loadOptions={loadUserList}
                      />
                    </div>
                  ) : (
                    <Select
                      styles={customStyles}
                      value={item?.ownerName}
                      options={ownerDDL}
                      menuPosition="fixed"
                      onChange={(valueOption) => {
                        rowDtoHandler(
                          "ownerName",
                          valueOption,
                          index,
                          data,
                          setData
                        );
                      }}
                    />
                  )}
                </td>
                <td>
                  <Select
                    styles={customStyles}
                    value={item?.priorityName}
                    options={[
                      { label: "High", value: 1 },
                      { label: "Medium", value: 2 },
                      { label: "Low", value: 3 },
                    ]}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      rowDtoHandler(
                        "priorityName",
                        valueOption,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
                <td>
                  <input
                    style={{
                      border: "1px solid black",
                      height: "30px",
                      borderRadius: "5px",
                      width: "80px",
                    }}
                    type="number"
                    value={item?.budget}
                    onChange={(e) => {
                      rowDtoHandler(
                        "budget",
                        e.target.value,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
                <td>
                  <input
                    style={{
                      border: "1px solid black",
                      height: "30px",
                      borderRadius: "5px",
                      width: "115px",
                    }}
                    type="date"
                    value={item?.startDate}
                    onChange={(e) => {
                      rowDtoHandler(
                        "startDate",
                        e.target.value,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
                <td>
                  <input
                    style={{
                      border: "1px solid black",
                      height: "30px",
                      borderRadius: "5px",
                      width: "115px",
                    }}
                    type="date"
                    value={item?.endDate}
                    onChange={(e) => {
                      rowDtoHandler(
                        "endDate",
                        e.target.value,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
                <td>
                  <Select
                    styles={customStyles}
                    value={item?.statusValueLabel}
                    options={statusDDL}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      rowDtoHandler(
                        "statusValueLabel",
                        valueOption,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
                <td>
                  <input
                    style={{
                      border: "1px solid black",
                      height: "30px",
                      borderRadius: "5px",
                    }}
                    type="text"
                    value={item?.comment}
                    onChange={(e) => {
                      rowDtoHandler(
                        "comment",
                        e.target.value,
                        index,
                        data,
                        setData
                      );
                    }}
                  />
                </td>
              </>
            ) : (
              <>
                <td>{item?.initiativeNo}</td>
                <td>{item?.ownerName?.label}</td>
                <td>{item?.priorityName?.label}</td>
                <td className="text-right">{item?.budget}</td>
                <td>{item?.startDate}</td>
                <td>{item?.endDate}</td>
                <td>{item?.statusValueLabel?.label}</td>
                <td>{item?.comment}</td>
              </>
            )}
            <td className="text-center">
              {permission?.isEdit ? (
                <div className="d-flex justify-content-around">
                  <span
                    className="d-flex"
                    onClick={() => {
                      if (edit !== item?.flatIndex) {
                        setEdit(item?.flatIndex);
                        return null;
                      }

                      if (
                        !refId ||
                        !refName ||
                        !item?.ownerName?.value ||
                        !item?.priorityName?.value ||
                        !item?.startDate ||
                        !item?.endDate
                      ) {
                        return toast.warn(
                          "Please select Owner, Priority, Start date, End date"
                        );
                      }

                      let payload = {
                        initiativeTypeId: typeId,
                        initiativeType: typeName,
                        initiativeTypeReferenceId: refId,
                        initiativeTypeReference: refName,
                        strategicParticularsId: item?.particularsId,
                        initiativeNo: item?.initiativeNo,
                        statusId: item?.statusValueLabel?.value,
                        status: item?.statusValueLabel?.label,
                        remarks: item?.comment,
                        actionBy: profileData?.userId,
                        ownerId: item?.ownerName?.value,
                        ownerName: item?.ownerName?.label,
                        priorityId: item?.priorityName?.value,
                        priorityName: item?.priorityName?.label,
                        budget: item?.budget,
                        startDate: item?.startDate,
                        endDate: item?.endDate,
                      };
                      saveStrategicInitiativeRowAction(payload, setLoading);
                    }}
                  >
                    {edit === item?.flatIndex ? (
                      <span>
                        <IApproval title="Save" />
                      </span>
                    ) : (
                      <span>
                        <IUpdate title={"Edit"} />
                      </span>
                    )}
                  </span>
                  <span
                    onClick={() => {
                      deleteHandler(item?.particularsId, values);
                    }}
                    className="pointer mx-2"
                  >
                    <IDelete />
                  </span>
                  <span
                    onClick={() => {
                      setCurrentItem({
                        item,
                        index: item?.flatIndex,
                      });
                      setIsShowModal(true);
                    }}
                    className="pointer mx-2"
                  >
                    <IView />
                  </span>
                  {edit !== "" && (
                    <span onClick={() => setEdit("")} className="pointer">
                      <IClose />
                    </span>
                  )}
                </div>
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        ))}
      <IViewModal
        dialogClassName="kpi-presentation-report h-100"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <SlideReportView
          newData={[...finance, ...customer, ...process, ...growth]}
          currentItem={currentItem}
          heading={modalHeading}
        />
      </IViewModal>
    </>
  );
}
