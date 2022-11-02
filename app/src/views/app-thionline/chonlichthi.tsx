/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { Button, List, Empty, Typography, Skeleton } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { LichThi } from './app-thionline';

interface ChonLichThiProps {
  dsLichThi: LichThi[];
  onVaoThi: (lichThi: LichThi) => void;
}

export const ChonLichThi: React.FC<ChonLichThiProps> = ({
  dsLichThi,
  onVaoThi,
}) => {
  const [time, setTimer] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {dsLichThi.length === 0 ? (
        <Empty />
      ) : (
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          dataSource={dsLichThi}
          renderItem={(lichThi: LichThi, index: number) => (
            <List.Item
              actions={[
                !!lichThi.daLam ? (
                  <Button type="dashed" danger>
                    Đã làm bài
                  </Button>
                ) : !moment().isBetween(
                    moment(lichThi.ngayGioThi),
                    moment(lichThi.ngayGioThiKetThuc)
                  ) ? (
                  <Button type="dashed" danger>
                    Ngoài giờ thi
                  </Button>
                ) : (
                  <Button onClick={() => onVaoThi(lichThi)}>Vào thi</Button>
                ),
              ]}
            >
              <Skeleton avatar title={false} loading={false} active>
                <List.Item.Meta
                  title={<div> {lichThi.tenDe} </div>}
                  description={
                    <Typography.Text>{`Thời gian: ${moment(
                      lichThi.ngayGioThi
                    ).format('DD/MM/YYYY HH:mm')} đến ${moment(
                      lichThi.ngayGioThiKetThuc
                    ).format('DD/MM/YYYY HH:mm')}.  Mã môn học: ${
                      lichThi.maMonHoc
                    } `}</Typography.Text>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
