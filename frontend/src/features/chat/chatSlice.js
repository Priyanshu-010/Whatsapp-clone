import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchConversations = createAsyncThunk('chat/fetchConversations', async () => {
  const response = await axios.get('http://localhost:3000/api/conversations');
  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    status: 'idle',
  },
  reducers: {
    addMessage: (state, action) => {
      const conversation = state.conversations.find((c) => c._id === action.payload.wa_id);
      if (conversation) {
        conversation.messages.push(action.payload);
      } else {
        state.conversations.push({ _id: action.payload.wa_id, messages: [action.payload] });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addMessage } = chatSlice.actions;
export { fetchConversations };
export default chatSlice.reducer;