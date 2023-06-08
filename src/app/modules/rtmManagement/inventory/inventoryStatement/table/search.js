/* eslint-disable no-restricted-imports */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function SearchFormInventoryStatement({
  inventoryStatementAllData,
  setInventoryStatement,
}) {
  const classes = useStyles();

  const searchHandler = (data, lists) => {
    const filteredCountries = lists.filter((itm) => {
      return itm.itemName.toLowerCase().indexOf(data.toLowerCase()) !== -1;
    });
    setInventoryStatement(filteredCountries);
  };

  return (
    <div className="inventoryStatement_reports_SearchForm">
      <form className={classes.root} noValidate autoComplete="off">
        <div style={{ position: "relative" }}>
          <TextField
            id="standard-basic"
            label="Item Name Search"
            onChange={(e) => {
              searchHandler(e.target.value, inventoryStatementAllData);
            }}
            color="secondary"
          />
          <i
            class="fas fa-search"
            style={{
              position: "absolute",
              right: "45px",
              top: "25px",
              fontSize: "13px",
              color: "#6d8aa7",
            }}
          ></i>
        </div>
      </form>
    </div>
  );
}
