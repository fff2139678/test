import './index.scss'
import React from 'react';
import {$_localstorage} from 'services';
import {withRouter} from 'react-router-dom';

@withRouter
export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nowId: null
        };
    }

    initFn(data) {
        this.props.history.$push(data.codeName);
        this.setState({
            nowId: data.id
        });
    }

    componentDidMount() {
        let {nowId} = this.props.tabList;
        this.setState({
            nowId: nowId
        });
    }

    render() {
        let {tabMenu, listObj, nowId} = this.props.tabList;
        let arrList = listObj[tabMenu.parentId];
        let curId = (nowId === this.state.nowId) ? this.state.nowId : nowId;
        return (
            <div className="xcomponent-tab">
                <div className="xcomponent-tab-title">统计维度</div>
                    <ul className="list">
                        {
                            arrList.map((item,index) => {
                                let currentColor = curId === item.id ? 'active' : null;
                                return (<li className={`item ${currentColor}`} key={item.id} onClick={this.initFn.bind(this, item)}>{item.name}</li>);
                            })
                        }
                    </ul>
            </div>
        )
    }
}