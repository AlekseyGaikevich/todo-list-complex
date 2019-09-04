import React from 'react';
import './App.css';
import TodoList from "./TodoList";
import AddNewItemForm from "./AddNewItemForm";
import {todolistAPI} from "./api";
import preloader from "./preloader.svg";

class App extends React.Component {

    state = {
        todolists: [],
        isFetching: false
    }

    addTodoList = (title) => {
        //instance.post("todo-lists", {title: title})
        todolistAPI.createTodolist(title)
            .then(res => {
                let todolist = res.data.data.item;//todolist, котоырй создался на серваке и вернулся нам
                this.setState( {todolists: [...this.state.todolists, todolist ]});
            });
    }

    componentDidMount() {
        this.restoreState();
    }


    saveState = () => {
        // переводим объект в строку
        let stateAsString = JSON.stringify(this.state);
        // сохраняем нашу строку в localStorage под ключом "our-state"
        localStorage.setItem("todolists-state", stateAsString);
    }

    restoreState = () => {
        // объявляем наш стейт стартовый
        this.setState({isFetching: true});

        //instance.get("todo-lists")
        todolistAPI.getTotolists()
            .then(res => {
                this.setState({isFetching: false});
                this.setState( {todolists: res.data });
            });
    }

    render = () => {
        const todolists = this.state
            .todolists
            .map(tl => <TodoList id={tl.id} title={tl.title}/>)

        return (
            <>
                <div>
                   <AddNewItemForm addItem={this.addTodoList}/>
                </div>
                <div className="App">
                    { this.state.isFetching ? <img src={preloader} /> : todolists}
                </div>
            </>
        );
    }
}

export default App;

