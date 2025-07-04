import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import surahReducer from './surahSlice';
import themeReducer from './themeSlice';

// Combine your reducers first
const rootReducer = combineReducers({
  surah: surahReducer,
  theme: themeReducer,
});

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

// Persist configuration
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['surah', 'theme'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
const persistor = persistStore(store);

// Export types and store
export { store, persistor };
export type AppDispatch = typeof store.dispatch;
