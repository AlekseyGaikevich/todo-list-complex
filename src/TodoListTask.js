import React from 'react';
import './App.css';

class TodoListTask extends React.Component {

    onIsDoneChanged = (e) => {
        this.props.changeStatus(this.props.task.id, e.currentTarget.checked ? 2 : 0);
    }

    onTitleChanged = (e) => {
        this.setState({
            newTitle: e.currentTarget.value
        })
    }

    state = {
        editMode: false,
        newTitle: this.props.task.title
    }

    activateEditMode = () => {
        this.setState({editMode: true});
    }

    deactivateEditMode= () => {
        this.setState({editMode: false});
        this.props.changeTitle(this.props.task.id, this.state.newTitle);
    }


    render = () => {

        let containerCssClass = this.props.task.status === 2 ? "todoList-task done" : "todoList-task";

        let priority = "";
        switch (this.props.task.priority) {
            case 0: priority = "Low"; break;
            case 1: priority = "Middle"; break;
            case 2: priority = "High"; break;
            case 3: priority = "Urgently"; break;
            case 4: priority = "Later"; break;
        }


        return (
                <div className={containerCssClass}>
                    <input type="checkbox" checked={this.props.task.status == 2}
                           onChange={this.onIsDoneChanged}/>
                    { this.state.editMode
                        ? <input onBlur={this.deactivateEditMode} onChange={this.onTitleChanged} autoFocus={true} value={this.state.newTitle} />
                        : <span onClick={this.activateEditMode}>{this.props.task.title}</span>
                    }, priority: { priority }
                </div>
        );
    }
}

export default TodoListTask;

