export function getUnitDropdown(propsData) {
    let data = [];
    propsData &&
      propsData.forEach((item) => {
        let itemObject = {
          value: item.businessUnitId,
          label: item.businessUnitName,
        };
        data.push(itemObject);
      });
    return data;
  }

export function getCountryDropdown(propsData) {
    let data = [];
    propsData &&
      propsData.forEach((item) => {
        let itemObject = {
          value: item.countryId,
          label: item.countryName,
        };
        data.push(itemObject);
      });
    return data;
  }

  export function getUserTypeDropdown(propsData) {
    let data = [];
    propsData &&
      propsData.forEach((item) => {
        let itemObject = {
          value: item.userTypeId,
          label: item.usertTypeName,
        };
        data.push(itemObject);
      });
    return data;
  }

  export function getReferenceDropdown(propsData) {
    let data = [];
    propsData &&
      propsData.forEach((item) => {
        let itemObject = {
          ...item,
          value: item?.id,
          label: item?.name,
        };
        data.push(itemObject);
      });
    return data;
  }