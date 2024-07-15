import React from "react";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { PopupBox } from "./PopupBox";
import sendFetch from "@utils/sendFetch";
import { twMerge } from "tailwind-merge";
import './style.css';
export const ProductCard = ({ item, direction = 'top', hoverable = false, className = "" }) => {

  const [isHovering, setHovering] = useState(false);
  const [data, setData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const popupRef = useRef(null);
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
      className={twMerge("relative h-[3.75rem] flex items-center p-[0.5rem] rounded-lg ana-product cursor-pointer",
        className
      )}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onTouchStart={onMouseEnter}
      onTouchEnd={onMouseLeave}
    >
      <div class="w-[2.75rem] h-[2.75rem] icon-box">
        <img
          src={item.icon}
          class={twMerge(
            item.product === "Kafka" || item.product === "MQTT"
              ? "w-[62%] h-[47%]"
              : item.product === "RocketMQ" || item.product === "MNS"
                ? "w-[50%] h-[50%]"
                : "w-[60%] h-[60%]"
          )}
        />
      </div>
      <div class="flex-1 text-center text-sm">
        {item.product}
      </div>
      {hoverable && (
        <div
          className="absolute z-10 shadow-md -mt-20 ml-2"
          style={{
            visibility: isHovering ? "visible" : "hidden",
            bottom: direction === 'top' ? '62px' : '',
            top: direction === 'top' ? '' : '142px',
            left: '-70%',
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
