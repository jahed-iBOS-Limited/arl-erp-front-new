import {createSlice} from "@reduxjs/toolkit";

const initialUserState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 10,
  entities: null,
  userForEdit: [],  
  lastError: null,
  unitList: [],
  countryList:[],
  userTypeList:[],
  referenceList:[],
  msg:'',
  error:'',
  statusCode:''
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const usersSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    catchError: (state, action) => {
     // state.error = `${action.type}: ${action.payload.error}`;
    //  state.msg = `${action.type}: ${action.payload.usermsg}`; 
      state.msg=action.payload.msg;
     // console.log(action.payload.msg)
      //console.log(state.msg);
    //   if (action.payload.callType === callTypes.list) {
    //     state.listLoading = false;
    //   } else {
    //     state.actionsLoading = false;
    //   }
    },
    startCall: (state, action) => {
      state.error = null; 
      state.msg = '';
      state.statusCode = '';
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
      state.totalCount = action.payload.total;
      state.error = null;
    },
    resetControllerFetched: (state, action) => {
      state.actionsLoading = false;
      state.statusCode = '';
      state.msg = '';
      state.userForEdit = [];
    },

     // getUserInfoByUserId
     userInfoByIdFetched: (state, action) => {
        state.actionsLoading = false;
        state.userForEdit = action.payload.userforedit; 
        state.error = null;
      },
  

     // getUserByIdPaginations
     userPaginationFetched: (state, action) => {
        state.actionsLoading = false;
        state.entities = action.payload.entities;
        state.totalCount = action.payload.total;
        state.error = null;
      },
    // Unit List

    UnitListFetched: (state, action) => {
      const { unitList } = action.payload;
      state.actionsLoading = false;
      state.error = null;
      state.unitList = unitList;
       
    },

    CountryFetched: (state, action) => {
        const { countrylist } = action.payload;
        state.actionsLoading = false;
        state.error = null;
        state.countryList = countrylist;
         
      },

      UserTypeFetched: (state, action) => {
        const { usertype } = action.payload;
        state.actionsLoading = false;
        state.error = null;
        state.userTypeList = usertype;
         
      },

      UserReferenceFetched: (state, action) => {
        state.actionsLoading = false;
        const { referencelist } = action.payload; 
        state.error = null;
        state.referenceList = referencelist;
         
      },

      

    // createuser
    UserCreated: (state, action) => {
        const { msg,statuscode } = action.payload;
      state.actionsLoading = false;
      state.error = null;
      state.msg= msg;
      state.statusCode= statuscode;
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
