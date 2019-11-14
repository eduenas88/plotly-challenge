function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    var url = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(url).then((sample) => {
    // Use `.html("") to clear any existing metadata
      let sample_metadata = d3.select("#sample-metadata"); 
      sample_metadata.html(""); 
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.defineProperties(sample).forEach(([key, value]) => {
        sample_metadata.append("p").text('${key}: ${value}');
      }); 
      }); 
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var url = `/samples/${sample}`
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data) {
    let id = data.otu_ids; 
    let label = data.otu_labels; 
    let xvalue = data.sample_values;  
    let yvalue = data.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    let layout = {
      x: id, 
      y: xvalue,
      text: yvalue,
      margin: { t: 0 },
      xaxis: {title: "Id's"}, 
      hovermode: "closest"}; 
    // @TODO: Build a Pie Chart
    let bubble = [ {
      x: id, 
      y: yvalue, 
      text: label, 
      mode: "markers", 
      marker: {
        color: id, 
        size: yvalue
      }
    } ]; 

    var data = [bubble]
    var clayout = {
      xaxis : {title: "OTU ID"}
    }; 


    Plotly.newPlot("bubble", bubble, clayout); 

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      d3.json(url).then(function(data){
        var pvalues =
    data.sample_values.slice(0,10); 
        var plables = 
    data.otu_ids.slice(0,10); 
        var phoover =
    data.otu_labels.slice(0,10); 
    
    let pData = [{
      values: pvalues, 
      labels: plables, 
      hoverText: phoover,
      hoverDet: "hoverText", 
      type: "pie"
    }
    ]; 
    Plotly.plot("pie", pData); 
}); 
}
  );
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
