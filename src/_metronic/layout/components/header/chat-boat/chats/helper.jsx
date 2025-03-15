import Axios from 'axios';
import { toast } from 'react-toastify';

export const getAllChatUsers = async (setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `${import.meta.env.REACT_APP_CHAT_BACKEND_URL}/chatapi/users`,
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.message);
  }
};

export const getSingleUserMessageList = async (
  fromId,
  toId,
  setter,
  setMsgLoading,
) => {
  setMsgLoading(true);
  try {
    const res = await Axios.get(
      `${
        import.meta.env.REACT_APP_CHAT_BACKEND_URL
      }/chatapi/allmessages/${fromId}/${toId}`,
    );
    setter(res?.data);
    setMsgLoading(false);
  } catch (error) {
    setMsgLoading(false);
    setter([]);
    toast.error(error?.message);
  }
};

export const sendMessage = async (payload, chatList, setChatList) => {
  try {
    const res = await Axios.post(
      `${import.meta.env.REACT_APP_CHAT_BACKEND_URL}/chatapi/message`,
      payload,
    );
    if (res.status === 200) {
      let msg = {
        from: payload?.fromId,
        to: payload?.toId,
        body: payload?.text,
        conversation: res?.conversationId,
      };
      setChatList([...chatList, msg]);
    }
  } catch (error) {
    toast.error('Failed to send message');
  }
};

export const getChatResponse = async (payload, cb) => {
  const apiUrl =
    (import.meta.env.MODE === 'development') === 'development'
      ? `https://devtexttosql.ibos.io/ask`
      : `https://texttosql.ibos.io/ask`;

  try {
    const res = await Axios.post(apiUrl, payload);
    cb({
      isResponse: true,
      resData:
        res?.data?.response || res?.data?.result || 'Sorry, data not found',
    });
  } catch (error) {
    cb({
      isResponse: false,
      resData: 'Sorry, data not found',
    });
    toast.info('Sorry, data not found');
  }
};
