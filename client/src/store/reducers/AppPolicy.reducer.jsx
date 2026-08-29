import APP_POLICY from "../constant/AppPolicy.constant";

const initialState = {
    appPolicies: {
        loading: false,
        data: [],
    },

    appPolicyDetails: {
        loading: false,
        data: null,
    },

    createPolicyLoading: false,
    updatePolicyLoading: false,
    deactivatePolicyLoading: false,
};

const AppPolicyReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {

        case APP_POLICY.GET_APP_POLICIES:
            return {
                ...state,
                appPolicies: {
                    loading: action.loading,
                    data: action.data,
                },
            };

        case APP_POLICY.GET_APP_POLICY_BY_ID:
            return {
                ...state,
                appPolicyDetails: {
                    loading: action.loading,
                    data: action.data,
                },
            };

        case APP_POLICY.CREATE_APP_POLICY:
            return {
                ...state,
                createPolicyLoading: action.loading,
            };

        case APP_POLICY.UPDATE_APP_POLICY:
            return {
                ...state,
                updatePolicyLoading: action.loading,
            };

        case APP_POLICY.DEACTIVATE_APP_POLICY:
            return {
                ...state,
                deactivatePolicyLoading: action.loading,
            };

        default:
            return state;
    }
};

export default AppPolicyReducer;