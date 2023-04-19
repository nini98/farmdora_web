import { enableES5, produce } from 'immer';

export default (...args) => {
  enableES5(); // 앱이 오래된 자바스크립트 환경(ex. 인터넷 익스플로어 or 리액트 네이티브)에서 동작해야 할 경우 필요한 옵션
  return produce(...args);
};