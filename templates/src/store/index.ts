import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user';
import test from './slices/test';

// 配置全局store
const store = configureStore({
  reducer: {
    user,
    test,
  },
  // 配置中间件：默认包含thunk，可添加自定义中间件（如持久化、日志）
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭序列化检查（避免非序列化数据如Date/Map报错，企业级项目常用）
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
