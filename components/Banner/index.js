import React, { useEffect } from "react";
import reduxStore from "./../../store/store";
import useBearStore from "../../zustand/zustandStore";

export default function Banner() {
    const { value, increment, decrement } = useBearStore();

    useEffect(() => {
        // log redux state
        console.log("Redux state:", reduxStore.getState());
    }, []);

    return (
        <div className="p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Zustand Counter</h1>
            <p className="text-lg mb-4">Value: {value}</p>
            <div className="space-x-2">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={increment}
                >
                    Increment
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={decrement}
                >
                    Decrement
                </button>
            </div>
        </div>
    );
}
