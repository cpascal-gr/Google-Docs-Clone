import axios from "axios";

const state = {
  response: [],
};
const getters = {
  getResponse: (state) => state.response,
};
const actions = {
  async addDocu({ commit }, name, content, editableProperty) {
    const response = await axios.post("http://localhost:8000/api/v1/docu/", {
      name: name,
      content: content,
      editableProperty: editableProperty,
    });
    console.log(response.data.document);
    commit("addDocument", response.data);
  },
};
const mutations = {
  addDocument: (state, responseData) => (state.response = responseData),
};
export default {
  state,
  getters,
  actions,
  mutations,
};
