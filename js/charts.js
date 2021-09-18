function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(resultArray)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var aSample = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = aSample.otu_ids;
    var labels = aSample.otu_labels;
    var sValues = aSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(tick => "OTU " + tick + " ").reverse();
    console.log(yticks)

    var topValues = sValues.slice(0,10).reverse();
    console.log(topValues)
     // 8. Create the trace for the bar chart. 
    trace = {  
      x: topValues,
      y: yticks,
      type: "bar",
      orientation: 'h'
    };

    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    title: "<b>Top 10 Bacteria Cultures Found</b>",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

    // Bubble Chart Section Below
    
    // 1. Create the trace for the bubble chart.

    //Adjust size and color values
    sizeVal = sValues.map(val => val/2);
    colorVal = otuIds.map(val => val*100);

    var bubbleData = [
      trace = {  
        x: otuIds,
        y: sValues,
        mode: "markers",
        marker: {
          size: sizeVal,
          //colorscale: 'YlGnBu',
          color: colorVal
        },
        text: labels
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      xaxis:{title: "OTU ID"},
    
      };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Gauge Chart Section Below

    // Filter the data for the object with the desired sample number


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Reusing from buildMetadata(), metaData
    var metaData = data.metadata;
    console.log(metaData);

    var mdArray = metaData.filter(objId => objId.id == sample);
    var result = mdArray[0];
    console.log(result)
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Reusing from previous plots
    
    // 3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(result.wfreq);
    console.log(wFreq)
     
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      trace = {  
        domain: {x: [0, 1], y: [0, 1]},
        value: wFreq,
        title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "limegreen"},
            { range: [8, 10], color: "green"},
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 470, 
      height: 450, 
      margin: { t: 0, b: 0 },
      xaxis:{title: "OTU ID"},
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

