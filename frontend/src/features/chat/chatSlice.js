import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchConversations = createAsyncThunk('chat/fetchConversations', async () => {
  const response = await axios.get('http://localhost:3000/api/conversations');
  console.log('API Response:', response.data);
  return response.data.map(conv => ({
    _id: conv._id,
    user_name: conv.user_name,
    messages: conv.messages || [],
  }));
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    status: 'idle',
  },
  reducers: {
    addMessage: (state, action) => {
      const msg = action.payload;
      const conversation = state.conversations.find((c) => c._id === msg.wa_id);
      if (conversation) {
        conversation.messages.push({
          wa_id: msg.wa_id,
          msg_id: msg.msg_id,
          from: msg.from,
          text: msg.text,
          timestamp: msg.timestamp,
          user_name: msg.user_name,
        });
      } else {
        state.conversations.push({
          _id: msg.wa_id,
          user_name: msg.user_name,
          messages: [{
            wa_id: msg.wa_id,
            msg_id: msg.msg_id,
            from: msg.from,
            text: msg.text,
            timestamp: msg.timestamp,
            user_name: msg.user_name,
          }],
        });
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