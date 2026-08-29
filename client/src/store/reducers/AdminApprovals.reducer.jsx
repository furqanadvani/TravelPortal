import IT_APPROVALS from "../constant/AdminApprovals.constant";

const initialState = {
    adminApprovalsData: [],
    getAdminApprovalsLoading: false,

    adminApprovalsActionLoading:false,
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case IT_APPROVALS.GET_IT_APPROVALS:
            return {
                ...state,
                adminApprovalsData: action.data,
                getAdminApprovalsLoading: action.loading,
            };
        case IT_APPROVALS.ADMIN_APPROVAL_ACTION:
            return {
                ...state,
                adminApprovalsActionLoading: action.loading,
            };
        default:
            return state;
    }
}

