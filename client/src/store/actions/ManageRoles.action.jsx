import { get, post } from "../../utils/ApiMethods";
import { handleError, handleSuccess } from "../../utils/Methods";
import MANAGE_ROLES from "../constant/ManageRoles.constant";

export const getRoles = () => async (dispatch) => {
  const dispatchType = MANAGE_ROLES.GET_ROLES;
  dispatch({ type: dispatchType, loading: true, data: [] });
  try {
    const { data } = await get("/roles/getAll");
    if (!data?.error) {
      dispatch({ type: dispatchType, loading: false, data: data?.data });
    }
  } catch (error) {
    dispatch({ type: dispatchType, loading: false, data: [] });
    // handleError(error.response?.data?.message || "Please try again.")
  }
};

export const addEditRole = (payload, CB) => async (dispatch) => {
  const dispatchType = MANAGE_ROLES.ADD_EDIT_ROLE;
  dispatch({ type: dispatchType, loading: true });
  try {
    const { data } = await post("/roles/save", payload);
    if (!data?.error) {
      dispatch({ type: dispatchType, loading: false });
      handleSuccess(data.message || "Action successfully");
      CB && CB()
    }
  } catch (error) {
    dispatch({ type: dispatchType, loading: false });
    handleError(error.response?.data?.message || "Something went's wrong")
  }
};