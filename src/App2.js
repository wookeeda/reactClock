import React, { Component } from 'react';

class App2 extends Component {
    render() {
        return (
            <div>
                <PostContainer />
            </div>
        );
    }
}

export default App2;


class PostContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postList: [],
            isToast: false,
            toastMessage: '',
            timerId: 0
        };

        this.submit = this.submit.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentWillMount() {
        const firstDate = new Date(new Date().setDate(-2));
        const secondDate = new Date(new Date().setDate(-1));

        this.setState({
            postList: [{
                id: firstDate.getTime(),
                title: '첫 번째',
                contents: '첫 번째 내용'
            }, {
                id: secondDate.getTime(),
                title: '두 번째',
                contents: '두 번째 내용'
            }]
        });
    }

    submit(title, contents) {
        const now = new Date();
        const post = {
            id: now.getTime(),
            title: title,
            contents: contents
        }

        const postList = this.state.postList.slice();
        postList.push(post);

        clearTimeout(this.state.timerId);
        const timerId = setTimeout(() => {
            this.setState({
                isToast: false,
                toastMessage: ''
            });
        }, 2000);

        this.setState({
            postList: postList,
            isToast: true,
            toastMessage: '포스트가 등록되었습니다.',
            timerId: timerId
        });
    }

    delete(id) {
        const postList = this.state.postList.slice();
        const deleteItem = postList.find((post) => {
            return post.id === id;
        });

        clearTimeout(this.state.timerId);
        const timerId = setTimeout(() => {
            this.setState({
                isToast: false,
                toastMessage: ''
            });
        }, 2000);

        postList.splice(postList.indexOf(deleteItem), 1);
        this.setState({
            postList: postList,
            isToast: true,
            toastMessage: '포스트가 삭제되었습니다.',
            timerId: timerId
        });
    }

    render() {
        return (
            <div>
                <PostList postList={this.state.postList} onDelete={this.delete} />
                {this.state.isToast ?
                    <Toast>
                        <span>{this.state.toastMessage}</span>
                    </Toast> : null
                }
                <hr />
                <PostInput onSubmit={this.submit} />
            </div>
        );
    }
}

function PostList(props) {
    return (
        <table>
            <colgroup>
                <col width="20%" /><col width="30%" /><col width="10%" />
            </colgroup>
            <thead>
                <tr>
                    <th>ID</th><th>Title</th><th>Contents</th><th></th>
                </tr>
            </thead>
            <tbody>
                {props.postList.map((post) => <PostItem key={post.id} post={post} onDelete={props.onDelete} />)}
            </tbody>
        </table>
    )
}

class PostItem extends Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    delete(e) {
        this.props.onDelete(this.props.post.id);
    }

    render() {
        return (
            <tr>
                <td>{this.props.post.id}</td>
                <td>{this.props.post.title}</td>
                <td>{this.props.post.contents}</td>
                <td><button onClick={this.delete}>삭제</button></td>
            </tr>
        )
    }
}

class PostInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            contents: ''
        }

        this.controlledHandler = this.controlledHandler.bind(this);
        this.submit = this.submit.bind(this);
    }

    controlledHandler(e) {
        const target = e.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    submit(e) {
        this.props.onSubmit(this.state.title, this.state.contents);
    }

    render() {
        return (
            <div>
                <div className="title-area">
                    <label>제목</label>
                    <div>
                        <input type="text" name="title" value={this.state.title}
                            placeholder="제목을 입력해 주세요." onChange={this.controlledHandler} />
                    </div>
                </div>
                <div className="contents-area">
                    <label>내용</label>
                    <div>
                        <textarea name="contents" rows="10" value={this.state.contents} onChange={this.controlledHandler} />
                    </div>
                </div>
                <div className="button-area">
                    <button onClick={this.submit}>등록</button>
                </div>
            </div>
        )
    }
}

function Toast(props){
    return (
        <div className="toast">{props.children}</div>
    )
}