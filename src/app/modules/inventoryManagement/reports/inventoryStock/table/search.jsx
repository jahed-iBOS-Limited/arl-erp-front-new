import React from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
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
      return (
        itm.itemName.toLowerCase().indexOf(data.toLowerCase()) !== -1 ||
        itm.itemCode.toLowerCase().indexOf(data.toLowerCase()) !== -1
      );
    });
    setInventoryStatement(filteredCountries);
  };

  return (
    <div className="inventoryStatement_reports_SearchForm">
      <form className={classes.root} noValidate autoComplete="off">
        <div style={{ position: 'relative' }}>
          <TextField
            id="standard-basic"
            label="Code & Item Name Search"
            onChange={(e) => {
              searchHandler(e.target.value, inventoryStatementAllData);
            }}
            color="secondary"
            InputProps={{
              endAdornment: (
                <i
                  className="fas fa-search"
                  style={{
                    fontSize: '13px',
                    color: '#6d8aa7',
                  }}
                ></i>
              ),
            }}
          />
        </div>
      </form>
    </div>
  );
}
