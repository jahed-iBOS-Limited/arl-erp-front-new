import {createSlice} from "@reduxjs/toolkit";

const initialUserState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 10,
  entities: null,
  userForEdit: undefined,  
  lastError: null,
  unitList: [],
  employeelist:[],
  orgtypelist:[],
  orgnamelist:[]
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const roleextantionsSlice = createSlice({
  name: "roleextantion",
  initialState: initialUserState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getUserById
    userFetched: (state, action) => {
      state.actionsLoading = false;
      state.entities = action.payload.entities;
      state.error = null;
    },
    // Unit List

    UnitListFetched: (state, action) => {
      const { unitList } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.unitList = unitList;
       
    },
    employeeFetched: (state, action) => {
        const { employeeList } = action.payload; 
        state.error = null;
        state.employeelist = employeeList;
         
      },

      orgtypeFetched: (state, action) => {
        const { orgtypelist } = action.payload;
        state.listLoading = false;
        state.error = null;
        state.orgtypelist = orgtypelist;
         
      },

      orgnameFetched: (state, action) => {
        const { orgnamelist } = action.payload;
        state.listLoading = false;
        state.error = null;
        state.orgnamelist = orgnamelist;
         
      },
      

    // createuser
    userCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.user);
    },
    // updateuser
    userUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity.id === action.payload.user.id) {
          return action.payload.user;
        }
        return entity;
      });
    },
    // deleteuser
    userDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el.id !== action.payload.id);
    },
    // deleteusers
    usersDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el.id)
      );
    },
    // usersUpdateState
    usersStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    }
  }
});
