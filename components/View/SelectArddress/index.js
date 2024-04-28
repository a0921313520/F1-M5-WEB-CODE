import React, { Component } from "react";
import Router from "next/router";
import Swiper from "swiper";
import { Row, Col, Select, message, Option, Icon } from "antd";
import { BsChevronDown } from "react-icons/bs";
import classNames from "classnames";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { translate } from "$ACTIONS/Translate";
export default class AreaSelection extends Component {
    constructor(props) {
        super(props);
            this.state = {
            // value: this.props.datavalue, //array
            updatedDataValue: {
                province: this.props.datavalue[0],
                city: this.props.datavalue[1],
                district: this.props.datavalue[2],
            },
            show: this.props.show,
            activeIndex: [0, 0, 0], //回显时候的默认数据
            provinces: [], //省份
            citys: [], //城市
            districts: [], //区县
            selectedProvinceId: -1,
            selectedCityId: -1,
            selectedDistrictId: -1,
        };
    }
    // initArea = async () => {
    //异步方法  获取省份 - 根据省份查城市 - 根据城市查区域
    //因为选中的数据为 [北京市,北京市,东城区] ,所以回显数据时要根据名称去匹配对应的id，name和index

    // const self = this;

    // //定义通用的swiper配置
    // const options = {
    //     direction: 'vertical',
    //     speed: 300, //切换速度
    //     width: 130,
    //     spaceBetween: 0, //间距
    //     height: 100, // slide 高度,必要，否则会有滑动偏差问题
    //     slidesPerView: 3, //网格分布3个 https://www.swiper.com.vn/api/grid/24.html
    //     centeredSlides: true, //居中
    //     resistance: true, //边缘抵抗
    //     observer: true, //修改swiper自己或子元素时，自动初始化swiper 不加有滑动失效问题
    //     observeParents: true //修改swiper的父元素时，自动初始化swiper 不加有滑动失效问题
    // };

    //获取省份
    // message.loading();

    // get(ApiPort.GetProvinces).then((res) => {
    //     if (res) {
    //         this.setState({
    //             provinces: res.result
    //         });
    //         // new Swiper('#swiper1', provinces);
    //     }
    // });

    // const val = self.state.activeIndex;

    // 省份配置
    // const provinces = {
    //     ...options,
    //     initialSlide: val[0] && val[0].index, //默认显示的下标位置
    //     on: {
    //         //初始化时候执行 只执行一次
    //         init: function () {
    //             let { provinces, value } = self.state;
    //             let { name, id } = provinces[this.activeIndex];
    //             let arr = [...value];
    //             arr[0] = { name: name, id: id };
    //             self.setState({ value: arr });
    //             get(ApiPort.GetDistricts + `&provinceId=${id}`).then((res) => {
    //                 self.setState({
    //                     citys: res.result
    //                 });
    //                 new Swiper('#swiper2', citys);
    //             });
    //         },
    //         //切换的时候执行
    //         slideChange: function () {
    //             let { provinces, value } = self.state;
    //             let { name, id } = provinces[this.activeIndex];
    //             let arr = [...value];
    //             arr[0] = { name: name, id: id };
    //             self.setState({ value: arr });
    //             setTimeout(() => {
    //                 get(ApiPort.GetDistricts + `&provinceId=${id}`).then((res) => {
    //                     self.setState({
    //                         citys: res.result
    //                     });
    //                     new Swiper('#swiper2', citys);
    //                 });
    //             }, 0);
    //         }
    //     }
    // };

    //城市配置
    // const citys = {
    //     ...options,
    //     initialSlide: val[1] && val[1].index,
    //     on: {
    //         init: function () {
    //             let { citys, value } = self.state;
    //             let { name, id } = citys[this.activeIndex];
    //             let arr = [...value];
    //             arr[1] = { name: name, id: id };
    //             self.setState({ value: arr });
    //             message.loading();
    //             get(ApiPort.GetTowns + `&districtId=${id}`).then((res) => {
    //                 self.setState({
    //                     districts: res.result
    //                 });
    //                 new Swiper('#swiper3', districts);
    //                 message.destroy();
    //             });
    //         },
    //         slideChange: function () {
    //             let { citys, value } = self.state;
    //             let { name, id } = citys[this.activeIndex];
    //             let arr = [...value];
    //             arr[1] = { name: name, id: id };
    //             self.setState({ value: arr });
    //             setTimeout(() => {
    //                 message.loading();
    //                 get(ApiPort.GetTowns + `&districtId=${id}`).then((res) => {
    //                     self.setState({
    //                         districts: res.result
    //                     });
    //                     new Swiper('#swiper3', districts);
    //                     message.destroy();
    //                 });
    //             }, 0);
    //         }
    //     }
    // };

    //地区配置
    // const districts = {
    //     ...options,
    //     initialSlide: val[2] && val[2].index,
    //     on: {
    //         init: function () {
    //             let { districts, value } = self.state;
    //             let { name, id } = districts[this.activeIndex];
    //             let arr = [...value];
    //             arr[2] = { name: name, id: id };
    //             self.setState({ value: arr });
    //         },
    //         slideChange: function () {
    //             let { districts, value } = self.state;
    //             let { name, id } = districts[this.activeIndex];
    //             let arr = [...value];
    //             arr[2] = { name: name, id: id };
    //             self.setState({ value: arr });
    //         }
    //     }
    // };
    // };

