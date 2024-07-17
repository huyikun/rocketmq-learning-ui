import React from "react";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { PopupBox } from "./PopupBox";
import sendFetch from "@utils/sendFetch";
import { twMerge } from "tailwind-merge";
import './style.css';
export const ServiceCard = ({ item, direction = 'top', hoverable = false }) => {

  const [isHovering, setHovering] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const [data, setData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const triggerRef = useRef(null);
  const popupRef = useRef(null);
  // const appContext = useContext(AppContext);
  const { hoverIcon = '', des = '', github = '', api = '', openSource = '', clound = '' } = item.hoverContent || {};
  const onMouseEnter = async () => {
    setHovering(true);
    // 只第一次请求一次
    if (!hasFetchedData) {
      setHovering(true);
      if (api) {
        const fetchedData = await sendFetch(api);
        setData(fetchedData);
      };
      setHasFetchedData(true); // 更新标志，表示数据已被获取
    }
  };
  const onMouseLeave = (event) => {
    //如果鼠标的坐标在弹窗上，不关闭
    const { clientX, clientY } = event;
    const popupRect = popupRef.current.getBoundingClientRect();
    const isOnPopup =
      clientX >= popupRect.left &&
      clientX <= popupRect.right &&
      clientY >= popupRect.top &&
      clientY <= popupRect.bottom;
    if (isOnPopup) {
      return;
    }
    setHovering(false);
  };

  return (
    <div
      className={twMerge("relative flex flex-col items-center pt-[0.8rem] pb-[0.7rem] rounded-xl service-item cursor-pointer",
        hoverable && isHovering && "service-hover"
      )}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onTouchStart={onMouseEnter}
      onTouchEnd={onMouseLeave}
    >
      <div className="w-[2.75rem] h-[2.5rem]">
        <img
          src={item.icon}
          className={twMerge(
            item.product === "Dubbo"
              ? "w-[58%] h-[80%]"
              : item.product === "Seata"
                ? "w-[96%] h-[30%] mt-[1rem]"
                : item.product === "Nacos"
                  ? "w-[86%] h-[48%] mt-[0.5rem]"
                  : item.product === "Sentinel"
                    ? "w-[83%] h-[85%]"
                    : item.product === "家电"
                      ? "w-[56%] h-[75%]"
                      : item.product === "手机"
                        ? "w-[50%] h-[80%]"
                        : "w-[65%] h-[70%]"
          )}
        />
      </div>
      <div className="h-4 text-center text-[0.625rem]">
        {item.product}
      </div>
      {hoverable && (
        <div
          className="absolute z-10 shadow-md -mt-20 ml-2"
          style={{
            visibility: isHovering ? "visible" : "hidden",
            bottom: direction === 'top' ? '95px' : '',
            top: direction === 'top' ? '' : '163px',
            left: '-10px'
          }}
          onMouseLeave={() => setHovering(false)}
          ref={popupRef}
        >
          <PopupBox hoverContent={item.hoverContent} product={item.product} direction={direction} data={data} />
        </div>
      )}
    </div>

  )
}
