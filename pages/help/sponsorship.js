import React from "react";
import Layout from "@/Layout";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { Carousel, Icon, Skeleton, Button } from "antd";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import { translate } from "$ACTIONS/Translate";
import { isWebPSupported } from "$ACTIONS/helper";
import { getStaticPropsFromStrapiSEOSetting } from '$DATA/seo';
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting('/help/sponsorship'); //參數帶本頁的路徑
}
const linkForMoreVids =
    "https://www.youtube.com/@funsportgame8887/";
const Sponsordata = [
    {
        title: translate("伊克尔·卡西利亚斯"),
        iconImagesUrl: "/vn/img/sponsor/Logo-Iker-1@2x.png",
        year: "2022-2023",
        className: "invert",
        style: {
            img: {
                width: "35px",
                height: "35px",
            },
        },
    },
    {
        title: translate("纽卡斯尔联足球俱乐部"),
        iconImagesUrl: "/vn/img/sponsor/logo_nufc@2x.png",
        year: "2017-2023",
        className: "",
        style: {},
    },
    {
        title: translate("托特纳姆热刺足球俱乐部"),
        iconImagesUrl: "/vn/img/sponsor/SPURS@2x.png",
        year: "2012-2023",
        className: "",
        style: {
            "navbtn-container": {
                gap: "0px",
            },
        },
    },
    {
        title: translate("OG战队 - 刀塔2"),
        iconImagesUrl: "/vn/img/sponsor/OG@2x.png",
        year: "2020-2022",
        className: "",
        style: {},
    },
    {
        title: translate("科比·布莱恩特"),
        iconImagesUrl: "/vn/img/sponsor/logo_kobe@2x.png",
        year: "2019",
        className: "",
        style: {},
    },
    {
        title: translate("伯恩利俱乐部"),
        iconImagesUrl: "/vn/img/sponsor/logo_burnley@2x.png",
        year: "2015",
        className: "",
        style: {},
    },
    {
        title: translate("史蒂夫·纳什"),
        iconImagesUrl: "/vn/img/sponsor/logo_steve@2x.png",
        year: "2014",
        className: "",
        style: {},
    },
    {
        title: translate("罗比·福勒桑德兰"),
        iconImagesUrl: "/vn/img/sponsor/logo_robbie@2x.png",
        year: "2014",
        className: "",
        style: {},
    },
];
const Carouseldata = [
    {
        id: 13573,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/Group 13573@2x.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("伊克尔·卡西利亚斯，FUN88 品牌大使"),
        title: translate("传奇门将，世界杯、欧洲杯、欧冠冠军"),
        content: (
            <div>
                {translate("我很高兴成为FUN88的形象大使。这是一个契合我的职业生涯和对足球的热情的品牌")}<br />
                {translate("这种组合将有助于观众获得更有趣的比赛体验。 与 Fun88 一起释放你的激情")}
            </div>
        ),
        otherImagesUrl: [
            `/vn/img/sponsor/Gallery_IKER-1.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_IKER-2.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_IKER-3.${isWebPSupported() ? "webp" : "jpg"}`,
        ],
        redirect: "",
        contentOfRedirect: "",
    },
    {
        id: 13575,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/Group 13575@2x.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("纽卡斯尔联足球俱乐部(2)"),
        title: translate("官方球衣赞助商(2)"),
        content: translate("2017年至2023赛季英超联赛亚洲领先知名品牌FUN88。"),
        otherImagesUrl: [
            `/vn/img/sponsor/Gallery_NUFC-1.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_NUFC-2.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_NUFC-3.${isWebPSupported() ? "webp" : "jpg"}`,
        ],
        redirect:
            "https://www.nufc.co.uk/news/latest-news/fun88-becomes-newcastle-united-shirt-sponsor/ ",
        contentOfRedirect: translate("官方网站纽卡斯尔联"),
    },
    {
        id: 13576,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/Group 13576@2x.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("托特纳姆热刺足球俱乐部(2)"),
        title: translate("自 2012 年起成为亚洲官方博彩合作伙伴。"),
        content: translate("连续10年引领世界创造足球传奇。")
        ,
        otherImagesUrl: [
            `/vn/img/sponsor/Gallery_SPURS-1.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_SPURS-2.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_SPURS-3.${isWebPSupported() ? "webp" : "jpg"}`,
        ],
        redirect:
            "https://www.tottenhamhotspur.com/may-article-import/2018/tottenham-hotspur-extends-relationship-with-fun88/",
        contentOfRedirect: translate("托特纳姆热刺足球俱乐部官方网站"),
    },
    {
        id: 13580,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/OG - Dota 2.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("电子竞技队 OG - Dota 2"),
        title: translate("2020-2022 年官方国际博彩合作伙伴"),
        content: translate("让电子竞技粉丝更加紧密地联系在一起。"),
        otherImagesUrl: [],
        redirect: "",
        contentOfRedirect: translate("Team OG 官方网站 - Dota 2"),
    },
    {
        id: 13574,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/Group 13574@2x.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("科比·布莱恩特，NBA 篮球传奇人物"),
        title: translate("与 FUN88 一起梦想成真"),
        content: translate("科比表示：“我真的很高兴有机会与FUN88合作，最让我兴奋的是有机会传达“让梦想成真”的信息"),
        otherImagesUrl: [
            `/vn/img/sponsor/Gallery_KOBE-1.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_KOBE-2.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_KOBE-3.${isWebPSupported() ? "webp" : "jpg"}`,
        ],
        redirect: "",
        contentOfRedirect: "",
    },
    {
        id: 13577,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/burnley.${isWebPSupported() ? "webp" : "png"}`,
        name: translate("伯恩利足球俱乐部"),
        title: translate("伯恩利足球俱乐部官方球衣赞助商"),
        content: translate("伯恩利足球俱乐部与FUN88合作后，取得了不俗的成绩，以93分的总分夺得冠军，这证实了两个品牌强强联手，引领在线体育行业渗透到国际市场。"),
        otherImagesUrl: [
            `/vn/img/sponsor/Gallery_BURNLEY-1.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_BURNLEY-2.${isWebPSupported() ? "webp" : "jpg"}`,
            `/vn/img/sponsor/Gallery_BURNLEY-3.${isWebPSupported() ? "webp" : "jpg"}`,
        ],
        redirect: "",
        contentOfRedirect: translate("伯恩利俱乐部官方网站"),
    },
    {
        id: 13578,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/Steve Nash.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("史蒂夫·纳什"),
        title: translate("2次 MVP NBA 名人堂成员"),
        content: translate("轮到你来解锁成为FUN88会员的乐趣了"),
        otherImagesUrl: [],
        redirect: "",
        contentOfRedirect: "",
    },
    {
        id: 13579,
        style: {},
        bannerImageUrl: `/vn/img/sponsor/Robbie Fowler.${isWebPSupported() ? "webp" : "jpg"}`,
        name: translate("罗比·福勒桑德兰"),
        title: translate("利物浦传奇"),
        content: translate("适合不同类型游戏的最佳平台"),
        otherImagesUrl: [],
        redirect: "",
        contentOfRedirect: "",
    },
];

export class Carouselbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            indexOfCurrentSponsorPage: this.props.index,
        };
        this.sponsorCarousel = React.createRef();
    }

    onChange(a, b, c) {
        console.log(a, b, c);
    }

    // ImageView() {
    //   return (
    //     <PhotoProvider>
    //       {this.props.Carouseldata.otherImagesUrl != "" &&
    //         this.props.Carouseldata.otherImagesUrl.map((item, index) => (
    //           <PhotoConsumer key={index} src={item} intro={item}>
    //             <div className="small_box">
    //               <div className="change_big">点击查看大图</div>
    //               <img
    //                 src={item}
    //                 alt=""
    //                 style={{ width: "140px", height: "90px" }}
    //               />
    //             </div>
    //           </PhotoConsumer>
    //         ))}
    //     </PhotoProvider>
    //   );
    // }

    ImageView(urls) {
        return (
            <PhotoProvider>
                {urls.length != 0 &&
                    urls.map((item, index) => (
                        <PhotoConsumer key={index} src={item}>
                            <div className="small_box">
                                <div className="change_big">view</div>
                                <img
                                    src={item}
                                    alt=""
                                    style={{ width: "140px", height: "90px" }}
                                />
                            </div>
                        </PhotoConsumer>
                    ))}
            </PhotoProvider>
        );
    }

    render() {
        // const { Carouseldata } = this.props;
        const { indexOfCurrentSponsorPage } = this.state;
        const data = Carouseldata[indexOfCurrentSponsorPage];

        return (
            <div>
                <Carousel afterChange={() => this.onChange} ref={this.sponsorCarousel}>
                    <div>
                        {/* 不带整屏banner特殊样式的数据*/}
                        {/* {Carouseldata.id != 9999 ? ( */}

                        <div className="content" key={data.id}>
                            <div className="banner_left">
                                <img src={data.bannerImageUrl} />
                            </div>
                            <div className="banner_right">
                                <div
                                    className="banner_right__sponsorHeader"
                                    style={data.style.header}
                                >
                                    <div className="banner_right__sponsorHeader-name">
                                        {data.name}
                                    </div>
                                    <div className="banner_right__sponsorHeader-title">
                                        {data.title}
                                    </div>
                                </div>
                                <div
                                    className="banner_right__sponsorBody"
                                    style={data.style.content}
                                >
                                    <div
                                        className={
                                            "banner_right__sponsorBody-content"
                                        }
                                    // dangerouslySetInnerHTML={{ __html: data.content }}
                                    >
                                        {data.content}
                                    </div>
                                </div>
                                {data.redirect.trim().length != 0 && (
                                    <Button
                                        className="redirect-to-sponsor"
                                        href={data.redirect}
                                        target="_blank"
                                    >
                                        {data.contentOfRedirect}
                                    </Button>
                                )}
                                <div className="small_banner">
                                    {this.ImageView(data.otherImagesUrl)}
                                </div>
                                {/* <p className="see_all">{this.props.Carouseldata.otherImagesUrl != '' && '查看全部>>'}</p> */}
                            </div>
                        </div>
                    </div>
                </Carousel>

                {/* {Carouseldata.map((sponsor) => <div className="content" key={sponsor.id}>
              <div className="banner_left">
                <img
                  src={sponsor.bannerImageUrl}
                />
              </div>
              <div className="banner_right">
                <div className="banner_right__sponsorHeader">
                  <div className="banner_right__sponsorHeader-name" dangerouslySetInnerHTML={{ __html: sponsor.name }}/>
                  <div className="banner_right__sponsorHeader-title" dangerouslySetInnerHTML={{ __html: sponsor.title }}/>
                </div>
                <div className="banner_right__sponsorBody">
                  <div
                    className="banner_right__sponsorBody-content"
                    dangerouslySetInnerHTML={{ __html: sponsor.content }}
                  />
                </div>
                <div className="small_banner">{this.ImageView(sponsor.otherImagesUrl)}</div>
              </div>
            </div>)} */}

                {/* ) : ( */}
                {/* <div className="content" key={Carouseldata.id}>
                <div className="special_box">
                  <img src={Carouseldata.bannerImageUrl} />
                  <div className="special-content">
                    <div className="special_left">
                      <div
                        style={{ minHeight: "250px" }}
                        dangerouslySetInnerHTML={{
                          __html: Carouseldata.content,
                        }}
                      />
                      <div className="small_banner">{this.ImageView()}</div> */}
                {/* <p className="see_all">
												{this.props.Carouseldata.otherImagesUrl != '' && '查看全部>>'}
											</p> */}
                {/* </div>
                    <div className="special_right">
                      <div
                        style={{ minHeight: "250px" }}
                        dangerouslySetInnerHTML={{
                          __html: Carouseldata.content,
                        }}
                      />
                      <div className="small_banner">{this.ImageView()}</div> */}
                {/* <p className="see_all">
												{this.props.Carouseldata.otherImagesUrl != '' && '查看全部>>'}
											</p> */}
                {/* </div>
                  </div>
                </div>
              </div> */}
                {/* )} */}
                {/* <div className="next_banner">
					<div className="n_left" onClick={() => this.sponsorCarousel.current.next()}>
						<Icon type="left" />
					</div>
					<div className="n_right" onClick={() => this.sponsorCarousel.current.prev()}>
						<Icon type="right" />
					</div>
				</div> */}
            </div>
        );
    }
}
import Router from "next/router";

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.sponsortopRef = React.createRef();
        this.state = {
            topactive: 0,
            xCoordOfSponsortop: 0,
            distance: 0,
        };
    }

    componentDidMount() {
        // this.Sponsorshipdata();
        const sponsortop = this.sponsortopRef.current;
        const distance =
            sponsortop.scrollWidth - sponsortop.getBoundingClientRect().width;

        this.setState({ distance });
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("sponsorship");
    }

    Changetopnav(key) {
        this.setState({
            topactive: key,
        });
    }

    // Sponsorshipdata() {
    //   get(ApiPort.Sponsorship).then((res) => {
    //     if (res) {
    //       this.setState({
    //         Sponsordata: res,
    //       });
    //       if (Router.router.query && Router.router.query.id) {
    //         let index = res.findIndex((x) => x.id == Router.router.query.id);
    //         this.setState({
    //           topactive: index,
    //         });
    //       }
    //     }
    //   });
    // }

    slide = (direction) => {
        const sponsortop = this.sponsortopRef.current;
        const { xCoordOfSponsortop, distance } = this.state;
        const oneClick = 218 + 20; // tab width + gap = 238
        let slidedDistance;

        if (direction === "next") {
            slidedDistance = xCoordOfSponsortop - oneClick;
            if (slidedDistance * -1 >= distance) {
                // negative to positive
                slidedDistance = distance * -1; // change back to negatice
            }
        }
        if (direction === "prev") {
            slidedDistance = xCoordOfSponsortop + oneClick;
            if (slidedDistance >= 0) {
                slidedDistance = 0;
            }
        }

        this.setState({ xCoordOfSponsortop: slidedDistance });
        sponsortop.style.left = slidedDistance + "px";
    };

    render() {
        const { navlist, topactive, xCoordOfSponsortop, distance } = this.state;
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                seoData={this.props.seoData}
            >
                <div className="common-distance-wrap">
                    <div className="common-distance Sponsorbox">
                        {/* {Sponsordata == "" && <Skeleton active paragraph={{ rows: 1 }} />} */}
                        <div className="top-container">
                            {xCoordOfSponsortop != 0 && (
                                <Button
                                    className="Sponsortop-left-arrow-btn"
                                    onClick={this.slide.bind(this, "prev")}
                                >
                                    <img src={`${process.env.BASE_PATH}/img/sponsor/arrow-left.svg`} />
                                </Button>
                            )}
                            <div className="Sponsortop">
                                <div className="Sponsortop-container">
                                    <ul ref={this.sponsortopRef}>
                                        {Sponsordata.map((item, index) => {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        this.setState({
                                                            topactive: index,
                                                        });
                                                    }}
                                                    key={index}
                                                >
                                                    <div
                                                        className={
                                                            topactive == index
                                                                ? "active navbtn"
                                                                : `navbtn ${item.className}`
                                                        }
                                                    >
                                                        <div
                                                            className="navbtn-container"
                                                            style={
                                                                item.style[
                                                                "navbtn-container"
                                                                ]
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    item.iconImagesUrl
                                                                    // topactive == index ? item.iconImagesUrl[0] : item.iconImagesUrl[1]
                                                                }
                                                                style={
                                                                    item.style
                                                                        .img
                                                                }
                                                            />
                                                            <div className="navbtn-content">
                                                                <div className="navbtn-content__year">
                                                                    {item.year}
                                                                </div>
                                                                <div className="navbtn-content__title">
                                                                    {item.title}
                                                                </div>
                                                            </div>
                                                            {/* <div className="left">
                                {index == 2 && (
                                  <img
                                    src={navlist[1].icon}
                                    style={{
                                      width: '25px',
                                      marginRight: '5px'
                                    }}
                                  />
                                )}
                                
                              </div> */}
                                                            {/* <div className="right">
                                <div>{item.date}</div>
                                <div>{item.txt}</div>
                              </div> */}
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            {xCoordOfSponsortop * -1 < distance && (
                                <Button
                                    className="Sponsortop-right-arrow-btn"
                                    onClick={this.slide.bind(this, "next")}
                                >
                                    <img src={`${process.env.BASE_PATH}/img/sponsor/arrow-right.svg`} />
                                </Button>
                            )}
                        </div>
                        <div className="Sponsorbottom">
                            {Sponsordata != "" &&
                                Sponsordata.map((item, index) => {
                                    return (
                                        topactive == index && (
                                            <Carouselbox
                                                Carouseldata={item}
                                                keys={index}
                                                key={index}
                                                index={index}
                                            />
                                        )
                                    );
                                })}
                        </div>
                    </div>
                    <Button
                        className="more-vids-btn"
                        href={linkForMoreVids}
                        target="_blank"
                    >
                        <div className="btn-content-container">
                            <span>{translate("观看更多视频")}</span>
                        </div>
                    </Button>
                </div>
            </Layout>
        );
    }
}
