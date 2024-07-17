import React from "react";
import { useState, useContext } from "preact/hooks";
import { twMerge } from "tailwind-merge";

export const PopupBox = ({ hoverContent, product, direction = 'top', data }) => {
  const { hoverIcon = '', des = '', github = '', api = '', openSource = '', clound = '' } = hoverContent || {};
  const [arrow, setArrow] = useState('');
  const { stargazers_count: startCount = 0, forks_count: forkCount = 0 } =
    data || { stargazers_count: 0, forks_count: 0 };

  if (direction === 'bottom') {
    // hover弹框在下面,箭头在上面
    setArrow("after:absolute after:bottom-full after:left-[40px] after:ml-[-5px] after:border-[5px] after:border-b-base-100 after:border-x-transparent after:border-t-transparent  after:content-['']")
  } else {
    // hover弹框在上面，箭头在下面
    setArrow("after:absolute after:top-full after:left-2/4 after:ml-[-5px] after:border-[5px] after:border-t-base-100 after:border-x-transparent after:border-b-transparent  after:content-['']")
  }
  return (
    <div
      className={`relative bg-[#2E3038] text-[#A3A6B3] pb-[1.5rem] px-[2rem] rounded-xl backdrop-opacity-96 w-[32.5rem] text-left`}
    >
      <div className="flex items-center border-b border-[#4C505D] mb-4 h-[4.25rem]">
        {hoverIcon ? <img src={hoverIcon} alt="logo"
          className={
            twMerge(
              "max-w-[204px]",
              product === "Higress" || product === "Sentinel" ?
                "h-7"
                :
                "h-5"
            )}

        /> :
          <div className="text-title text-xl">
            {product}
          </div>
        }
      </div>
      <div className="text-sm mb-[1.5rem] mt-[1.25rem]">{des}</div>
      {
        github &&
        <div className="mb-2 flex text-left">
          <div
            className="text-base mb-1 w-[9rem] text-[#C7C9D1]"
          >
            Github：
          </div>
          <div className="truncate flex-1">
            <a
              href={github}
              target="_blank"
              className="no-underline text-[#3D57DA]"
            >
              {github}
            </a>
            <div className="flex mt-1">
              <div
                className="flex items-center text-xs py-1 px-2 rounded-xl bg-[#4C505D] mr-[0.75rem]"
              >
                <svg
                  t="1711507787559"
                  className="icon w-4 h-4 mr-1"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5263"
                  width="200"
                  height="200"
                  fill="currentColor"
                >
                  <path
                    d="M960 384l-313.6-40.96L512 64 377.6 343.04 64 384l230.4 208.64L234.88 896 512 746.88 789.12 896l-59.52-303.36L960 384z"
                    p-id="5264"
                  ></path>
                </svg>
                <span>{startCount}</span>
              </div>
              <div
                className="flex items-center text-xs py-1 px-2 rounded-xl bg-[#4C505D]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  version="1.1"
                  width="16"
                  height="18"
                  viewBox="0 0 1024 1024"
                  className="icon w-4 h-4 mr-1"
                ><g>
                    <path
                      d="M384 160a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-64v128h192a64 64 0 0 1 64 64v64h64a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-192a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h64V576h-448v64h64a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-192a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h64V576a64 64 0 0 1 64-64h192V384h-64a32 32 0 0 1-32-32v-192zM448 320h128V192H448v128z m-256 384v128h128v-128H192z m512 0v128h128v-128h-128z"
                      fill="currentColor"
                      fill-opacity="1">
                    </path>
                  </g>
                </svg>
                <span>{forkCount}</span>
              </div>
            </div>
          </div>
        </div>
      }
      {
        openSource &&
        <div className="mb-2 flex text-left mt-[1.125rem]">
          <div
            className="text-base mb-1 w-[9rem] text-[#C7C9D1]"
          >
            开源官网：
          </div>
          <div className="truncate flex-1">
            <a
              href={openSource}
              target="_blank"
              className="no-underline text-[#3D57DA]"
            >
              {openSource}
            </a>
          </div>
        </div>
      }
      {
        clound &&
        <div className="mb-2 flex text-left mt-[1.125rem]">
          <div
            className="text-base mb-1 w-[9rem] text-[#C7C9D1]"
          >
            <span>云服务</span>
            <span className="text-xs">（开箱即用）</span>
            <span>：</span>
          </div>
          <div className="truncate flex-1">
            <a
              href={clound}
              target="_blank"
              className="no-underline text-[#3D57DA]"
            >
              {clound}
            </a>
          </div>
        </div>
      }
    </div>
  );
};
