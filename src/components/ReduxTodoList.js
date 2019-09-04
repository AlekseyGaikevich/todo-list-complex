import React from 'react';
import {todolistAPI} from "../api";
import AddNewItemForm from "../AddNewItemForm";
import TodoListTasks from "../TodoListTasks";
import TodoListFooter from "../TodoListFooter";
import TodoListTitle from "../TodoListTitle";
import preloader from "../preloader.svg"
import {connect} from "react-redux";
import {SET_TASKS, UPDATE_TASK} from "../redux/reducer";

const ReduxTodoListView = (props) => {

    return <div className="todoList">
        <div className="todoList-header">
            <TodoListTitle title={props.title}/>
            <AddNewItemForm addItem={props.addTask}/>
        </div>

        {props.isFetching
            ? <img src={preloader}/>
            : <TodoListTasks changeStatus={props.changeStatus}
                             changeTitle={props.changeTitle}
                /*tasks={this.state.tasks.filter(t => {*/
                             tasks={props.tasks.filter(t => {
                                 if (props.filterValue === "All") {
                                     return true;
                                 }
                                 if (props.filterValue === "Active") {
                                     return t.status !== 2;
                                 }
                                 if (props.filterValue === "Completed") {
                                     return t.status === 2;
                                 }
                             })}/>
        }
        <TodoListFooter changeFilter={props.changeFilter} filterValue={props.filterValue}/>
    </div>
}

class ReduxTodoList extends React.Component {

    constructor(props) {
        super(props);
        this.newTasksTitileRef = React.createRef();

    }

    componentDidMount() {
        this.restoreState();
    }

    restoreState = () => {
        this.setState({isFetching: true});

        todolistAPI.getTasks(this.props.id)
            .then(res => {
                this.setState({isFetching: false});
                this.props.setTasks(res.data.items);
                // this.setState( {tasks: res.data.items });
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

        });
    }

    changeTask = (taskId, obj) => {
        let task = this.props.tasks.find(t => t.id === taskId);
        let newTask = {...task, ...obj};
        todolistAPI.updateTask(newTask)
            .then(res => {
                debugger
                this.props.changeTask(newTask);
            });

        /*
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
            })*/
    }
    changeStatus = (taskId, status) => {
        this.changeTask(taskId, {status: status});
    }
    changeTitle = (taskId, title) => {
        this.changeTask(taskId, {title: title});
    }

    render = () => {
        return (
            <ReduxTodoListView {...this.props}
                               addTask={this.addTask}
                               filterValue={this.state.filterValue}
                               isFetching={this.state.isFetching}
                               changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle}
                               changeFilter={this.changeFilter}
            />
        );
    }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => {
    return {
        setTasks: (tasks) => {
            let action = {
                type: SET_TASKS,
                tasks: tasks
            }

            dispatch(action);
        },
        changeTask: (updatedTask) => {
            let action = {
                type: UPDATE_TASK,
                task: updatedTask
            }

            dispatch(action);
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReduxTodoList);

