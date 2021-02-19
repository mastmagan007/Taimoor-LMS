import usersService from '../services/users'
import { SET_USER, CLEAR_USER } from '../actions/auth'

// manpulates the data coming from backend
const adapterFunc = (user) => {
  return { ...user.user, token: user.token }
}

let user = window.localStorage.getItem('eduhub-user')
const intialState = user
  ? { user: adapterFunc(JSON.parse(user)), isAuth: true }
  : { user: null, isAuth: false }

const authReducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { user: adapterFunc(action.user), isAuth: true }
    case CLEAR_USER:
      return { user: null, isAuth: false }
    default:
      return state
  }
}

/* actions for authentication bellow */

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const response = await usersService.login(credentials)
      dispatch({ type: SET_USER, user: response })
      window.localStorage.setItem('eduhub-user', JSON.stringify(response))
    } catch (error) {
      console.log(error)
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    try {
      await usersService.logout()
      dispatch({ type: CLEAR_USER })
      window.localStorage.removeItem('eduhub-user')
    } catch (error) {
      console.log(error)
    }
  }
}

export default authReducer