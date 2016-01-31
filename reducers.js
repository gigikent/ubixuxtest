import { combineReducers } from 'redux';

const appMessage = (state = {text: ''}, action) => {
    switch (action.type) {
    case 'MESSAGE': return {text: action.text};
    case 'ADD_USER': return {text: 'added user ' + action.name};
    case 'DELETE_USER': return {text: 'deleted user'};
    case 'DELETE_TODO': return {text: 'deleted todo ' + action.text};
    case 'LOGOUT': return {text: ''};
    default: return state;
    }
};

const loggedUser = (state = {}, action) => {
    switch (action.type) {
    case 'LOGIN_USER':
	return {userId: action.userId};
    case 'LOGOUT':
	return {};
    default: return state;
    }
};

const selectedUser = (state = {}, action) => {
    switch (action.type) {
    case 'SELECT_USER':
	return {userId: action.userId};
    case 'DELETE_USER':
	return {};
    default: return state;
    }
};

const users = (state = {
    ids:[],
    byId:{},
    isFetching: false
}, action) => {
    const {ids, byId} = state;
    switch (action.type) {
    case 'REQUEST_USERS':
	return Object.assign({}, state, {isFetching: true});
    case 'RECEIVE_USERS':
	return Object.assign({}, state, {
	    isFetching: false,
	    ids: action.users.map(user => user._id),
	    byId: action.users.reduce((users, user) => Object.assign({}, users, {
		[user._id] : user.name // {userId: user._id, name: user.name}
	    }), {})
	});
    case 'ADD_USER':
	return Object.assign({}, state, {
	    ids: [...ids, action.userId], // ids.concat(action.id),
	    byId: Object.assign({}, byId, {[action.userId] : action.name})
	});
    case 'DELETE_USER':
	return Object.assign({}, state, {
	    ids: ids.filter(elt => elt != action.userId),
	    byId: Object.assign({}, byId, {[action.userId] : undefined})
	});
    default: return state;
    }
};

const todos = (state = {
    isFetching: false,
    ids:[],
    byId:{}
}, action) => {
    const {ids, byId} = state;
    switch (action.type) {
    case 'REQUEST_TODOS': return Object.assign({}, state, {isFetching: true});
    case 'RECEIVE_TODOS': return Object.assign({}, state, {
	isFetching: false,
	ids: action.todos.map(todo => todo._id),
	byId: action.todos.reduce((todos, todo) => Object.assign({}, todos, {
	    [todo._id] : {text: todo.text}
	}), {})
    });
    case 'LOGOUT': return Object.assign({}, state, {ids: [], byId: {}});
    case 'REQUEST_ADD_TODO': return Object.assign({}, state, {isFetching: true});
    case 'CONFIRM_ADD_TODO': return Object.assign({}, state, {
	ids: [...ids, action.todoId],
	byId: Object.assign({}, byId, {[action.todoId] : {text: action.text}})
    });
    case 'MARK_AS_DONE': return Object.assign({}, state, {
	byId: Object.assign({}, byId, {
	    [action.todoId]: Object.assign({}, byId[action.todoId], {
		done: true
	    })
	})
    });
    case 'DELETE_TODO':
	return Object.assign({}, state, {
	    ids: ids.filter(elt => elt != action.todoId),
	    byId: Object.assign({}, byId, {[action.todoId] : undefined})
	});
    default: return state;
    }
};

const selectedTodo = (state = {}, action) => {
    switch (action.type) {
    case 'SELECT_TODO': return {id: action.todoId, [action.todoId]: true};
    default: return state;
    }
};

const highlightedTodo = (state = {}, action) => {
    switch (action.type) {
    case 'HIGHLIGHT_TODO': return {[action.todoId]: true};
    case 'UNHIGHLIGHT_TODO': return {};
    default: return state;
    }
};

const viewTargets = (state = false, action) => {
    switch (action.type) {
    case 'SHOW_TARGETS': return true;
    case 'HIDE_TARGETS': return false;
    case 'DELETE_TODO': return false;
    default: return state;
    }
};

const notifications = (state = {
    isFetching: false,
    ids: [],
    byId: {}
}, action) => {
    const {ids, byId} = state;
    switch (action.type) {
    case 'RECEIVE_NOTIFICATIONS':
	return Object.assign({}, state, {
	    isFetching: false,
	    ids: action.notifications.map(notification => notification._id),
	    byId: action.notifications.reduce(
		(notifications, notification) => Object.assign({}, notifications, {
		    [notification._id] : notification
		}), {})
	});
    case 'DELETE_NOTIFICATION':
	return Object.assign({}, state, {
	    ids: ids.filter(elt => elt != action.notificationId),
	    byId: Object.assign({}, byId, {[action.notificationId] : undefined})
	});
    default: return state;
    }
};

export const rootReducer = combineReducers({
    users, selectedUser, loggedUser, todos, selectedTodo, highlightedTodo,
    viewTargets, notifications, appMessage});
