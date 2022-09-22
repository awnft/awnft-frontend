import React, { Component } from "react";
import Chart from "react-apexcharts";
function ChartData(props) {
  const options = {
    chart: {
      type: "area",
      stacked: false,
      height: '350px',
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'pan',
        show: false
      }
    },
    // colors: ['#546E7A'],
    stroke: {
      width: 2
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      //text: props.name + "//" + props.symbol,
      align: "left",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 0, 0],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return parseFloat(val/10000).toFixed(4);
        },
      },
      title: {
        text: props.symbol,
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return parseFloat(val/10000).toFixed(4);
        },
      },
    },
  };
  const series = [
    {
      name: "",
      data: props.market,
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="area" height="380"/>
    </div>
  );
}

export default ChartData;
