import React from 'react';

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div className="h-12 flex items-center justify-center mb-1">
        <div className="loadingspinner scale-[0.35] !m-0">
          <div id="square1"></div>
          <div id="square2"></div>
          <div id="square3"></div>
          <div id="square4"></div>
          <div id="square5"></div>
        </div>
      </div>
      <p className="text-gray-400 font-medium text-xs animate-pulse tracking-wide">{message}</p>
    </div>
  );
}
