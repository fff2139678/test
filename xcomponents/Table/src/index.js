import React from 'react';
import PropTypes from 'prop-types';
import {$_ajax, $_toast} from 'services';
import {XPagination, XIcon} from 'xcomponents';
import './index.scss';
import NodataImg from '../../../assets/no-data.png';
import {BLoading} from 'bcomponents';

let num = 1;

class OrderArea extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isUp: false,
            isDown: false,
            isSelected: false
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.keyCode !== newProps.orderName) {
            // 如果选中的排序选项不是需要排序的那一列,则需要重置排序的显示样式
            this.setState({
                isUp: false,
                isDown: false
            });
        }
    }

    upClick() {
        this.setState({
            isUp: !this.state.isUp,
            isDown: false
        }, () => {
            this.props.onOrderChange({
                type: this.state.isUp ? 'up' : null,
                key: this.props.keyCode
            });
        });

    }

    downClick() {
        this.setState({
            isUp: false,
            isDown: !this.state.isDown
        }, () => {
            this.props.onOrderChange({
                type: this.state.isDown ? 'down' : null,
                key: this.props.keyCode
            });
        });

    }

    render() {
        return (
            <div className="order-box">
                <div className={this.state.isUp ? `order-up selected` : `order-up`}
                     onClick={this.upClick.bind(this)}></div>
                <div className={this.state.isDown ? `order-down selected` : `order-down`}
                     onClick={this.downClick.bind(this)}></div>
            </div>
        );
    }
}

export default class extends React.Component {
    static propTypes = {
        tableConf: PropTypes.array,
        url: PropTypes.string,
        urlParams: PropTypes.object,
        dataList: PropTypes.array,
        className: PropTypes.string,
        topNumber: PropTypes.number,
        loadingSize: PropTypes.string
    };

    static defaultProps = {
        tableConf: [],
        url: '',
        dataList: [],
        urlParams: {},
        className: '',
        topNumber: -1,// 表示取列表数据的top多少条数据，默认-1，表示全展示
        loadingSize: 'md'// loading页面占据的高度：lg=800px,md=500px,sm=300px
    };

    constructor(props) {
        super(props);
    }

    state = {
        dataList: this.props.dataList,
        urlParams: Object.assign({currPage: 1, pageSize: 10}, this.props.urlParams),
        totalRecord: 0,
        orderName: '',
        orderType: '',
        isLoading: true
    };

    componentDidMount() {
        if (this.props.url !== '') {
            // url不为空，则为异步请求
            // this.getListData(this.state.urlParams);
            this.getListData();
        } else {
            this.setState({
                isLoading: false
            });
        }
    }

    componentWillReceiveProps(newProps) {
        if (!this.props.limit || num <= this.props.limit) {
            this.setState({
                urlParams: Object.assign({currPage: 1, pageSize: 10}, newProps.urlParams),
                dataList: newProps.dataList
            }, () => {
                if (newProps.url !== '') {
                    this.getListData();
                } else {
                    isLoading: false
                }
            });
            num++;
        }
    }

    getListData(key, sortType) {
        this.setState({
            isLoading: true
        });
        let params = this.state.urlParams,
            type = sortType === 'up' ? 1 : sortType === 'down' ? 0 : null;
        key ? params = Object.assign(params, {sequenceBy: this.props.sequenceMap[key], sequence: type}) : null;
        $_ajax.post(this.props.url, params)
            .then((res) => {
                this.setState({
                    dataList: res ? res.recordList || res : [],
                    currPage: res ? res.currPage || 1 : 1,
                    pageSize: res ? res.pageSize || 10 : 10,
                    totalPage: res ? res.totalPage || 0 : 0,
                    totalRecord: res ? res.totalRecord || 0 : 0,
                });
            }, (res) => {
                $_toast(res.msg);
            }).finally(() => {
            this.setState({
                isLoading: false
            });
        });
    }

    render() {
        const {tableConf, arrKey} = this.props;
        let {dataList} = this.state;
        if (this.props.topNumber !== -1) {
            dataList = dataList.slice(0, 10);
        }
        let noPager = this.props.noPager;
        let tableCls = `${this.props.className} xcomponent-table-wrapper`;
        return (
            [
                <div key="table" className={tableCls}>
                    <table className="xcomponent-table-view">
                        <thead>
                            <tr>
                                {tableConf.map((item, index) => {
                                    let tdAlign = item.align ? item.align : 'left';
                                    return (
                                        <th key={`${arrKey}${index}`} style={{textAlign: tdAlign}}>
                                            {item.name}
                                            {
                                                item.isOrder &&
                                                <OrderArea
                                                    keyCode={item.key}
                                                    orderName={this.state.orderName}
                                                    orderType={this.state.orderType}
                                                    onOrderChange={(res) => {
                                                        this.getListData(res.key, res.type);
                                                        this.setState({
                                                            orderName: res.key,
                                                            orderType: res.type
                                                        });
                                                    }}/>
                                            }
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.isLoading ?
                                    <tr>
                                        <td colSpan={this.props.tableConf.length}
                                            className={`${this.props.loadingSize} table-loading-data`}>
                                            <BLoading type={"table"}/>
                                        </td>
                                    </tr>
                                    : dataList.length > 0 ? dataList.map((item, index) => {
                                        return (
                                            <tr key={`${item.id}`} key={`tableItem_${index}`}>
                                                {tableConf.map((itemKey, indexKey) => {
                                                    let tdAlign = itemKey.align ? itemKey.align : 'left';
                                                    return (
                                                        <td key={`${arrKey}${indexKey}`} style={{textAlign: tdAlign}}>
                                                            {
                                                                itemKey.render ? itemKey.render(item) : item[itemKey['key']]
                                                            }
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    }) :
                                    <tr>
                                        <td colSpan={this.props.tableConf.length}
                                            className={`${this.props.loadingSize} table-no-data`}>
                                            <div className="no-data">
                                                <img src={NodataImg} alt=""/>
                                                <div className="no-data-msg">暂无数据</div>
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>,
                noPager ? '' : <div className="table-pagination" key="tablePage">
                    {/*<span className="total-info">共{this.state.totalRecord}条</span>*/}
                    <XPagination
                        count={this.state.totalRecord}
                        currentPage={this.state.currPage}
                        perPage={this.state.pageSize}
                        onPageChange={(res) => {
                            let oldParams = this.state.urlParams;
                            let newParams = Object.assign(oldParams, {currPage: res});
                            this.setState({
                                urlParams: newParams
                            }, () => {
                                this.getListData();
                                this.props.onPageChange && this.props.onPageChange(newParams);
                            });
                        }}
                        onSizeChange={(size) => {
                        }}
                    />
                </div>
            ]
        );
    }
}

