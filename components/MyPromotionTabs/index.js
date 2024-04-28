import React from "react";
import { Radio } from "antd";
import AppliedHistory from "./AppliedHistory";
import FreePromotion from "./FreePromotion";
import { connect } from "react-redux";
import { translate } from "$ACTIONS/Translate";

class MyPromotionTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promotionsType: "1",
        };
        this.filterPromotionsType = this.filterPromotionsType.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.topTabIndex !== this.props.topTabIndex &&
            this.props.topTabIndex === "2"
        ) {
            this.setState({ promotionsType: "1" });
        }
    }

    filterPromotionsType(type) {
        this.setState({ promotionsType: type.target.value });
    }

    render() {
        return (
            <div className="my-promotion-container">
                <Radio.Group
                    className="my-promotion-filter-box"
                    defaultValue="1"
                    value={this.state.promotionsType}
                    onChange={this.filterPromotionsType}
                >
                    <Radio.Button value="1">{translate("已申请优惠")}</Radio.Button>
                    <Radio.Button value="2">{translate("免费投注")}</Radio.Button>
                </Radio.Group>

                {this.state.promotionsType === "1" ? (
                    <AppliedHistory />
                ) : (
                    <FreePromotion />
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        topTabIndex: state.promotion.topTabIndex,
    };
}

export default connect(mapStateToProps)(MyPromotionTabs);
