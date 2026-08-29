import TASK_CONSTANT from "../constant/Task.constant";

const initialState = {
    createTaskLoading: false,

    getUserTasks: [],
    getUserTasksMetaData: {},
    getUserTasksLoading: false,

    getTaskListByStatus: [],
    getTaskListByStatusLoading: false,

    getTaskDetails: [],
    getTaskDetailsLoading: false,

    submitForReviewLoading: false,

    assignTaskToEmployeeLoading: false,

    addCommentsLoading: false,
    comments: [],
    getCommentsLoading: false,

    getStatusLoading: false,

    updatedStatus: [],
    onboardingForwandTaskLoading: false,

    resignationRequestLoading: false,

    offboardingForwandTaskLoading: false,

    counterOfferLoading: false,

    respondCounterOfferLoading: false,

    editTaskLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case TASK_CONSTANT.CREATE_TASK:
            return {
                ...state,
                createTaskLoading: action.loading,
            };

        case TASK_CONSTANT.GET_USER_TASK:
            return {
                ...state,
                getUserTasks: action.data,
                getUserTasksMetaData: action.metaData,
                getUserTasksLoading: action.loading,
            };
        case TASK_CONSTANT.GET_TASK_LIST_BY_STATUS:
            return {
                ...state,
                getTaskListByStatus: action.data,
                getTaskListByStatusLoading: action.loading,
            };
        case TASK_CONSTANT.GET_TASK_DETAIL:
            return {
                ...state,
                getTaskDetails: action.data,
                getTaskDetailsLoading: action.loading,
            };
        case TASK_CONSTANT.SUBMIT_FOR_REVIEW:
            return {
                ...state,
                submitForReviewLoading: action.loading,
            };
        case TASK_CONSTANT.ASSIGN_TASK_TO_EMPLOYEE:
            return {
                ...state,
                assignTaskToEmployeeLoading: action.loading,
            };
        case TASK_CONSTANT.ADD_COMMENTS:
            return {
                ...state,
                addCommentsLoading: action.loading,
            };
        case TASK_CONSTANT.GET_COMMENTS:
            return {
                ...state,
                comments: action.data,
                getCommentsLoading: action.loading
            };

        case TASK_CONSTANT.SET_STATUS:
            return {
                ...state,
                getStatusLoading: action.loading,
                updatedStatus: action.data,
            };

        case TASK_CONSTANT.EDIT_TASK:
            return {
                ...state,
                editTaskLoading: action.loading,
            };

        case TASK_CONSTANT.FORWARD_ONBOARDING_TASK:
            return {
                ...state,
                onboardingForwandTaskLoading: action.loading,
            };
        case TASK_CONSTANT.CREATE_RESIGNATION_REQUEST:
            return {
                ...state,
                resignationRequestLoading: action.loading,
            };
        case TASK_CONSTANT.FORWARD_OFFBOARDING_TASK:
            return {
                ...state,
                offboardingForwandTaskLoading: action.loading,
            };
        case TASK_CONSTANT.COUNTER_OFFER:
            return {
                ...state,
                counterOfferLoading: action.loading,
            };
        case TASK_CONSTANT.RESPOND_COUNTER_OFFER:
            return {
                ...state,
                respondCounterOfferLoading: action.loading,
            };

        case TASK_CONSTANT.TASK_UPSERT_SOCKET: {
            const incoming = action.data;
            const exists = state.getUserTasks.some((t) => t._id === incoming._id);

            const updatedList = exists
                ? state.getUserTasks.map((t) => (t._id === incoming._id ? incoming : t))
                : [incoming, ...state.getUserTasks];

            return {
                ...state,
                getUserTasks: updatedList,
            };
        }

        case TASK_CONSTANT.TASK_REMOVE_SOCKET: {
            return {
                ...state,
                getUserTasks: state.getUserTasks.filter((t) => t._id !== action.data),
            };
        }

        default:
            return state;
    }
};