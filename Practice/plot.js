console.log(cityGrowths);

var sortedCities = cityGrowths.sort((a,b) =>
a.population - b.population).reverse(); 

var topFiveCities = sortedCities.slice(0,5);

var topFiveCityNames = topFiveCities.map(city => city.City);
var topFiveCityGrowths = topFiveCities.map(city => parseInt(city.population));

var trace = {
    x: topFiveCityNames,
    y: topFiveCityGrowths,
    type: "bar",
    orientation: 'h'
};
var data = [trace];
var layout = {
    title: "Largest Cities by Population",
    xaxis: { title: "City" },
    yaxis: { title: "Population"}
};
    Plotly.newPlot("bar-plot", data, layout);