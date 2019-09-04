import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
    headers: {'API-KEY': 'c500bcc4-55b5-4e53-8b18-ab67c62c6e49'}
});


export const todolistAPI = {
    createTodolist(title) {
        return instance.post("todo-lists", {title: title});
    },
    getTotolists() {
        return instance.get("todo-lists");
    },
    getTasks(todolistId) {
        return instance.get(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId, title) {
        return instance.post(`todo-lists/${todolistId}/tasks`,
            {title: title});
    },
    updateTask(task) {
        return instance.put(`todo-lists/tasks`, task);
    }
}

export default instance;