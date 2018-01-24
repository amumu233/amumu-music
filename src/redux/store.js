import { createStore } from "redux";
import reducer from "./reducers";

const store = createStore(reducer);
console.log(store.getState());

export default store;