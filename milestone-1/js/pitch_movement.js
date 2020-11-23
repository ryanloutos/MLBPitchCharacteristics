
class pitcher_movement_profile{

    constructor(div_id, width, height, colors, data=null){
        var self = this;

        self.margin = {left: 5, right: 5, top: 5, bottom: 5}
        self.data = data;
        self.colors = colors;

        self.height = height - self.margin.top - self.margin.bottom;
        self.width = width - self.margin.right - self.margin.left;

        //full svg
        self.svg = d3.select(`#${div_id}`).append("svg")
            .attr("width", width)
            .attr("height", height)

        //drawing area. Locations to be considdered with margin.
        self.viz = self.svg.append("g");

        self.xScale = d3.scaleLinear()
            .range([self.margin.left, self.width + self.margin.left])
            .domain([-24, 24])

        self.yScale = d3.scaleLinear()
            .range([self.margin.top, self.height + self.margin.top])
            .domain([-24, 24])
    }

    set_data(data){
        var self = this;
        self.data = []
        for(const [key, value] of Object.entries(data.pitches)){
            let temp = value;
            value.type = key;
            self.data.push(temp)
        }
        console.log(self.data)

        //Custom axis size
        // self.xScale.domain(d3.extent(self.data, d => d.hor_movement))
        // self.yScale.domain(d3.extent(self.data, d => d.vert_movement))

        self.draw()
    }

    draw(){
        var self = this;
        let circle_radius = 4;

        self.xAxis = d3.axisBottom()
            .scale(self.xScale)
            .ticks(5, "f")

        self.yAxis = d3.axisLeft()
            .scale(self.yScale)
            .ticks(5, "f")

        self.viz.selectAll(".x-axis").remove()
        self.viz.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${self.height/2 + self.margin.top})`)
            .call(self.xAxis)

        self.viz.selectAll(".y-axis").remove()
        self.viz.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${self.width/2 + self.margin.left}, 0)`)
            .call(self.yAxis)

        self.viz.selectAll(".circles").remove();

        let data_for_drawing = d3.filter(self.data, d=> d.velocity > 0)

        self.circles = self.viz.append("g")
            .attr("class", "circles")
            .selectAll("circle")
            .data(data_for_drawing)
            .enter()
            .append("circle")
                .attr("cx", d => self.xScale(d.hor_movement))
                .attr("cy", d => self.yScale(d.vert_movement))
                .attr("r", circle_radius)
                .attr("fill", d => self.colors[d.type])
                .attr("stroke", "black")
                .attr("stroke-width", 1)
    }
}