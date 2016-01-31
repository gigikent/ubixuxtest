import 'babel-core/polyfill';
import { createElement, Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { rootReducer } from './reducers.js';
import {addUser, deleteUser, fetchTodos, addTodo, message, deleteTodo,
	addNotification, fetchNotifications, deleteNotification} from './actions.js';
import { UserView, TodoView, SuggestionView, ResponseView, List} from './views.js';

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
    , loggerMiddleware
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

@connect(state => ({
    users: state.users,
    currentUserId: state.loggedUser.userId,
    selectedTodo: state.todos.byId[state.selectedTodo.id]
}))
class SuggestionTargets extends Component {
    render() {
	const { users, currentUserId, dispatch, selectedTodo } = this.props;
	return createElement(
	    List, {},
	    users.ids
		.filter(userId => userId != currentUserId)
		.map(userId => createElement(
		    UserView,
		    {
			key: userId,
			name: users.byId[userId],
			isSelected: false,
			onSelect: () => dispatch(addNotification(
			    currentUserId, userId, 'SUGGESTION', {todo: selectedTodo.text}))
			    .then(() => dispatch(message('You suggested todo ' + selectedTodo.text +
							 ' to user ' + users.byId[userId])))
			    .then(() => dispatch({type: 'HIDE_TARGETS'}))
		    }
		))
	);
    }
}

@connect(state => ({
    users: state.users,
    selectedUserId: state.selectedUser.userId
}))
class UserListContainer extends Component {
    render() {
	const { users, selectedUserId, dispatch } = this.props;
	return createElement(
	    List, {},
	    users.ids.map(userId => createElement(
		UserView,
		{
		    key: userId,
		    name : users.byId[userId],
		    isSelected : userId === selectedUserId,
		    onSelect : () => dispatch({type: 'SELECT_USER', userId})
		}
	    ))
	);
    }
}

@connect(state => ({
    todos: state.todos,
    highlightedTodo: state.highlightedTodo,
    selectedTodo: state.selectedTodo
}))
class TodoListContainer extends Component {
    render () {
	const { todos, highlightedTodo, selectedTodo, dispatch } = this.props;
	return createElement(
	    List, {background: 'hsl(120, 100%, 95%)'},
	    todos.ids.map(todoId => createElement(
		TodoView,
		{
		    name: todos.byId[todoId].text,
		    isHighlighted: highlightedTodo[todoId],
		    isSelected: selectedTodo[todoId],
		    select: () => dispatch({type: 'SELECT_TODO', todoId}),
		    unselect: () => dispatch({type: 'UNSELECT_TODO', todoId}),
		    highlight: () => dispatch({type: 'HIGHLIGHT_TODO', todoId}),
		    unhighlight: () => dispatch({type: 'UNHIGHLIGHT_TODO', todoId}),
		    suggestTo: () => {
			dispatch({type: 'SHOW_TARGETS', todoId});
			dispatch({type: 'SELECT_TODO', todoId});		    
		    },
		    removeTodo: () => dispatch(message('You deleted todo ' +
						       todos.byId[todoId].text))
		}
	    ))
	);
    }
}

@connect(state => ({
    users: state.users,
    notifications: state.notifications
}))
class NotificationListContainer extends Component {
    render() {
	const { notifications, users, dispatch } = this.props;
	return createElement(
	    List, {},
	    notifications.ids.map(notificationId => {
		const {sourceId, targetId, type, payload} = notifications.byId[notificationId];
		switch (type) {
		case 'SUGGESTION':
		    return createElement(
			SuggestionView,
			{
			    key: notificationId,
			    todo: payload.todo,
			    sourceName: users.byId[sourceId],
			    onAccept: () => dispatch(addNotification(
				targetId,  // source and target get switched
				sourceId,
				'RESPONSE',
				{
				    notificationId,
				    todo: payload.todo,
				    accept: true
				}
			    )).then(() => {
				dispatch(addTodo(targetId, payload.todo));
				dispatch(deleteNotification(notificationId));
				dispatch(message(
				    'You accepted suggestion ' + payload.todo +
					' from user ' + users.byId[sourceId]));
			    }),
			    onReject: () => dispatch(addNotification(
				targetId,  // source and target get switched
				sourceId,
				'RESPONSE',
				{
				    notificationId,
				    todo: payload.todo,
				    accept: false
				}
			    )).then(() => {
				dispatch(deleteNotification(notificationId));
				dispatch(message(
				    'You rejected suggestion ' + payload.todo +
					' from user ' + users.byId[sourceId]));
			    })
			});
		case 'RESPONSE':
		    return createElement(
			ResponseView,
			{
			    key: notificationId,
			    todo: payload.todo,
			    sourceName: users.byId[sourceId],
			    response: payload.accept ? 'accepted' : 'rejected',
			    onDismiss: () => dispatch(deleteNotification(notificationId))
			});
		default: return createElement('div', {});
		}
	    })
	);
    }
}

@connect(state => ({selectedUserId: state.selectedUser.userId}))
class LoginPage extends Component {
    render() {
	const {selectedUserId, dispatch} = this.props;
	return createElement(
	    'div',
	    {
		style: {flexDirection: 'column', flexGrow: 1}
	    },
	    createElement('input', {ref: node => this.input = node}),
	    createElement(
		'button', {
		    onClick: () => {
			dispatch(addUser(this.input.value));
			this.input.value = '';
		    }
		},
		'Add user'),
	    createElement(UserListContainer, {}),
	    createElement(
		'button',
		{
		    onClick: () => {
			dispatch(deleteUser(selectedUserId));
			this.input.value = '';
		    }
		},
		'Delete user'),
	    createElement(
		'button',
		{
		    onClick: () => {
			dispatch(fetchTodos(selectedUserId));
			dispatch(fetchNotifications(selectedUserId));
		    }
		},
		'Login')
	);
    }

}

@connect(state => ({
    users: state.users,
    loggedUser: state.loggedUser,
    viewTargets: state.viewTargets
}))
class UserPage extends Component {
    render() {
	const {dispatch, viewTargets, users, loggedUser} = this.props;
	return createElement(
	    'div', {style: {flexDirection: 'column', flexGrow: 1}},
	    createElement(
		'h1', {},
		createElement('div', {}, 'Logged in as ' + users.byId[loggedUser.userId]),
		createElement('div', {style: {flexGrow: 1}}),
		createElement(
		    'button',
		    {onClick: () => dispatch({type: 'LOGOUT'})},
		    'Logout'
		)
	    ),
	    createElement(
		'div', {},
		createElement(
		    'div',
		    {style: {flexDirection: 'column', flexGrow: 1}},
		    createElement('input', {ref: node => this.input = node}),
		    createElement(
			'button', {
			    onClick: () => {
				dispatch(addTodo(loggedUser.userId, this.input.value));
				this.input.value = '';
			    }
			},
			'Add todo'),
		    createElement(TodoListContainer, {})
		),
		viewTargets ? createElement(SuggestionTargets, {})
		: createElement('div', {})
	    ),
	    createElement('div', {style: {flexGrow: 1}}),
	    createElement('h2', {}, 'Notifications'),
	    createElement(NotificationListContainer, {})
	);
    }
}

@connect(state => ({
    loggedUserId: state.loggedUser.userId,
    appMessage: state.appMessage
}))
class App extends Component {
    componentDidMount() {
	this.props.dispatch(disp => {
	    disp({type: 'REQUEST_USERS'});
	    return fetch('/users')
		.then(r => r.json())
		.then(resp => disp({type: 'RECEIVE_USERS', users: resp}));
	});
    }
    
    render() {
	const { appMessage } = this.props;
	return createElement(
	    'div', {style: {flexDirection: 'column', flexGrow: 1}},
	    this.props.loggedUserId
		? createElement(UserPage, {userId: this.props.loggedUserId})
	    : createElement(LoginPage, {}),
	    createElement('h2', {}, 'App message'),
	    createElement('div', {}, appMessage.text)
	);
    }
}

render(
    createElement(
	Provider,
	{store},
	createElement(App, {})
    ), document.getElementById('root')
);
