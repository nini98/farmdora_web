
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_OUT_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    SIGN_UP_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
  } from '../reducers/user';

// put은 dispatch와 같다고 보면 된다.
// call은 동기함수, fork는 비동기 함수 호출이다. 
// 따라서 fork 호출은 사실상 axios.post('/api/login')을 호출하는 것과 동일하다고 볼 수 있다.
// call은 axios.post('/api/login').then() 을 호출하는 것과 동일하다고 볼 수 있다.

// while(true){yield take(~~~)}는 동기적으로 동작하지만 yield takeEvery(~~~)는 비동기로 동작한다는 차이가 있다.
// takeLatest는 이벤트가 중복으로 들어올 때 앞의 이벤트가 종료되지 않았다면 앞의 이벤트를 없애고 마지막 이벤트만 실행하는 기능이다.
// throttle('LOG_IN_REQUEST', logIn, 2000) 은 2초 동안 들어온 이벤트는 하나의 이벤트로 인식하는 기능이다.
// throttle은 특수한 경우(화면 스크롤 같은 경우)에 쓰는 편이고 일반적으로 takeLatest를 많이 사용하는 편이다.

// throttling : 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것 
// debouncing : 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출되도록 하는 것


function logInAPI(data) {
    return axios.post('/user/login', data);
}
  
function* logIn(action) {
    try {
      const result = yield call(logInAPI, action.data);
      yield put({
        type: LOG_IN_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: LOG_IN_FAILURE,
        error: err.response.data,
      });
    }
}
  
function logOutAPI() {
    return axios.post('/user/logout');
}
  
function* logOut() {
    try {
      yield call(logOutAPI);
      yield put({
        type: LOG_OUT_SUCCESS,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: LOG_OUT_FAILURE,
        error: err.response.data,
      });
    }
}
  
function signUpAPI(data) {
    return axios.post('/user/signup', data);
}
  
function* signUp(action) {
    try {
      const result = yield call(signUpAPI, action.data);
      console.log(result);
      yield put({
        type: SIGN_UP_SUCCESS,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: SIGN_UP_FAILURE,
        error: err.response.data,
      });
    }
}

// LOG_IN_REQUEST의 event listener 역할을 함
// LOG_IN_REQUEST가 들어오면 saga와 reducer가 모두 작동한다.
function* watchLogIn() {
    yield takeLatest(LOG_IN_REQUEST, logIn);
}
  
function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}
  
function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([
      fork(watchLogIn),
      fork(watchLogOut),
      fork(watchSignUp),
    ]);
}