import Axios from "axios";

export const loadUserList = (accId,buId,v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/domain/CreateUser/GetUserListSearchDDL?AccountId=${accId}&BusinessUnitId=${buId}&searchTerm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        label: item?.label + ` [${item?.value}]`,
      }));
      return updateList;
    });
  };

export const generateId =(state)=>{
  const updatedState = [...state]
  const id = updatedState?.reduce((prev,curr)=>prev+ curr?.id,1)
  return id
}