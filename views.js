import 'babel-core/polyfill';
import { createElement, Component } from 'react';

export const Button = props => createElement(
    'button', {
	onClick: props.onClick
    }, props.text
);

export const List = props => createElement(
    'div', {
	style:{flexDirection:'column',
	       backgroundColor: props.background}
    }, props.children);

export const UserView = (props) => createElement('div', {
    style: {
	backgroundColor: props.isSelected ? 'lightblue' : 'inherit',
	padding: 5,
	cursor: 'pointer'
    },
    onClick: props.onSelect
}, props.name);

export const TodoView = (props) => createElement(
    'div',
    {
	style: {
	    backgroundColor: props.isHighlighted ? 'yellow' : 'inherit',
	    border: props.isSelected ? 'solid 1px' : '',
	    padding: 5,
	    cursor: 'pointer'
	},
	onMouseOver: props.highlight,
	onMouseOut: props.unhighlight
    },
    createElement('div', {}, props.name),
    createElement('div', {style: {flexGrow: '1'}}),
    props.isHighlighted
	? createElement(
	    'div',
	    {
		onClick: props.removeTodo,
		style: {
		    backgroundColor: 'hsl(240, 100%, 95%)',
		    padding: 3,
		    border: 'solid 1px blue',
		    margin: 2
		}
	    }, ' remove ')
    : createElement('div', {}),
    props.isSelected || props.isHighlighted
	? createElement(
	    'div',
	    {
		onClick: props.suggestTo,
		style: {
		    backgroundColor: 'hsl(240, 100%, 95%)',
		    padding: 3,
		    border: 'solid 1px blue',
		    margin: 2
		}
	    }, 'suggest to ->')
    : createElement('div', {})
);

export const SuggestionView = (props) => createElement(
    'div',
    {
	style: {
	    padding: 5,
	    margin: 2,
	    border: 'solid 1px green',
	    borderRadius: 3,
	    cursor: 'pointer'
	}
    },
    createElement(
	'div',
	{style: {flexDirection: 'column'}},
	createElement('div', {}, 'User ' +props.sourceName +
		      ' has suggested for you the following TODO: '),
	createElement('div', {}, props.todo)
    ),
    createElement('div', {style: {flexGrow: '1'}}),
    createElement(
	'div',
	{style: {flexDirection: 'column'}},
	createElement('button', {onClick: props.onAccept}, 'Accept'),
	createElement('button', {onClick: props.onReject}, 'Reject')
    )
);

export const ResponseView = (props) => createElement(
    'div',
    {
	style: {
	    padding: 5,
	    margin: 2,
	    border: 'solid 1px green',
	    borderRadius: 3,
	    cursor: 'pointer'
	}
    },
    createElement(
	'div',
	{style: {flexDirection: 'column'}},
	createElement('div', {}, 'User ' + props.sourceName +
		      ' has ' + props.response + ' the following TODO: '),
	createElement('div', {}, props.todo)
    ),
    createElement('div', {style: {flexGrow: '1'}}),
    createElement('button', {onClick: props.onDismiss}, 'Dismiss')
);
