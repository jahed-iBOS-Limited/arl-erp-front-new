import React from "react";
import { useHistory } from "react-router-dom";

function SearchList({ searchMenuList }) {
  const history = useHistory();
  return (
    <>
      <ul className="searchMenuList">
        {searchMenuList?.length > 0 &&
          searchMenuList?.map((itm) => (
            <li
              onClick={() => {
                history.push(itm?.to);
              }}
            >
              {itm?.label}
            </li>
          ))}
      </ul>
    </>
  );
}

export default SearchList;
