import{createSlice} from "@reduxjs/toolkit"
var initialState=""
const notificationSlice=createSlice({
    name:"notification",
    initialState,
    reducers:{
        notificationAddition(state,action){
            return action.payload
        },
        notificationRemoval(state,action){
            var newstate=""
            return newstate
        }
    }

})
export const notficationHandler=(content,time)=>{
    return dispatch=>{
        dispatch(notificationAddition(content))
        setTimeout(() => {
            dispatch(notificationRemoval("Test"))
          }, time*1000)
    }
}
export const{notificationAddition,notificationRemoval}=notificationSlice.actions
export default notificationSlice.reducer