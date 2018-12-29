import React from 'react';
import {XToggle, XInput} from 'xcomponents';
import {$_ajax, $_util} from 'services';
import PropTypes from 'prop-types';

import './index.scss';

export default class SearchInput extends React.Component {
    static propTypes = {
        ajaxUrl: PropTypes.string,
        onItemClick: PropTypes.func,
        size: PropTypes.string,
        inputValue: PropTypes.string
    }

    static defaultProps = {
        ajaxUrl: '',
        onItemClick: () => {
        },
        size: 'sm',
        inputValue: ''
    }

    constructor(props) {
        super();
        this.state = {
            resList: [],
            inputValue: props.value,
            isSearch: false,
            searchTips: '数据加载中...',
        };
        // 防抖搜索
        this.searchShop = $_util.debounce(400, () => {
            if (this.state.inputValue === '') {
                return;
            }
            this.setState({
                resList: [],
                searchTips: '数据加载中...'
            });

            let params = props.params;
            params[props.keywordName] = this.state.inputValue;

            $_ajax.post(props.ajaxUrl, params).then((res) => {
                let resList = res;
                if (props.resultProcess) {
                    resList = props.resultProcess(res);
                }

                this.setState({
                    resList: resList,
                    searchTips: resList.length > 0 ? '' : '搜索无结果'
                });
            }, (res) => {
                // this.setState({
                //     resList: [{value: 1, label: '选项-1'}, {value: 2, label: '选项-2'}]
                // });
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        const {value} = nextProps;
        this.setState({
            inputValue: value
        });
    }

    onInputClick(e) {
        if (this.state.isSearch) {
            // 如果处于搜索状态，则阻止点击，后的事件冒泡
            e.nativeEvent.stopImmediatePropagation();
        }
    }

    onSearch(res) {
        this.setState({
            inputValue: res,
            isSearch: true
        }, () => {
            this.searchShop();
        });
    }

    clearSearch() {
        this.setState({
            isSearch: false,
            inputValue: '',
            resList: []
        });
    }

    searchItemClick(item) {
        this.setState({
            inputValue: item.label
        }, () => {
            this.props.onItemClick(item);
        });
    }

    handelToggleClose() {
        this.setState({
            isSearch: false
        });
    }

    render() {
        return (
            <div className="async-input-box">
                <XToggle className="async-input-toggle" onClose={this.handelToggleClose.bind(this)}>
                    <XToggle.Top className="x-asyncinput-top">
                        <XInput
                            placeholder={this.props.placeholder || '请输入'}
                            value={this.state.inputValue}
                            onChange={this.onSearch.bind(this)}
                            onClick={this.onInputClick.bind(this)}
                            size={this.props.size}
                        />
                        {
                            this.state.inputValue !== '' && <i type="close-b" className="x-cas-clear-icon"
                                                               onClick={this.clearSearch.bind(this)}/>
                        }
                    </XToggle.Top>
                    <XToggle.Box className="x-asyncinput-box">
                        {
                            this.state.isSearch ?
                                <div className="x-cas-searchlist">
                                    {
                                        this.state.resList.length > 0 ?
                                            <ul className="x-cas-list">
                                                {
                                                    this.state.resList.map((sItem, sIndex) => {
                                                        return (
                                                            <li key={`searchItem_${sIndex}`}
                                                                onClick={this.searchItemClick.bind(this, sItem)}>{sItem.label}
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                            :
                                            <span>{this.state.searchTips}</span>
                                    }
                                </div>
                                : ''
                        }
                    </XToggle.Box>
                </XToggle>
            </div>
        );
    }
}
