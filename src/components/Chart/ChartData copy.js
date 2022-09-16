
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { scaleTime } from "d3-scale"
import { utcDay } from "d3-time";
import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { curveMonotoneX } from "d3-shape";
import { getData } from "./ultils";
import { last, createVerticalLinearGradient, hexToRGBA,timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { CandlestickSeries } from "react-stockcharts/lib/series";
function ChartData(props) { 
  const [dataChart, setDataChart] = useState([]);
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    console.log('-----');
    getData().then(data => {
      console.log(data);
      //setDataChart(data)
    })
    var newData = [];
      if(props.market.length > 0){
        console.log(props.market)
        newData.push(...props.market)
      }
      newData.push({
        columns: [
        "date",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "split",
        "dividend",
        "absoluteChange",
        "percentChange",]
      });
      setDataChart(newData)
      console.log(newData)
    //console.log(props.market)
    // if(props.market.length > 0){
    //   console.log(props.market)
    //   setDataChart([...props.market]);
    // }
    
  }, []);
  function updateSize() {
    setSize([window.innerWidth, window.innerHeight]);
  }
  useEffect(() => {
    
    window.addEventListener('resize', updateSize);
    updateSize();
    window.removeEventListener('resize', updateSize);
  }, []);
  const canvasGradient = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
    { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
    { stop: 1, color: hexToRGBA("#4286f4", 0.8) },
  ]);
  const xAccessor = d => new Date(d.date);
  const xExtents = [
    dataChart.length > 0 ? xAccessor(last(dataChart)): new Date(),
    new Date(),
  ];
  return (
    <>
    {dataChart.length > 0 && (
      <ChartCanvas 
        height={400}
        ratio={6}
        width={size[0] * 0.5 - 25}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName="MSFT"
        data={dataChart}
        xAccessor={xAccessor}
        xScale={scaleTime()}
        xExtents={xExtents}
      >

        <Chart id={0} yExtents={d => [d.high, d.low]}>
          <defs>
            <linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
              <stop offset="0%" stopColor="#b5d0ff" stopOpacity={0.2} />
              <stop offset="70%" stopColor="#6fa4fc" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#4286f4" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
          <YAxis axisAt="left" orient="left" ticks={5}/>
          <CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
        </Chart>
      </ChartCanvas>
    )
    }
    </>
  );
}

export default ChartData;