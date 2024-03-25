import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
        return `An anecdote ${action.payload.anecdote} has been added.`
    case "VOTE":
        return `You have voted for ${action.payload.anecdote}`
    case "BLANK":
        return ""
    case "ERROR":
            return "too short anecdote, must have length 5 or more"
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, "")

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext