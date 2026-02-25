import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// 用户信息类型
export interface UserInfo {
  id: string;
  nickname: string;
  phone: string;
  avatar?: string;
  role: 'admin' | 'user';
}

// 用户模块状态类型
export interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { token: string; userInfo: UserInfo }, // 接口返回值类型
  { phone: string; password: string }, // 组件传入的参数类型
  { rejectValue: string } // 错误信息类型
>(
  'user/login', // 唯一标识（action type前缀）
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || '登录失败');
      // 登录成功：存储token到本地
      localStorage.setItem('token', data.token);
      return data; // 返回结果会传入extraReducers的fulfilled状态
    } catch (err) {
      // 登录失败：返回错误信息
      return rejectWithValue((err as Error).message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 退出登录
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('token'); // 清除本地token
    },
    // 清空错误信息
    clearError: (state) => {
      state.error = null;
    },
    // 更新用户信息（如个人中心编辑）
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
  },
  // 异步reducer：处理createAsyncThunk的三种状态（pending/fulfilled/rejected）
  extraReducers: (builder) => {
    builder
      // 登录中：pending状态
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // 清空之前的错误
      })
      // 登录成功：fulfilled状态
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.userInfo;
      })
      // 登录失败：rejected状态
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '登录失败，请稍后重试';
      });
  },
});

export const { logout, clearError, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
