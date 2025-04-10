import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storageSession from 'redux-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist';
import { apiSlice } from "@/api/rtkQuery/apiSlice";

import authReducer from "@/redux/reducer/auth.reducer"
import eventsReducer from "@/redux/reducer/events.reducer"


const persistConfig = {
    key: 'root',
    storage: storageSession,  // muốn lưu vào local storage thì thay storageSession thành storage
    whitelist: ['auth', 'events'] // muốn ko mất dữ liệu sau khi reload cái nào thì bỏ vào whitelist, tên của reducer chính là tên của key trong rootReducer
};

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    events: eventsReducer,
}); 

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export const persistor = persistStore(store)