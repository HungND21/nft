import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};
export const existMetamask = createAsyncThunk(
  'metamask/existMetamask',
  async (userId, thunkAPI) => {
    return isMetaMaskInstalled();
  }
);

const initialState = {
  isMetaMaskInstalled: false,
  isOpenModalWallet: false
};
const customizationReducer = createSlice({
  name: 'metamask',
  initialState,
  reducers: {
    openModalWalletConnect: (state, action) => {
      state.isOpenModalWallet = true;
    },
    closeModalWalletConnect: (state, action) => {
      state.isOpenModalWallet = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(existMetamask.fulfilled, (state, action) => {
      state.isMetaMaskInstalled = action.payload;
    });
  }
});
const { reducer, actions } = customizationReducer;
export const { openModalWalletConnect, closeModalWalletConnect } = actions;
export default reducer;
