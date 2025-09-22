import axios from "axios";

const PORT = process.env.PORT || 8000;

const authAPI = {
  login: async (data) => {
    try {
      const res = await axios.post(
        `http://localhost:${PORT}/api/auth/login`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  register: async (data) => {
    try {
      const res = await axios.post(
        `http://localhost:${PORT}/api/auth/register`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default authAPI;
