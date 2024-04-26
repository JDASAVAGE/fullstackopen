import { configureStore } from '@reduxjs/toolkit'
import notificationreducer from './reducers/notificationreducer'
import blogreducer from './reducers/blogreducer'
import userreducer from './reducers/userreducer'
const store = configureStore({
  reducer: {
    notification:notificationreducer,
    blogs:blogreducer,
    user:userreducer
  }
})
export default store

