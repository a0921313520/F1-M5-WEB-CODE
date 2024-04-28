/*
 * @Author: 
 * @Date: 2024-02-26
 * @LastEditors: 
 * @LastEditTime: 2024-02-26
 * @Description: 紧急公告
 * @FilePath: /F1-M3-WEB-Code/components/Announcement/index.js
 * These are the available optionType:
	1. Deposit = 1
	2. Withdrawal = 2
	3. Transfer = 3
	4. Sportsbook = 4
	5. Casino = 5
	6. Mahjong = 6
	7. Keno = 7
	8. IMSportsbook = 8
	9. IMCasino = 9
	10. Slot = 10
	11. Poker = 11
 */
import React from 'react';
import { Button, Modal, Radio, Checkbox } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { get } from '$ACTIONS/TlcRequest';
import { ApiPort } from '$ACTIONS/TLCAPI';
import { translate } from "$ACTIONS/Translate";

export default class Announcement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isChecked: false,
			value: '1',
			visible: false,
			data: []
		};
	}

	componentDidMount() {
		this.NewsList();
	}
	componentWillUnmount(){
        this.setState = ()=> false
    }
	NewsList() {
		if (!localStorage.getItem('access_token')) {
			return;
		}
		if (this.props.optionType) {
			console.log("🚀 ~ Announcement ~ NewsList ~ this.props.optionType:", this.props.optionType)
			let optionType = "";
			switch(this.props.optionType){
				case "InstantGames":
				case "LiveCasino":
				case "ESports":
					optionType = "Casino"
				break;
				case "KenoLottery":
					optionType = "Keno"
				break;
				case "P2P":
					optionType = "Poker"
				break;
				default:
					optionType = this.props.optionType;
			}
			let tag = localStorage.getItem(this.props.optionType + '_' + localStorage.getItem('memberCode'));
			get(ApiPort.getNews + `&optionType=${optionType}&IsGetLatest=true`)
				.then((res) => {
					if (res?.isSuccess &&  res.result && JSON.stringify(res.result) != '{}' ) {
						this.setState({
							data: res.result,
							visible: !tag ? true : false
						});
					}
			});
		}
	}

	onChangeRadio = () => {
		this.setState({
			isChecked: !this.state.isChecked
		});
		if (this.state.isChecked) {
			localStorage.removeItem(this.props.optionType + '_' + localStorage.getItem('memberCode'));
		} else {
			localStorage.setItem(this.props.optionType + '_' + localStorage.getItem('memberCode'), true);
		}
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};
	render() {
		const { isChecked, value, data, visible } = this.state;

		return (
			<React.Fragment>
				<Modal
					title={translate("重要通知")}
					centered={true}
					visible={visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={null}
					width={400}
					closable={false}
					maskClosable={false}
					className="modal-pubilc news-modal"
				>
					<div>
						<center className="title">
							<h3>{data && data.topic}</h3>
						</center>
						<div
							className="content"
							dangerouslySetInnerHTML={{
								__html: data && data.content
							}}
						/>
						<br/>
						<div className="footer">
							<Checkbox checked={isChecked} onChange={this.onChangeRadio}>
								{translate("不再显示")}
							</Checkbox>
							<div className='footer-btn'>
								<Button size="large" block onClick={this.handleCancel}>
									{translate("关闭")}
								</Button>
								<Button size="large" block type="primary" onClick={() => global.PopUpLiveChat()}>
									{translate("在线客服")}
								</Button>
							</div>
							
						</div>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}
