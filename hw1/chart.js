async function buildPlot() {
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");

    const yMinAccessor = (d) => d.temperatureMin;
    const yMaxAccessor = (d) => d.temperatureHigh;
    // adding const d.temperatureHigh

    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const boundHeight = dimension.boundedHeight + 10
    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScalerlow = d3.scaleLinear()
        .domain(d3.extent(data, yMinAccessor))//найдет мин и макс
        .range([dimension.boundedHeight, 0]);

    const yScalerhigh = d3.scaleLinear()
        .domain(d3.extent(data, yMaxAccessor))
        .range([dimension.boundedHeight, 0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0, dimension.boundedWidth]);

    var lineMinGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScalerlow(yMinAccessor(d)));

    var lineMaxGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScalerhigh(yMaxAccessor(d)));

    bounded.append("path")//min temp path
        .attr("d",lineMinGenerator(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","green")

    bounded.append("path")//max temp path
        .attr("d",lineMaxGenerator(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","red")

    var x_axis = d3.axisBottom()
        .scale(xScaler);

    var y_axis = d3.axisLeft()
        .scale(yScalerlow);

    bounded.append("g")
        .attr("transform", "translate(100, " + boundHeight + ")")
        .call(x_axis);

    bounded.append("g")
        .attr("transform", "translate(100, 10)")
        .call(y_axis);

}

buildPlot();