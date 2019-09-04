import { todolistAPI } from '../api';

export const SET_TASKS = "SET-TASKS";
export const ADD_TASK = "ADD-TASK";
export const UPDATE_TASK = "UPDATE-TASK";
export const SET_TODOLISTS = "SET-TODOLISTS";

const initialState = {
    tasks: [],
    todolists: []
}

export const getTodolistsThunk = (dispatch) => {
    todolistAPI.getTotolists()
            .then(res => {
                // this.props.setTodolists(res.data);
                let action = {
                    type: SET_TODOLISTS,
                    todolists: res.data
                };
                dispatch(action);        
            });
};

const reducer = (state=initialState, action) => {
    if (action.type === UPDATE_TASK) {
        let newTasks = state.tasks.map(t => {
                    if (t.id !== action.task.id) {
                        return t;
                    } else {
                        return action.task;
                    }
                });
        return {...state, tasks: newTasks }
    }

    if (action.type === SET_TASKS) {
        return {
            ...state,
            tasks: [...state.tasks, ...action.tasks]
        }
    }
    if (action.type === ADD_TASK) {
        return {
            ...state,
            tasks: [...state.tasks, {title: action.title}]
        }
    }
    if (action.type === SET_TODOLISTS) {
        return {
            ...state,
            todolists: action.todolists
        }
    }

    return state;
}

export const setTaskAC = (tasks) => {
    let action = {
        type: SET_TASKS,
        tasks: tasks
    }
    return action;
}

export default reducer;