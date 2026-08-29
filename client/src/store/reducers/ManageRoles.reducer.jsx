import MANAGE_ROLES from "../constant/ManageRoles.constant";

const initialState = {
    roles: [],
    rolesLoading: false,

    roleActionLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case MANAGE_ROLES.GET_ROLES:
            return {
                ...state,
                roles: action.data,
                rolesLoading: action.loading,
            };
        case MANAGE_ROLES.ADD_EDIT_ROLE:
            return {
                ...state,
                roleActionLoading: action.loading,
            };
        default:
            return state;
    }
};