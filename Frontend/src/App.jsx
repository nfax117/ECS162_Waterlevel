import React, {useState, useEffect} from 'react';
import useAsyncFetch from './useAsyncFetch';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import MonthPicker from './MonthPicker';
import './App.css';

function App() {
  
  const [showMore, setShowMore] = useState(false)
  
  return (

    <main>

      <div className="page">
          
        <div className="mainHeading">
          Water storage in California Reservoirs
        </div>
        
        <div className="BeforeClick">
  
          <div className="TextAndButton">
            
            <p>
              California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
            </p>
            <p>
              California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
            </p>
  
          </div> 
  
          <div className="ImageAndCaption">
            <img className="image" src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
            "/>
            <div className="caption">
      Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
            </div>
            
          </div>
          
        </div>
  
        
        <div className="AfterClick">
          {showMore ? <MonthAndChartDisplay/>:""}
          <button className = "morelessBtn" onClick={()=> setShowMore(!showMore)}>
            {showMore ? "See less" : "See more"}
          </button>
        </div>

      </div>
      
    </main>
  );
}

//AJAX Request
function MonthAndChartDisplay(){
  const [date, setDate] = useState({month: 4, year: 2022});
  console.log("Date render set");
  //Get date from Month Picker
  function yearChange(newYear) {
      setDate({month: date.month, year: newYear});
    }

  function monthChange(newMonth){
      setDate({month: newMonth, year: date.year});
    }
  
  return(
      <div className="ChartAndText">
        <WaterLevelDisplay date = {date}/>

        <div className="TextAndMonth">
          <p>Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
          </p>
          
          <div className="MonthPicker">
            <p className="textColor">Change Month:</p>
            <MonthPicker
              date = {date}
              yearFun = {yearChange}
              monthFun = {monthChange}
            />
          </div>
        </div>
        
      </div>
  );
}

function WaterLevelDisplay(props){

  const [seeMonthlyWaterLevels, setMonthlyWaterLevels] = useState([]);
  const [oldDate, setoldDate] = useState(null);

  
  console.log("WaterLevel render set")

  useAsyncFetch("/query/getMonthYear", props.date, {}, then_func, catch_func);

  function then_func(result){
    console.log("Then Result: ", result);
    setoldDate(props.date);
    setMonthlyWaterLevels(result);
  }

  function catch_func(error){
    console.log(error)
  }

  console.log("re-rendering");
  if(oldDate != props.date){
    return(<div></div>);
  }
  else{
    console.log("making chart");
  return(<MakeChart seeMonthlyWaterLevels={seeMonthlyWaterLevels}></MakeChart>);
  }
}



//Make the chart
function MakeChart(props){
  console.log("Making Chart")

  let label = ["Shasta", "Oroville", "Trinity Lake", "New Melones", "San Luis", "Don Pedro", "Berryessa"];

  let capacity = [4552000, 3537577, 2447650, 2400000, 1062000, 2030000, 1602000];
  
  let station = {label: "", data: [], backgroundColor: ["rgb(66, 145, 152)"]};
  let waterMissing = {label: "", data: [], backgroundColor: ["rgb(120, 199, 227"]};

  for(let i=0; i<props.seeMonthlyWaterLevels.length; i++){
    station.data.push(props.seeMonthlyWaterLevels[i].value/100000);
    waterMissing.data.push((capacity[i] - props.seeMonthlyWaterLevels[i].value)/100000);
  }

  let chartData = {};
  chartData.labels = label;
  chartData.datasets = [station, waterMissing];

  let options = {
  plugins: {
     legend: {
      display: false
     },
    title: {
      display: true,
      text: '',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 10
      },
      stacked: true,
      grid: {
        display: false
      }
    }
  }
      
};

  return (
        <div id="chart-container">
          <Bar options={options} data={chartData} />
        </div>
      )
}


export default App;