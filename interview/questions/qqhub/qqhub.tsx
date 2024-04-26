import React, { useRef, useMemo, useReducer } from "react";

type featType = "color" | "storage" | "version";
type colorType = "white" | "blue" | "black";
type storageType = "128" | "256" | "512";
type versionType = "standard" | "set";

interface IStockItem {
    color: colorType;
    storage: storageType;
    version: versionType;
    count: number;
}

const features: featType[] = ["color", "storage", "version"];
const stockSheet: IStockItem[] = [
    {
        color: "white",
        storage: "128",
        version: "standard",
        count: 12,
    },
    {
        color: "white",
        storage: "256",
        version: "standard",
        count: 3,
    },
    {
        color: "blue",
        storage: "128",
        version: "standard",
        count: 2,
    },
    {
        color: "blue",
        storage: "512",
        version: "standard",
        count: 2,
    },
    {
        color: "black",
        storage: "256",
        version: "standard",
        count: 33,
    },
    {
        color: "black",
        storage: "512",
        version: "standard",
        count: 23,
    },
    {
        color: "white",
        storage: "256",
        version: "set",
        count: 10,
    },
    {
        color: "black",
        storage: "128",
        version: "set",
        count: 10,
    },
    {
        color: "blue",
        storage: "512",
        version: "set",
        count: 6,
    },
];
const list = [
    {
        label: "颜色",
        value: "color",
        options: [
            {
                label: "白色",
                value: "white",
            },
            {
                label: "黑色",
                value: "black",
            },
            {
                label: "蓝色",
                value: "blue",
            },
        ],
    },
    {
        label: "内存",
        value: "storage",
        options: [
            {
                label: "128G",
                value: "128",
            },
            {
                label: "256G",
                value: "256",
            },
            {
                label: "512G",
                value: "512",
            },
        ],
    },
    {
        label: "版本",
        value: "version",
        options: [
            {
                label: "标准版",
                value: "standard",
            },
            {
                label: "套装",
                value: "set",
            },
        ],
    },
];

export default function SkuManage() {
    const [selectValues, setSelectValues] = useReducer((state, action) => ({ ...state, ...action }), {
        color: undefined,
        storage: undefined,
        version: undefined,
    });

    function onChange(key, value) {
        setSelectValues({ [key]: value });
    }
    return (
        <div className="sku-manage">
            {list.map((item) => {
                return (
                    <div
                        key={item.value}
                        style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}
                    >
                        <span>{item.label}: </span>
                        <div style={{ display: "flex", width: 200, justifyContent: "flex-start" }}>
                            {item.options.map((itemIn) => {
                                return (
                                    <Button
                                        key={itemIn.value}
                                        selectValues={selectValues}
                                        belongCategory={item.value}
                                        info={itemIn}
                                        onChange={onChange}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Button({ selectValues, belongCategory, info, onChange }) {
    const otherFeaturesRef = useRef(features.filter((itemFeat) => itemFeat !== belongCategory));

    const disabled = useMemo(() => {
        const otherData = stockSheet.filter((itemStock) => {
            let flag = true;

            for (const itemFeat of otherFeaturesRef.current) {
                if (selectValues[itemFeat] !== undefined) {
                    if (itemStock[itemFeat] !== selectValues[itemFeat]) {
                        flag = false;
                    }
                }
            }

            return flag;
        });

        return !otherData.some((item) => item[belongCategory] === info.value && item.count > 0);
    }, [selectValues]);

    return (
        <div
            style={{
                display: "inline-block",
                width: 60,
                lineHeight: "32px",
                cursor: disabled ? "not-allowed" : "pointer",
                marginRight: "10px",
                backgroundColor: disabled ? "#ccc" : "#fff",
                border: selectValues[belongCategory] === info.value ? "1px solid #f00" : "1px solid #ccc",
            }}
            onClick={() => {
                if (disabled) {
                    return;
                }
                onChange(belongCategory, selectValues[belongCategory] === info.value ? undefined : info.value);
            }}
        >
            {info.label}
        </div>
    );
}
