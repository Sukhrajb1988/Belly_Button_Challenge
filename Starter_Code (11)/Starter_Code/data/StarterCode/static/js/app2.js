const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch data and initialize the page
function init() {
    let grabber = d3.select("#selDataset");

    d3.json(url).then(function(bellybutton) {
        let samples = bellybutton.names;

        samples.forEach(sample => {
            grabber.append("option").text(sample).property("value", sample);
        });

        let firstSubject = samples[0];
        info(firstSubject, bellybutton);
        charts(firstSubject, bellybutton);
    }).catch(error => console.error("Error loading data:", error));
}

// Function to handle dropdown change
function optionChanged(subjectID) {
    d3.json(url).then(function(bellybutton) {
        info(subjectID, bellybutton);
        charts(subjectID, bellybutton);
    }).catch(error => console.error("Error loading data:", error));
}

// Function to display subject metadata
function info(sampleitem, data) {
    let m = data.metadata;
    let mresults = m.find(obj => obj.id == sampleitem);

    let table = d3.select("#sample-metadata");
    table.html("");

    for (let key in mresults) {
        table.append("h6").text(`${key}: ${mresults[key]}`);
    }
}

// Function to display charts
function charts(chartData, data) {
    let m = data.metadata;
    let mresults = m.find(obj => obj.id == chartData);
    let washFrequency = mresults.wfreq;

    let sample = data.samples;
    let sampleResults = sample.find(obj => obj.id == chartData);

    let otu_ids = sampleResults.otu_ids;
    let otu_labels = sampleResults.otu_labels;
    let sample_values = sampleResults.sample_values;

    // Bar Chart
    let trace1 = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: 'h'
    };

    let data_bar = [trace1];
    let layout_bar = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", data_bar, layout_bar);

    // Bubble Chart
    let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            colorscale: "Earth",
            size: sample_values
        }
    };

    let data_bubble = [trace2];
    let layout_bubble = {
        title: 'Bacteria Cultures per Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bubble', data_bubble, layout_bubble);
}

// Initialize the page
init();
