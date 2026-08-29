import NOTIFICATION from "../constant/Notifications.constant";

const initialState = {
    notifications: [],
    notificationsLoading: false,


};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case NOTIFICATION.GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data !== undefined ? action.data : state.notifications,
                notificationsLoading: action.loading,
            };

        case NOTIFICATION.MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map((n) =>
                    n._id === action.data ? { ...n, read: true } : n
                ),
            };

        case NOTIFICATION.MARK_ALL_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map((n) => ({ ...n, read: true })),
            };

        case NOTIFICATION.NEW_NOTIFICATION_RECEIVED: {
            const alreadyExists = state.notifications.some(
                (n) => n._id === action.data?._id
            );
            if (alreadyExists) return state;

            return {
                ...state,
                notifications: [action.data, ...state.notifications],
            };
        }

        default:
            return state;
    }
};