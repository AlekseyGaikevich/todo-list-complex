import React from 'react';
import {connect} from "react-redux";
import AddNewItemForm from "../AddNewItemForm";
import {todolistAPI} from "../api";
import ReduxTodoList from "./ReduxTodoList";
import {ADD_TASK, SET_TODOLISTS, getTodolistsThunk} from "../redux/reducer";


const ReduxAppView = (props) => {
            return <div className="App">
                <AddNewItemForm addItem={(title) => {props.addTask(title)}} />
                {props
                    .todolists
                    .map(tl => <ReduxTodoList id={tl.id} title={tl.title}
                                              tasks={props.tasks.filter(t => t.todoListId === tl.id)}/>)}
            </div>
}

class ReduxApp extends React.Component {
    componentDidMount() {
        todolistAPI.getTotolists()
            .then(res => {
                // this.props.setTodolists(res.data); 
                this.props.getTodoLists()
            })
}

    render() {
        return <ReduxAppView {...this.props} />
    }
}    

let mapStateToProps = (state) => {
    return {
        tasks: state.tasks,
        todolists: state.todolists
    }
}

let mapDispatchToProps = (dispatch) => {
    return {

        getTodoLists: () => {
            dispatch(getTodolistsThunk);
        },

        addTask: (title) => {
            let action = {
                type: ADD_TASK,
                title: title};
            dispatch(action);
        },
        setTodolists: (todolists) => {
            let action = {
                type: SET_TODOLISTS,
                todolists: todolists
            };
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxApp);