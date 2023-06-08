/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef, useEffect } from "react";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import { useParams } from "react-router-dom";
import Loading from "./../../../../../../_helper/_loading";
const initProduct = {
  accountName: "",
  accountNo: "",
  branchName: "",
  bankName: "",
  routingNo: "",
};

export default function PartnerBank() {
  const { id } = useParams();
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [partnerBankInfo, setPartnerBankInfo] = useState("");

  useEffect(() => {
    getBusinessPartnerBankInfoByPartnerId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      id
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value, id]);

  const getBusinessPartnerBankInfoByPartnerId = async (accId, buId, id) => {
    try {
      const res = await Axios.get(
        `/partner/BusinessPartnerBankInfo/GetBusinessPartnerBankInfoByAccountIdBusinessUnitId?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${id}&Status=true`
      );
      if (res && res.data.length) {
        const defaultBankAccount = res.data.filter(
          (itm) => itm.isDefaultAccount === true
        );
        const singleData = {
          accountName: defaultBankAccount[0]?.bankAccountName,
          accountNo: defaultBankAccount[0]?.bankAccountNo,
          branchName: {
            value: defaultBankAccount[0]?.bankBranchId,
            label: defaultBankAccount[0]?.bankBranchName,
          },
          bankName: {
            value: defaultBankAccount[0]?.bankId,
            label: defaultBankAccount[0]?.bankName,
          },
          routingNo: defaultBankAccount[0]?.routingNo,
          isDefaultAccount: defaultBankAccount[0]?.isDefaultAccount,
        };
        setPartnerBankInfo(singleData);
        setRowDto([...res.data]);
      } else {
        setRowDto([]);
      }
    } catch (error) {}
  };

  const saveBusinessUnit = async (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;

      if (id) {
        const partnerBankEditInfo = rowDto;
        try {
          setDisabled(true);
          const res = await Axios.put(
            "/partner/BusinessPartnerBankInfo/EditBusinessPartnerBankInfo",
            partnerBankEditInfo
          );
          getBusinessPartnerBankInfoByPartnerId(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            id
          );
          cb();
          toast.success(res.data?.message || "Submitted successfully", {
            toastId: shortid(),
          });
          setDisabled(false);
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
          setDisabled(false);
        }
      } else {
        let objRow = rowDto.map((itm) => {
          return {
            accountId: accountId,
            businessUnitId: businessunitid,
            businessPartnerId: +id,
            bankId: values?.bankName?.value,
            bankName: values?.bankName?.label,
            bankBranchId: values?.branchName?.value,
            bankBranchName: values?.branchName?.label,
            routingNo: values?.routingNo,
            bankAccountNo: values?.accountNo,
            bankAccountName: values?.accountName,
            isDefaultAccount: values?.isDefaultAccount || false,
            actionBy: actionBy,
          };
        });

        const partnerBankInfo = [
          ...objRow.map((itm, i) => {
            return {
              accountId: accountId,
              businessUnitId: businessunitid,
              businessPartnerId: +id,
              bankId: itm.bankId,
              bankBranchId: itm.bankBranchId,
              routingNo: itm.routingNo,
              bankAccountNo: itm.bankAccountNo,
              bankAccountName: itm.bankAccountName,
              isDefaultAccount: itm.isDefaultAccount,
              actionBy: actionBy,
            };
          }),
        ];
        try {
          setDisabled(true);
          const res = await Axios.post(
            "/partner/BusinessPartnerBankInfo/CreateBusinessPartnerBankInfo",
            partnerBankInfo
          );
          if (res.status === 200) {
            setRowDto([]);
          }
          cb(initProduct);
          setDisabled(false);
          toast.success("Submitted Successfully", {
            toastId: shortid(),
          });
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
          setDisabled(false);
        }
      }
    } else {
      toast.error("Submit Unsuccesful!", { toastId: shortid() });
    }
  };

  // const setter = (payload) => {
  //   if (
  //     isUniq("bankAccountNo", payload.bankAccountNo, rowDto) ||
  //     isUniq("bankName", payload.bankName, rowDto)
  //   ) {
  //     const { accountId, userId: actionBy } = profileData;
  //     const { value: businessunitid } = selectedBusinessUnit;

  //     const count = rowDto.filter((itm, idx) => itm.isDefaultAccount === true)
  //       .length; // true exist 1

  //     if (count > 0) {
  //       if (payload.isDefaultAccount === true) {
  //         setRowDto([
  //           ...rowDto.filter((itm, idx) => itm.isDefaultAccount !== true),
  //           {
  //             configId: 0,
  //             accountId: accountId,
  //             businessUnitId: businessunitid,
  //             businessPartnerId: +id,
  //             actionBy: actionBy,
  //             isActive: true,
  //             ...payload,
  //           },
  //         ]);
  //       } else {
  //         setRowDto([
  //           ...rowDto,
  //           {
  //             configId: 0,
  //             accountId: accountId,
  //             businessUnitId: businessunitid,
  //             businessPartnerId: +id,
  //             actionBy: actionBy,
  //             isActive: true,
  //             ...payload,
  //           },
  //         ]);
  //       }
  //     } else {
  //       setRowDto([
  //         ...rowDto,
  //         {
  //           configId: 0,
  //           accountId: accountId,
  //           businessUnitId: businessunitid,
  //           businessPartnerId: +id,
  //           actionBy: actionBy,
  //           isActive: true,
  //           ...payload,
  //         },
  //       ]);
  //     }
  //   }
  // };

  const setter = (payload) => {
    const duplicate = rowDto.some(
      (itm) =>
        itm?.bankAccountNo === payload?.bankAccountNo &&
        itm?.bankName === payload?.bankName &&
        itm?.bankBranchName === payload?.bankBranchName
    );
    const { accountId, userId: actionBy } = profileData;
    const { value: businessunitid } = selectedBusinessUnit;
    if (duplicate) {
      toast.warn("Not allowed to duplicate item!");
    } else {
      if (rowDto.length > 0) {
        setRowDto([
          {
            configId: 0,
            accountId: accountId,
            businessUnitId: businessunitid,
            businessPartnerId: +id,
            actionBy: actionBy,
            isActive: true,
            ...payload,
            isDefaultAccount: false,
          },
          ...rowDto,
        ]);
      } else {
        setRowDto([
          {
            configId: 0,
            accountId: accountId,
            businessUnitId: businessunitid,
            businessPartnerId: +id,
            actionBy: actionBy,
            isActive: true,
            ...payload,
          },
          ...rowDto,
        ]);
      }
    }
  };
  const remover = (payload, configId) => {
    if (configId === 0) {
      const filterArr = rowDto.filter((itm, idx) => idx !== payload);
      setRowDto(filterArr);
    } else {
      return;
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

  // one item select
  const itemSlectedHandler = (value, index) => {
    const modifiedRowDto = rowDto?.map((itm) => ({
      ...itm,
      isDefaultAccount: false,
    }));
    const copyRowDto = [...modifiedRowDto];
    copyRowDto[index].isDefaultAccount = !copyRowDto[index].isDefaultAccount;
    setRowDto(copyRowDto);
  };
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Partner Bank Info">
        <CardHeaderToolbar>
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
          {isDisabled && <Loading />}
          <Form
            product={partnerBankInfo || initProduct}
            btnRef={btnRef}
            saveBtnClicker={saveBtnClicker}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            accountId={profileData.accountId}
            actionBy={profileData.userId}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            setter={setter}
            remover={remover}
            rowDto={rowDto}
            itemSlectedHandler={itemSlectedHandler}
          />
        </div>
      </CardBody>
    </Card>
  );
}
