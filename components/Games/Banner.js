import React from "react";
import { connect } from "react-redux";
import { getGameCategoryListAction } from "$STORE/thunk/gameThunk";
import { isWebPSupported } from "$ACTIONS/helper";

export class Gamesmaintop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isLoading && !this.props.isLoading) {
            this.CheckCategories();
        }
    }

    CheckCategories() {
        const data = this.props.categories.find(
            (item) =>
                this.props.Routertype.toLowerCase().indexOf(
                    item.code.toLowerCase(),
                ) !== -1,
        );
        if (data) {
            this.setState({
                data: [data],
            });
        } else {
            this.props.getCategoryList();
        }
    }
    render() {
        const { categories, Routertype } = this.props;
        const { data } = this.state;
        return (
            <div key={JSON.stringify(data)}>
                <div
                    className="top-banner"
                    style={{
                        background: `linear-gradient(#00a6ffb0 0%, #00A6FF 100%) 0% 0% no-repeat padding-box padding-box transparent`,
                    }}
                >
                    <img
                        src={`${process.env.BASE_PATH}/img/game/banner/${Routertype}.${isWebPSupported() ? "webp" : "jpg"}`}
                        style={{ height: 200 }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        isLoading: state.game.isLoading,
        categories: state.game.categories,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        getCategoryList: (categoryType) => {
            dispatch(getGameCategoryListAction(categoryType));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Gamesmaintop);
