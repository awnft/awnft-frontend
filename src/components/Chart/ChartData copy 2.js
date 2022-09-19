import React, { Component } from 'react';
import Chart from "react-apexcharts";
function ChartData(props) { 
    const  options = {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: props.name + '/\/'+ props.symbol,
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val)
          },
        },
        title: {
          text: props.symbol
        },
      },
      xaxis: {
        type: 'datetime',
      },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return (val)
        }
      }
    }
    };
    const series = [{
      name: 'XYZ MOTORS',
      data: props.market.map( item => item.y)
    }];
		
		return (
		<div>
			<Chart
        options={options}
        series={series}
        type="area"
      />
		</div>
		);
	
}

export default ChartData;       