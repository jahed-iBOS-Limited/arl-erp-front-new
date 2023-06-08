import Axios from "axios";
import { _todayDate } from "./../../../_helper/_todayDate";
import { toast } from "react-toastify";

// Plant DDL Call
export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetApproveExpensesApi = async (accId, buId, plantId, setter, setDisabled) => {
  setDisabled && setDisabled(true)
  try {
    const res = await Axios.get(
      `/fino/PaymentRequest/GetApproveExpenses?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false)
      res?.data?.length === 0 && toast.warning("Data not found");
      setter(res?.data?.map((itm) => ({ ...itm, itemCheck: false })));
    }
  } catch (error) {
    setDisabled && setDisabled(false)
    setter([]);
  }
};
export const GetApproveAdvancesApi = async (accId, buId, plantId, setter, setDisabled) => {
  try {
    setDisabled && setDisabled(true)
    const res = await Axios.get(
      `/fino/PaymentRequest/GetApproveAdvances?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false)
      res?.data?.length === 0 && toast.warning("Data not found");
      setter(res?.data?.map((itm) => ({ ...itm, itemCheck: false })));
    }
  } catch (error) {
    setDisabled && setDisabled(false)
    setter([])
  }
};
export const paymentRequestSearchLandingApi = async (
  accId,
  buId,
  plantId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true)
    const res = await Axios.get(
      `/procurement/PaymentRequest/PaymentRequestSearchLanding?BusinessUnitId=${buId}&PlantId=${plantId}&AccountId=${accId}&viewOrder=desc&PageNo=1&PageSize=100000`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false)
      res?.data?.data?.length === 0 && toast.warning("Data not found");
      setter(res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })));
    }
  } catch (error) {
    setDisabled && setDisabled(false)
    setter([])
  }
};

//single data api
export const getExpenseById = async (expId, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/fino/Expense/GetExpenseById?ExpenseId=${expId}`
    );
    if (res.status === 200 && res?.data[0]) {
      const data = res?.data[0];

      const newData = {
        objHeader: {
          ...data?.objHeader,
          expenseFrom: data?.objHeader?.fromDate,
          expenseTo: data?.objHeader?.toDate,
          reference: data?.objHeader?.vehicleId,
          comments1: data?.objHeader?.comments,
          expenseDate: _todayDate(),
          expenseCategory: {
            value: data?.objHeader?.advExpCategoryId,
            label: data?.objHeader?.advExpCategoryName,
          },
          projectName: {
            value: data?.objHeader?.projectId,
            label: data?.objHeader?.projectName,
          },
          costCenter: {
            value: data?.objHeader?.costCenterId,
            label: data?.objHeader?.costCenterName,
          },
          paymentType: {
            value: data?.objHeader?.instrumentId,
            label: data?.objHeader?.instrumentName,
          },
          disbursmentCenter: {
            value: data?.objHeader?.disbursementCenterId,
            label: data?.objHeader?.disbursementCenterName,
          },
        },
        objRow: [...data?.objRow],
      };

      const newRowDto = newData?.objRow.map((item) => ({
        expenseRowId: item.expenseRowId,
        expenseDate: item.expenseDate,
        transaction: {
          value: item.businessTransactionId,
          label: item.businessTransactionName,
        },
        quantity: item.quantity,
        totalAmount: item.amount,
        location: item.expenseLocation,
        comments2: item.comments,
        attachmentLink: item.attachmentLink,
        driverName: item?.driverName,
        driverId: item?.driverId,
      }));
      setRowDto(newRowDto);
      setter(newData);
    }
  } catch (error) {}
};

export const CreatePaymentRequest_api = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/PaymentRequest/CreatePaymentRequest`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "CreatePaymentRequest",
      });
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "CreatePaymentRequest",
    });
  }
};
