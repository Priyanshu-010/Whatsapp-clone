import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const response = await axios.get('http://localhost:3000/api/conversations');
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (wa_id) => {
    const response = await axios.get(`http://localhost:3000/api/messages/${wa_id}`);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    selectedChat: null,
    messages: [],
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { setSelectedChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;