import { handleError, handleSuccess } from '../../utils/Methods';
import { post, put, get } from '../../utils/ApiMethods';
import TASK_CONSTANT from '../constant/Task.constant';


export const createTask = (payload, CB) => async (dispatch) => {
    dispatch({ type: TASK_CONSTANT.CREATE_TASK, loading: true });
    try {
        const { data } = await post('task/create', payload);
        if (!data.error) {
            dispatch({ type: TASK_CONSTANT.CREATE_TASK, loading: false });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        dispatch({ type: TASK_CONSTANT.CREATE_TASK, loading: false });
        handleError(error.message);
    }
};

export const getAllTask = (payload, CB) => async (dispatch) => {
    dispatch({ type: TASK_CONSTANT.GET_USER_TASK, loading: true, data: [], metaData: {} });
    try {
        const { data } = await post('task/all-task', payload);
        if (!data.error) {
            dispatch({ type: TASK_CONSTANT.GET_USER_TASK, loading: false, data: data?.tasks, metaData: data?.metaData });
        }
    } catch (error) {
        dispatch({ type: TASK_CONSTANT.GET_USER_TASK, loading: false, data: [], metaData: {} });
        handleError(error.message);
    }
};

export const getTaskDetails = (payload, CB) => async (dispatch) => {
    dispatch({ type: TASK_CONSTANT.GET_TASK_DETAIL, loading: true, data: {} });
    const taskId = payload?.taskId || payload;
    try {
        const { data } = await get(`task/history/${taskId}`);
        if (!data.error) {
            dispatch({ type: TASK_CONSTANT.GET_TASK_DETAIL, loading: false, data });
            if (CB) CB(data);
        }
    } catch (error) {
        dispatch({ type: TASK_CONSTANT.GET_TASK_DETAIL, loading: false, data: {} });
        handleError(error.message);
    }
};

export const submitForReview = (formData) => async (dispatch) => {
    dispatch({ type: TASK_CONSTANT.SUBMIT_FOR_REVIEW, loading: true });
    try {
        const { data } = await post('task/upload-work', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (!data.error) {
            dispatch({ type: TASK_CONSTANT.SUBMIT_FOR_REVIEW, loading: false });
            handleSuccess(data.message);
            // Optionally refresh task details
            dispatch(getTaskDetails({ taskId: formData.get('taskId') }));
        }
    } catch (error) {
        dispatch({ type: TASK_CONSTANT.SUBMIT_FOR_REVIEW, loading: false });
        handleError(error.message);
    }
};


export const assignTaskToEmployee = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.ASSIGN_TASK_TO_EMPLOYEE
    dispatch({ type: dispatchType, loading: true });
    try {
        const { data } = await put('task/assign-task', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false });
        handleError(error.message || error?.response?.data?.message);
    }
};

export const getComments = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.GET_COMMENTS;
    dispatch({ type: dispatchType, loading: true, data: [] });

    try {
        const res = await get(`comments/get-comments/${payload?.taskId}`);
        const data = res?.data;
        if (data && !data.error) {
            dispatch({ type: dispatchType, loading: false, data: data?.data?.comments });
            if (typeof CB === "function") CB(data?.comments);
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, data: [] });
        handleError(error.message || error?.response?.data?.message);
    }
};

export const addComments = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.ADD_COMMENTS
    dispatch({ type: dispatchType, loading: true, data: [] });
    try {
        const { data } = await post('comments/Add-comments', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false, data: data?.comments });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, data: [] });
        handleError(error.message || error?.response?.data?.message);
    }
};


export const setStatus = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.SET_STATUS
    dispatch({ type: dispatchType, loading: true, data: [] });
    try {
        const { data } = await put('task/update-status', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false, data: data });
            CB && CB()
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false, data: [] });
        handleError(error.message || error?.response?.data?.message);
    }
};

export const editTask = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.EDIT_TASK;
    dispatch({ type: dispatchType, loading: true });
    try {
        const { data } = await put('task/edit', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message);
            CB && CB(data.task);
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false });
        handleError(error.message || error?.response?.data?.message);
    }
};

export const forwardOnboardingTask = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.FORWARD_ONBOARDING_TASK
    dispatch({ type: dispatchType, loading: true });
    try {
        const { data } = await post('onboarding/forwardToNextStep', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error.message);
        dispatch({ type: dispatchType, loading: false });
    }
};

export const creteResignationRequest = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.CREATE_RESIGNATION_REQUEST;
    dispatch({ type: dispatchType, loading: true });

    try {
        const { data } = await post("off-Boarding/apply-resign", payload);

        if (!data?.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message || "Resignation request created successfully");
            CB && CB();
        }
    } catch (error) {
        dispatch({ type: dispatchType, loading: false });
        handleError(error.response?.data?.message || "Failed to create resignation request. Please try again.")
    }
};

export const forwardOffboardingTask = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.FORWARD_OFFBOARDING_TASK
    dispatch({ type: dispatchType, loading: true });
    try {
        const { data } = await post('off-Boarding/action', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error.message);
        dispatch({ type: dispatchType, loading: false });
    }
};

export const counterOffer = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.COUNTER_OFFER
    dispatch({ type: dispatchType, loading: true });
    try {
        const { data } = await post('off-Boarding/counter-offer', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error.message);
        dispatch({ type: dispatchType, loading: false });
    }
};

export const respondCounterOffer = (payload, CB) => async (dispatch) => {
    const dispatchType = TASK_CONSTANT.RESPOND_COUNTER_OFFER
    dispatch({ type: dispatchType, loading: true });
    try {
        const { data } = await post('off-Boarding/counter-offer/respond', payload);
        if (!data.error) {
            dispatch({ type: dispatchType, loading: false });
            handleSuccess(data.message);
            CB && CB()
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error.message);
        dispatch({ type: dispatchType, loading: false });
    }
};

export const upsertTaskFromSocket = (task) => ({
    type: TASK_CONSTANT.TASK_UPSERT_SOCKET,
    data: task,
});

export const removeTaskFromSocket = (taskId) => ({
    type: TASK_CONSTANT.TASK_REMOVE_SOCKET,
    data: taskId,
});