import React from 'react';
import './App.css';
import TodoListTasks from "./TodoListTasks";
import TodoListFooter from "./TodoListFooter";
import TodoListTitle from "./TodoListTitle";
import AddNewItemForm from "./AddNewItemForm";
import instance, {todolistAPI} from "./api";
import preloader from "./preloader.svg";

class TodoList extends React.Component {

    constructor(props) {
        super(props);
        this.newTasksTitileRef = React.createRef();

    }

    componentDidMount() {
        this.restoreState();
    }

    saveState = () => {
        // переводим объект в строку
        let stateAsString = JSON.stringify(this.state);
        // сохраняем нашу строку в localStorage под ключом "our-state"
        localStorage.setItem("our-state-" + this.props.id, stateAsString);
    }

    restoreState = () => {
        this.setState({isFetching: true});
        todolistAPI.getTasks(this.props.id)
            .then(res => {
                this.setState({isFetching: false});
                this.setState( {tasks: res.data.items });
            });
    }

    state = {
        tasks: [],
        filterValue: "All",
        isFetching: false
    };

    addTask = (newText) => {
        todolistAPI.createTask(this.props.id, newText)
            .then(res => {
                let newTask = res.data.data.item;//task, который создался на серваке и вернулся нам
                this.setState({tasks: [...this.state.tasks, newTask]});
            });

    }

    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        }, () => {
            this.saveState();
        });
    }

    changeTask = (taskId, obj) => {
        let task = this.state.tasks.find(t => t.id === taskId);
        let newTask = {...task, ...obj};
        todolistAPI.updateTask(newTask)
            .then( res => {
                let newTasks = this.state.tasks.map(t => {
                    if (t.id != taskId) {
                        return t;
                    } else {
                        return newTask;
                    }
                });
                this.setState({
                    tasks: newTasks
                }, () => {
                    this.saveState();
                });
            })
    }
    changeStatus = (taskId, status) => {
        this.changeTask(taskId, {status: status});
    }
    changeTitle = (taskId, title) => {
        this.changeTask(taskId, {title: title});
    }

    render = () => {
        return (
            <div className="todoList">
                <div className="todoList-header">
                    <TodoListTitle title={this.props.title}/>
                    <AddNewItemForm addItem={this.addTask}/>
                </div>

                {this.state.isFetching
                    ? <img src={preloader}/>
                    : <TodoListTasks changeStatus={this.changeStatus}
                                     changeTitle={this.changeTitle}
                                     tasks={this.state.tasks.filter(t => {
                                         if (this.state.filterValue === "All") {
                                             return true;
                                         }
                                         if (this.state.filterValue === "Active") {
                                             return t.status !== 2;
                                         }
                                         if (this.state.filterValue === "Completed") {
                                             return t.status === 2;
                                         }
                                     })}/>
                }
                <TodoListFooter changeFilter={this.changeFilter} filterValue={this.state.filterValue}/>
            </div>

        );
    }
}

export default TodoList;

