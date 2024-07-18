import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/Layout";
import GamesHome from "@/Games/Game-Page-2/index";
import GameHome from "@/Games/Game-Page-1/index";
import GameStatic from "$DATA/game.static";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";

export async function getStaticPaths() {
    return {
        paths: [
            { params: { productType: "the-thao" } },
            { params: { productType: "esports" } },
            { params: { productType: "live-casino" } },
            { params: { productType: "P2P" } },
            { params: { productType: "xo-so" } },
            { params: { productType: "slots" } },
            { params: { productType: "arcade-games" } },
        ],
        fallback: false,
    };
}
export async function getStaticProps(context) {
    const seoPage = `/games/${context.params.productType}`;
    return await getStaticPropsFromStrapiSEOSetting(seoPage); //參數帶本頁的路徑
}

export default function ProductLobby({ seoData }) {
    const router = useRouter();
    const productType = router.query.productType;
    const selectedProduct = GameStatic.find((item) => item.path == productType);
    const lobbyWithCategory = [
        "LiveCasino",
        "P2P",
        "KenoLottery",
        "Slot",
        "InstantGames",
    ];
    const lobbyOnlyProduct = ["Sportsbook", "ESports"];
    useEffect(() => {
        console.log(
            "selectedProduct.providerName:",
            selectedProduct.providerName,
        );
    }, [productType]);

    return (
        <Layout
            title="FUN88"
            Keywords=""
            description=""
            status={1}
            seoData={seoData}
            key={productType}
        >
            {lobbyWithCategory.includes(selectedProduct.providerName) && (
                <GamesHome Routertype={selectedProduct.providerName} />
            )}

            {lobbyOnlyProduct.includes(selectedProduct.providerName) && (
                <GameHome gameCatCode={selectedProduct.providerName} />
            )}
        </Layout>
    );
}