    componentDidMount() {
        this.setState({
            loading: true,
        });
        get(ApiPort.GetProvinces).then((res) => {
            if (res) {
                this.setState({
                    provinces: res.result,
                });
            }
            this.setState({
                loading: false,
            });
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.selectedProvinceId != this.state.selectedProvinceId) {
            this.setState({
                loading: true,
            });
            get(
                ApiPort.GetDistricts +
                    `&provinceId=${this.state.selectedProvinceId}`
            ).then((res) => {
                this.setState({
                    citys: res.result,
                });
                this.setState({
                    loading: false,
                });
            });
        }
        if (prevState.selectedCityId != this.state.selectedCityId) {
            this.setState({
                loading: true,
            });
            get(
                ApiPort.GetTowns + `&districtId=${this.state.selectedCityId}`
            ).then((res) => {
                this.setState({
                    districts: res.result,
                });
                this.setState({
                    loading: false,
                });
            });
        }
        if(prevProps.type !== this.props.type && this.props.type){
            this.setState({
                updatedDataValue: {
                    province: this.props.datavalue[0],
                    city: this.props.datavalue[1],
                    district: this.props.datavalue[2],
                },
            })
        }
    };

    changeSelect = (type, arr, value) => {
        const selectedId = arr.filter((p) => p.name === value)[0].id;

        if (type === "province") {
            this.setState({
                selectedProvinceId: selectedId,
                selectedProvince: value,
            });

            const newData = { id: selectedId, name: value };

            this.setState((prevState) => {
                const prevUpdatedDataValue = prevState.updatedDataValue;
                let newUpdatedData;

                if (prevUpdatedDataValue.city) {
                    newUpdatedData = {
                        // since a new province is selected, both city and district have to be reselected as well
                        province: newData,
                        city: null,
                        district: null,
                    };

                    this.props.onChange(newUpdatedData); // return updated datavalue back to parent component (Detail page)

                    return {
                        updatedDataValue: newUpdatedData,
                    };
                }

                newUpdatedData = {
                    ...prevState.updatedDataValue,
                    province: newData,
                };

                this.props.onChange(newUpdatedData);

                return {
                    updatedDataValue: newUpdatedData,
                };
            });
        }

        if (type === "city") {
            this.setState({ selectedCityId: selectedId, selectedCity: value });

            const newData = { id: selectedId, name: value };

            this.setState((prevState) => {
                const prevUpdatedDataValue = prevState.updatedDataValue;
                let newUpdatedData;

                if (prevUpdatedDataValue.district) {
                    newUpdatedData = {
                        // since a new city is selected, district had to be reselected as well
                        ...prevState.updatedDataValue,
                        city: newData,
                        district: null,
                    };

                    this.props.onChange(newUpdatedData);

                    return {
                        updatedDataValue: newUpdatedData,
                    };
                }

                newUpdatedData = {
                    ...prevState.updatedDataValue,
                    city: newData,
                };

                this.props.onChange(newUpdatedData);

                return {
                    updatedDataValue: newUpdatedData,
                };
            });
        }

        if (type === "district") {
            this.setState({
                selectedDistrictId: selectedId,
                selectedDistrict: value,
            });

            const newData = { id: selectedId, name: value };

            this.setState((prevState) => {
                const newUpdatedData = {
                    ...prevState.updatedDataValue,
                    district: newData,
                };

                this.props.onChange(newUpdatedData);

                return {
                    updatedDataValue: newUpdatedData,
                };
            });
        }
    };

    render() {
        const { 
            provinces, citys, districts, updatedDataValue, loading 
        } =
        this.state;
        console.log("🚀 ~ file: index.js:318 ~ AreaSelection ~ render ~ updatedDataValue:", updatedDataValue)
        const { type } = this.props;

        return (
            <React.Fragment>
                <div
                    className={this.props.className}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                    }}
                    id = "select-item"
                >
                    <Select
                        style={{ width: "107px", height: "45px" }}
                        value={
                            updatedDataValue.province
                                ? updatedDataValue.province.name
                                : translate("省/郡")
                        }
                        onChange={(e) => {
                            this.changeSelect("province", provinces, e);
                        }}
                        size={"large"}
                        loading={loading}
                        getPopupContainer={() =>
                            document.getElementById("select-item")
                        }
                    >
                        {provinces.map((province) => (
                            <Select.Option key={province.name}>
                                {province.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        style={{ width: "107px", height: "45px" }}
                        value={
                            updatedDataValue.city
                                ? updatedDataValue.city.name
                                : translate("市/区")
                        }
                        disabled={
                            !updatedDataValue.province
                        }
                        onChange={(e) => {
                            this.changeSelect("city", citys, e);
                        }}
                        size={"large"}
                        loading={loading}
                        getPopupContainer={() =>
                            document.getElementById("select-item")
                        }
                    >
                        {citys.map((city) => (
                            <Select.Option key={city.name}>
                                {city.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        style={{ width: "107px", height: "45px" }}
                        value={
                            updatedDataValue.district
                                ? updatedDataValue.district.name
                                : translate("县/区")
                        }
                        disabled={!updatedDataValue.city}
                        onChange={(e) => {
                            this.changeSelect("district", districts, e);
                        }}
                        size={"large"}
                        loading={loading}
                        getPopupContainer={() =>
                            document.getElementById("select-item")
                        }
                    >
                        {districts.map((district) => (
                            <Select.Option key={district.name}>
                                {district.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </React.Fragment>
        );
    }
}
