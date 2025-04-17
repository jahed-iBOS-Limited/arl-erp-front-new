import React from 'react';

type AllRowDataCheckHandlerType = {
  arr: any[];
  setter: React.Dispatch<React.SetStateAction<any[]>>;
  value: boolean;
};

const _allRowDataCheckHandler = ({
  arr,
  setter,
  value,
}: AllRowDataCheckHandlerType): void => {
  const modifyArr = arr?.map((item) => ({
    ...item,
    isSelected: value,
  }));
  setter(modifyArr);
};

export default _allRowDataCheckHandler;
