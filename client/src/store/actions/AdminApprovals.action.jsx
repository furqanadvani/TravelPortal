import { get, post } from "../../utils/ApiMethods";
import { handleError, handleSuccess } from "../../utils/Methods";
import IT_APPROVALS from "../constant/AdminApprovals.constant"


export const getAdminApprovals = () => async (dispatch) => {
  const dispatchType = IT_APPROVALS.GET_IT_APPROVALS;
  dispatch({ type: dispatchType, loading: true, data: [] });
  try {
    const { data } = await get("/adminApprovals/getAll", );
    if (!data?.error) {
      dispatch({ type: dispatchType, loading: false, data: data?.data });
      handleSuccess(data.message || "IT Approvals fetch successfully");
    }
  } catch (error) {
    dispatch({ type: dispatchType, loading: false, data: [] });
    handleError(error.response?.data?.message || "Failed to get IT approvals. Please try again.")
  }
};

export const adminApprovalAction = (payload, CB) => async (dispatch) => {
  const dispatchType = IT_APPROVALS.ADMIN_APPROVAL_ACTION;
  dispatch({ type: dispatchType, loading: true });
  try {
    const { data } = await post("/adminApprovals/action", payload);
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