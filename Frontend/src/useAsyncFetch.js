import React, {useEffect} from 'react';

const useAsyncFetch = function (url, data, options, then_func, catch_func){
  console.log("in useAsyncFetch");
  
  async function fetchData(){
    console.log("sending", data);

  let params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)};
  
    let api_url = url;
    console.log(api_url);
    let info = await fetch(api_url, params); 
    let json = await info.json();

    console.log(json);
    then_func(json);
  }
  
  useEffect(function(){
    console.log("Calling Fetch");
    fetchData();
  },[data]);
}

export default useAsyncFetch;