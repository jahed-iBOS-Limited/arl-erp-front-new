import React from 'react';

type SingleRowDataCheckHandlerType = {
  arr: any[];
  setter: React.Dispatch<React.SetStateAction<any[]>>;
  index: number;
  value: boolean;
};

const _singleRowDataCheckHandler = ({
  arr,
  setter,
  index,
  value,
}: SingleRowDataCheckHandlerType): void => {
  const copyArr = [...arr];
  copyArr[index]['isSelected'] = value;
  setter(copyArr);
};
export default _singleRowDataCheckHandler;
