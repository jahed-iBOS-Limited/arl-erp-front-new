import axios from "axios";

export const getBankAccDDLAction = async (accId,buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// https://localhost:5001/fino/BankBranch/GetReconcileReport?bankAccountId=9&fromDate=2021-8-9&toDate=2021-8-9&unitId=8

export const getBankReconciliationAction = async (
  buId,
  date,
  bankAccId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/BankBranch/GetReconcileReport?unitId=${buId}&BankAccountId=${bankAccId}&fromDate=2021-07-01&toDate=${date}`
    );
    setLoading(false);

    const data = res?.data;

    let typeOne = [];
    let typeTwo = [];
    let typeThree = [];
    let typeFour = [];
    let typeBalanceOfBankBook = [];
    let typeOneTotal=0;
    let typeTwoTotal=0;
    let typeThreeTotal=0;
    let typeFourTotal=0;
    let typeBalanceOfBankBookTotal=0;
    let bankStatementClosing=0;

    
    data.forEach((item) => {
      switch(item?.strHead){
        case "1.Add: Cheque issued but not presented in bank":
          typeOne.push(item)
          typeOneTotal+=Number(item.monAmount)
          bankStatementClosing=Number(item.monBankStatementClosing)
          break;
        case "2.Less: Amount debited in bank book but not credited in bank statement":
          typeTwo.push(item)
          typeTwoTotal+=Number(item.monAmount)
          bankStatementClosing=Number(item.monBankStatementClosing)
          break;
        case "3.Add: Amount credited in bank statement but not yet debited in bank book":
          typeThree.push(item)
          typeThreeTotal+=Number(item.monAmount)
          bankStatementClosing=Number(item.monBankStatementClosing)
          break;
        case "4.Less: Amount debited in bank statement but not yet credited in bank book":
          typeFour.push(item);
          typeFourTotal+=Number(item.monAmount)
          bankStatementClosing=Number(item.monBankStatementClosing)
          break
        case "Balance Of Bank Book":
          typeBalanceOfBankBook.push(item);
          typeBalanceOfBankBookTotal+=Number(item.monAmount)
          bankStatementClosing=Number(item.monBankStatementClosing)
          break
        default :
      }
      // if (
      //   item?.strHead ===
      //   "1.Add: Cheque issued but not presented in bank"
      // ) {
      //   typeOne.push(item);
      // }else if (
      //   item?.strHead ===
      //   "3.Add: Amount credited in bank statement but not yet debited in bank book"
      // ) {
      //   typeTwo.push(item);
      // }
      // if (
      //   item?.strHead ===
      //   "4.Less: Amount debited in bank statement but not yet credited in bank book"
      // ) {
      //   typeThree.push(item);
      // }
      // if (item?.strHead === "Balance Of Bank Book") {
      //   typeFour.push(item);
      // }
      // if (
      //   item?.strTransection.includes("Aggregated Bank Statement Closing")
      // ) {
      //   typeBalanceOfBankBook.push(item);
      // }
      // if (
      //   item?.strTransection.includes("Actual Bank Statement Closing")
      // ) {
      //   typeSix.push(item);
      // }
    });

    setter({
      typeOne,
      typeTwo,
      typeThree,
      typeFour,
      typeBalanceOfBankBook,
      // typeBalanceOfBankBook,
      // typeSix,
      typeOneTotal,
      typeTwoTotal,
      typeThreeTotal,
      typeFourTotal,
      typeBalanceOfBankBookTotal,
      allData : res?.data,
      bankStatementClosing
    });
  } catch (error) {
    setLoading(false);
    setter({});
  }
};
