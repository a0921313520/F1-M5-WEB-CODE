/*
 * @Author: Alan
 * @Date: 2023-01-31 00:10:16
 * @LastEditors: Alan
 * @LastEditTime: 2023-03-03 17:00:04
 * @Description: 老虎机
 * @FilePath: \F1-M1-WEB-Code\pages\cn\Games\InstantGames\lobby\index.js
 */
import { useState, useEffect } from "react";
import Layout from "@/Layout";
import { useRouter } from "next/router";
import GameList from "@/Games/lobby";
import GameIfream from "@/Games/iframe";
import Announcement from "@/Announcement";
import GameStatic from "$DATA/game.static";

const gameProviderMap = [
    {
        code: "Sportsbook",
        providers: ["OWS", "CML", "IPSB", "SBT", "VTG"],
    },
    {
        code: "ESports",
        providers: ["TFG", "IPES"],
    },
    {
        code: "InstantGames",
        providers: ["SPR", "AVIATOR"],
    },
    {
        code: "LiveCasino",
        providers: [
            "WEC",
            "GPI",
            "EVO",
            "SXY",
            "SAL",
            "NLE",
            "AGL",
            "WMC",
            "TG",
            "gamelist",
        ],
    },
    {
        code: "Slot",
        providers: [
            "TG",
            "SPX",
            "AMB",
            "PGS",
            "JKR",
            "MGP",
            "JIR",
            "SPG",
            "BSG",
            "JIF",
            "SWF",
            "CQG",
            "PNG",
            "IMOPT",
            "IMONET",
            "EVP",
            "HBN",
            "BNG",
            "NGS",
            "EVORT",
            "gamelist",
        ],
    },
    {
        code: "P2P",
        providers: ["TGP", "KPK", "JKR", "gamelist"],
    },
    {
        code: "KenoLottery",
        providers: ["SGW", "TCG", "GPK", "SLC", "gamelist"],
    },
];

export async function getStaticPaths() {
    const paths = gameProviderMap
        .reduce((acc, item) => {
            const singleGameTypeProviders = item.providers.map((provider) => {
                return {
                    params: {
                        productType: GameStatic.find(
                            (cate) => cate.providerName === item.code,
                        ).path,
                        gamelist: provider,
                    },
                };
            });
            acc.push(singleGameTypeProviders);
            return acc;
        }, [])
        .flat();
    return {
        fallback: false,
        paths,
    };
}
export async function getStaticProps(context) {
    return {
        props: { query: context.params },
    };
}

export default function GameListRouter() {
    const router = useRouter();
    const [isHoldonStartGame, setIsHoldonStartGame] = useState(true);
    const productType = router.query.productType;
    const gamelist = router.query.gamelist;
    const gameid = router.query.gameid;
    const selectedProduct = GameStatic.find((item) => item.path == productType);
    useEffect(() => {
        console.log("🚀 ~ GameListRouter ~ router:", router.query);
    }, [productType]);

    let content = "",
        components = <></>;
    if (gamelist === "gamelist") {
        content = "gamelist";
    } else {
        if (["Sportsbook", "ESports"].some((item) => item == productType)) {
            if (gamelist === "VTG") {
                content = "gamelist";
            } else {
                content = "opengame";
            }
        } else {
            if (gameid) {
                content = "opengame";
            } else {
                content = "gamelist";
            }
        }
    }

    switch (content) {
        case "gamelist":
            components = (
                <GameList
                    Routerpath={selectedProduct.providerName}
                    provider={gamelist}
                    key={JSON.stringify(router.query)}
                />
            );
            break;
        case "opengame":
            components = (
                <GameIfream
                    productCode={selectedProduct.providerName}
                    provider={gamelist}
                    key={JSON.stringify(router.query)}
                />
            );
            break;
        default:
            components = null;
    }
    return (
        <Layout
            title="FUN88"
            Keywords=""
            description=""
            status={1}
            key={productType}
        >
            {components}
            {/* 紧急公告弹窗 */}
            <Announcement
                optionType={selectedProduct.providerName}
                autoExecuteCancelFnWhenLoadedAndNotVisible={true}
                extraCancelFn={() => {
                    setIsHoldonStartGame(false);
                }}
            />
        </Layout>
    );
}
