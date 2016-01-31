import 'babel-core/polyfill';

export const message = text => ({
    type: 'MESSAGE',
    text
});

export const addUser = userName => dispatch => {
    return fetch('/users', {
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	method: 'POST',
	body: JSON.stringify({name: userName})
    })
	.then(r => r.json())
	.then(user => {
	    dispatch({
		type: 'ADD_USER',
		userId: user._id,
		name: user.name
	    });
	});		    
};

export const deleteUser = userId => dispatch => {
    return fetch(`/users/${userId}`, {
	method: 'DELETE'
    })
	.then(() => {
	    dispatch({
		type: 'DELETE_USER',
		userId
	    });
	});
};

export const fetchTodos = userId => dispatch => { 
    dispatch({type: 'REQUEST_TODOS', userId: userId});
    return fetch(`/users/${userId}/todos`)
	.then(r => r.json())
	.then(todos => dispatch({type: 'RECEIVE_TODOS', todos}))
	.then(() => dispatch({type: 'LOGIN_USER', userId}));
};

export const addTodo = (userId, text) => dispatch => {
    dispatch({type: 'REQUEST_ADD_TODO'});
    return fetch(`/users/${userId}/todos`, {
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	method: 'POST',
	body: JSON.stringify({text})
    })
	.then(r => r.json())
	.then(todo => {
	    dispatch({
		type: 'CONFIRM_ADD_TODO',
		todoId: todo._id,
		text: text
	    });
	});
};

export const deleteTodo = todoId => dispatch => {
    return fetch(`/todos/${todoId}`, {
	method: 'DELETE'
    })
	.then(() => dispatch({
	    type: 'DELETE_TODO',
	    todoId
	}));
};

export const addNotification = (sourceId, targetId, type, payload) => dispatch => {
    return fetch(`/users/${targetId}/notifications/`, {
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	method: 'POST',
	body: JSON.stringify({sourceId, type, payload})
    });
};

export const deleteNotification = notificationId => dispatch => {
    return fetch(`/notifications/${notificationId}/`, {
	method: 'DELETE'
    })
	.then(() => {
	    dispatch({
		type: 'DELETE_NOTIFICATION',
		notificationId
	    });
	});
};

export const fetchNotifications = targetId => dispatch => {
    dispatch({type: 'REQUEST_NOTIFICATIONS'});
    return fetch(`/users/${targetId}/notifications`)
	.then(r => r.json())
	.then(notifications => {
	    dispatch({
		type: 'RECEIVE_NOTIFICATIONS',
		notifications
	    });
	});
};
