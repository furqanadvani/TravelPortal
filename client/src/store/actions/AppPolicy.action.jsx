import { get, post, put, patch } from "../../utils/ApiMethods";
import { handleError, handleSuccess } from "../../utils/Methods";
import APP_POLICY from "../constant/AppPolicy.constant";

// GET ALL
export const getAppPolicies = () => async (dispatch) => {
    const dispatchType = APP_POLICY.GET_APP_POLICIES;
    dispatch({ type: dispatchType, loading: true, data: [], });
    try {
        const { data } = await get("/app-policies/list");
        if (!data?.error) {
            dispatch({ type: dispatchType, loading: false, data: data?.data || [], });
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, data: [], });
        handleError(error?.response?.data?.message || "Failed to fetch app policies.");
    }
};

// GET BY ID
export const getAppPolicyById = (id) => async (dispatch) => {
    const dispatchType = APP_POLICY.GET_APP_POLICY_BY_ID;
    dispatch({ type: dispatchType, loading: true, data: null, });
    try {
        const { data } = await get(`/app-policies/${id}`);
        if (!data?.error) {
            dispatch({ type: dispatchType, loading: false, data: data?.data, });
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, data: null, });
        handleError(error?.response?.data?.message || "Failed to fetch app policy.");
    }
};

// CREATE
export const createAppPolicy = (payload, CB) => async (dispatch) => {
    const dispatchType = APP_POLICY.CREATE_APP_POLICY;

    dispatch({ type: dispatchType, loading: true, });

    try {
        const { data } = await post("/app-policies/create", payload);
        if (!data?.error) {
            dispatch({ type: dispatchType, loading: false, });
            handleSuccess(data?.message || "App Policy created successfully.");
            CB && CB();
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, });
        handleError(error?.response?.data?.message || "Failed to create app policy.");
    }
};

// UPDATE
export const updateAppPolicy = (id, payload, CB) => async (dispatch) => {
    const dispatchType = APP_POLICY.UPDATE_APP_POLICY;
    dispatch({ type: dispatchType, loading: true, });
    try {
        const { data } = await put(`/app-policies/update/${id}`, payload);
        if (!data?.error) {
            dispatch({ type: dispatchType, loading: false, });
            handleSuccess(data?.message || "App Policy updated successfully.");
            CB && CB();
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, });
        handleError(error?.response?.data?.message || "Failed to update app policy.");
    }
};

// DEACTIVATE
export const deactivateAppPolicy = (id, CB) => async (dispatch) => {
    const dispatchType = APP_POLICY.DEACTIVATE_APP_POLICY;
    dispatch({ type: dispatchType, loading: true, });
    try {
        const { data } = await patch(`/app-policies/deactivate/${id}`);
        if (!data?.error) {
            dispatch({ type: dispatchType, loading: false, });
            handleSuccess(data?.message || "Policy deactivated successfully.");
            CB && CB();
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, });
        handleError(error?.response?.data?.message || "Failed to deactivate policy.");
    }
};