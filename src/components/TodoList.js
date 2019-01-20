import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class TodoList extends Component {
    state = {
        newTodoText: '',
        todoToDelete: ''
    }

    addTodo = () => {
        const { newTodoText } = this.state;

        this.props.addTodo({
            variables: { text: newTodoText },
            update: (proxy, { data: { createTodo } }) => {
                this.props.todos.refetch();
            },
        });
    }

    removeTodo = (id) => {
        const { todoToDelete } = this.state;

        this.props.removeTodo({
            variables: { id: todoToDelete },
            update: (proxy, { data: { removeTodo } }) => {
                this.props.todos.refetch();
            },
        });
    }

    renderTodoList = () => (
        <ul>
        { this.props.todos.allTodoes.map(todo => (
            <li key="{todo.id}">{todo.text} 
                <button onClick={() => this.setState({ todoToDelete: todo.id }) }>x</button>
            </li>
        ))}
        </ul>
    );

    render() {
        const { todos } = this.props;
        const state = JSON.stringify(this.state);

        return (
            <Fragment>
                { state }

                { todos.loading
                    ? <p>Carregando...</p>
                    : this.renderTodoList() }

                <input type="text" value={this.state.newTodoText}
                    onChange={e => this.setState({ newTodoText: e.target.value })}
                    />
                
                <input type="submit" value="Criar" onClick={this.addTodo} />

                <input type="submit" value="Deletar" onClick={this.removeTodo} />
            </Fragment>
        );
    }
}

const TodosQuery = gql`
    query {
        allTodoes {
            id
            text
            completed
        }
    }
`;

const AddTodoMutation = gql`
    mutation ($text: String!){
        createTodo ( text: $text ) {
            id
            text
            completed
        }
    }
`;

const RemoveTodoMutation = gql`
    mutation ($id: ID!){
        deleteTodo(id: $id) {
            id,
            text,
            completed
        }
    }
`;

export default compose(
    graphql(TodosQuery, { name: 'todos' }),
    graphql(AddTodoMutation, {name: 'addTodo'}),
    graphql(RemoveTodoMutation, {name: 'removeTodo'})
    )(TodoList);