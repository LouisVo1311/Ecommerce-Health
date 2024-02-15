import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Text,
} from "recharts";

export const DateRevenueChart = ({ data }) => {
    const chartWidth = Math.max(600, data.length * 20);

    return (
        <div>
            <Text
                x={chartWidth / 2}
                y={20}
                width={chartWidth}
                textAnchor='middle'
                style={{ fontSize: "2.5rem", fontWeight: "600" }}>
                Biểu Đồ Doanh Thu Tháng 01/2024
            </Text>
            <BarChart
                width={chartWidth}
                height={400}
                data={data}
                margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                    dataKey='date'
                    tickFormatter={(value) => new Date(value).getDate()}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey='revenue'
                    name='Số Tiền'
                    fill='#8884d8'
                    barSize={20}
                />
            </BarChart>
        </div>
    );
};

export const MonthRevenueChart = ({ data }) => {
    const chartWidth = Math.max(600, data.length * 20);

    return (
        <div>
            <Text
                x={chartWidth / 2}
                y={20}
                width={chartWidth}
                textAnchor='middle'
                style={{ fontSize: "2.5rem", fontWeight: "600" }}>
                Biểu Đồ Doanh Thu Năm 2024
            </Text>
            <BarChart
                width={chartWidth}
                height={400}
                data={data}
                margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='monthYear' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey='revenue'
                    name='Số Tiền'
                    fill='#8884d8'
                    barSize={20}
                />
            </BarChart>
        </div>
    );
};
