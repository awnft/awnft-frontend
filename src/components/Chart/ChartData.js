import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
function ChartData(props) { 
	
		const options = {
      animationEnabled: true,
      title:{
				text: props.name + "\/" + props.symbol
			},
			axisX: {
				valueFormatString: "MM-DD HH:mm:ss"
			},
			axisY: {
				title: "",
        prefix: props.symbol+' '
        
			},
			data: [{
				yValueFormatString: props.symbol+" #,###",
				xValueFormatString: "MM DD:HH",
        type: "spline",
        toolTipContent: "Vol {z}",
				dataPoints: props.market
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	
}

export default ChartData;       