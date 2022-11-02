import { CauTraLoi } from '@/src/views/app-thionline/typing';
import React from 'react';
import LuaChon from './LuaChon';

type DanhSachLuaChonProps = {
  dsCauTraLoi: CauTraLoi[];
  answereds: string[];
};

const backgroundColors = ['#18963a', '#1f5fad', '#a82e25', '#7024a6'];

const DanhSachLuaChon = (props: DanhSachLuaChonProps) => {
  return (
    <div>
      {props.dsCauTraLoi.map((cauTraLoi, index) => {
        const isDisabled = !!props.answereds.find(
          (answeredItem) => answeredItem === cauTraLoi.luaChon
        );
        return (
          <LuaChon
            key={index}
            value={cauTraLoi.luaChon}
            backgroundColor={backgroundColors[index % backgroundColors.length]}
            isDisabled={isDisabled}
          />
        );
      })}
    </div>
  );
};

export default DanhSachLuaChon;
