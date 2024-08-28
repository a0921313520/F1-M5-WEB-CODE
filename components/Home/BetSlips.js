//component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

const BetSlips = () => {
    return (
        <div className="mx-4 mt-4 hidden md:block md:w-[20%]">
            <div className="min-h-[468px] overflow-hidden rounded-lg">
                <div className="bg-white py-4 text-center text-xl font-semibold">
                    Bet Slips
                </div>
                <Tabs className="min-h-[412px]" defaultValue="Open">
                    <TabsList className="flex items-center justify-center rounded-none bg-transparent bg-white px-0 pb-0">
                        <TabsTrigger
                            key={"Open"}
                            value={"Open"}
                            className="
                  relative w-full text-lg 
                  font-normal 
                  after:absolute 
                  after:bottom-0 
                  after:left-1/4 
                  after:h-0.5
                  after:w-1/2
                  after:scale-x-0 
                  after:bg-primary 
                  after:content-[''] 
                  data-[state=active]:rounded-none 
                  data-[state=active]:bg-transparent 
                  data-[state=active]:text-lg 
                  data-[state=active]:text-primary 
                  data-[state=active]:shadow-none 
                  data-[state=active]:after:scale-x-75
                "
                        >
                            Open
                        </TabsTrigger>
                        <TabsTrigger
                            key={"Settled"}
                            value={"Settled"}
                            className="
                  relative w-full text-lg 
                  font-normal 
                  after:absolute 
                  after:bottom-0 
                  after:left-1/4 
                  after:h-0.5
                  after:w-1/2
                  after:scale-x-0 
                  after:bg-primary 
                  after:content-[''] 
                  data-[state=active]:rounded-none 
                  data-[state=active]:bg-transparent 
                  data-[state=active]:text-lg 
                  data-[state=active]:text-primary 
                  data-[state=active]:shadow-none 
                  data-[state=active]:after:scale-x-95
                "
                        >
                            Settled
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center justify-between bg-bgDarkGray p-4">
                        <div className="size-6" />
                        <div className="font-semibold">All</div>
                        <img
                            className="cursor-pointer"
                            src="/img/icon/icon_filter.svg"
                            alt="filter icon"
                        />
                    </div>
                    <TabsContent
                        value="Open"
                        className="min-h-[320px] bg-bgDarkGray"
                    >
                        <div className="flex flex-col items-center">
                            <img
                                className="size-[180px]"
                                src="/img/homePage/no-bank-card.png"
                                alt="no open bets"
                            />
                            <div className="text-2xl font-semibold text-black">
                                No Open bets
                            </div>
                            <div className="text-md text-gray1">
                                Select odds to place a bet
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent
                        className="min-h-[320px] bg-bgDarkGray"
                        value="Settled"
                    >
                        <div className="flex flex-col items-center">
                            <img
                                className="size-[180px]"
                                src="/img/homePage/no-bank-card.png"
                                alt="no open bets"
                            />
                            <div className="text-2xl font-semibold text-black">
                                No Settled bets
                            </div>
                            <div className="text-md text-gray1">
                                Select odds to place a bet
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default BetSlips;
