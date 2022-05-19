function init() {
  // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
    d3.json("static/js/samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
});
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(resultArray);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id === sample);
    console.log(resultArray);
    // variable that holds the first sample in the array.
    var result = resultArray[0]; 

    // variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = result.otu_ids;

    var otuLabels = result.otu_labels;

    var sampleValue = result.sample_values;

    // yticks for the bar chart using otu ids
    var yticks = otuID.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    var otuLabelsSorted = otuLabels.slice(0,10).reverse();
    // Create the trace for the bar chart. 
    var barData = [ {
      x : sampleValue,
      y : yticks,
      type : 'bar',
      text : otuLabelsSorted,
      orientation: 'h',
      marker: {color: 'rgba(104,104,161,1)'}
      }];
    // layout for the bar chart. 
    var barLayout = {
      title: {text: 'Top 10 Bacteria Cultures',  font: {family:"Droid Sans Mono", color: "#FDFEFE"}},
      xaxis: {title: {text: "Sample Value",  font: {color: "#FDFEFE", family: "Droid Sans Mono"}},
      gridcolor: '#1C2833',
      gridwidth: 1,
      zerolinecolor: '#1C2833',
      zerolinewidth: 1,
      linecolor: '#1C2833',
      linewidth: 1,
      tickfont: {family: "Droid Sans Mono", color: "#FDFEFE"}},
      yaxis: {gridcolor: '#1C2833',
      gridwidth: 1,
      zerolinecolor: '#1C2833 ',
      zerolinewidth: 1,
      linecolor: '#1C2833 ',
      linewidth: 1,
      tickfont: {family: "Droid Sans Mono", color: "#FDFEFE"},
      },
      paper_bgcolor:"#5499C7",
      plot_bgcolor: "#5499C7"
    };
    // plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x : yticks,
      y: sampleValue,
      text: otuLabelsSorted,
      mode: "markers",
      marker: {
        size: sampleValue,
        color: otuID,
        colorscale: "YlGnBu"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "Bacteria Cultures Per Sample", font: {color: "#FDFEFE", family: "Droid Sans Mono"}},
      xaxis: {title: {text:'OTU ID', font: {color: "#FDFEFE", family: "Droid Sans Mono"}},
      gridcolor: '#1C2833 ',
      gridwidth: 1,
      zerolinecolor: '#1C2833 ',
      zerolinewidth: 1,
      linecolor: '#1C2833 ',
      linewidth: 1},
      yaxis:{gridcolor: '#1C2833 ',
      gridwidth: 1,
      zerolinecolor: '#1C2833 ',
      zerolinewidth: 1,
      linecolor: '#1C2833 ',
      linewidth: 1},
      hovermode: "closest",
      height: 400,
      width: 800,
      plot_bgcolor: "#5499C7",
      paper_bgcolor:"#5499C7",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout,{responsive: true} );

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    console.log(metadata);

    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstResult = resultArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wFreq = firstResult.wfreq;
    var wFreqFloat = parseFloat(wFreq).toFixed(2);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreqFloat,
      title: {text: "Scrubs per Week", font: {size: 18, color: "#FDFEFE", family: "Droid Sans Mono"}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], dtick: 2, tick0: 0},
        bar: {color: 'rgba(62,85,125,1)'},
        steps: [
          { range: [0, 2], color: "floralwhite"},
          { range: [2, 4], color: "lavender"},
          { range: [4, 6], color: "thistle"},
          { range: [6, 8], color: "mediumslateblue" },
          { range: [8, 10], color: "royalblue" },
      ]},
    
     
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "Belly Button Washing Frequency", font: {family:"Droid Sans Mono", color: "#FDFEFE"}},
      titlefont: {"size": 25},
      plot_bgcolor: "#5499C7",
      paper_bgcolor:"#5499C7"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
    });
    }
