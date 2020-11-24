
class pitch_counts_plinko{

    constructor(div_id, width, height, colors, data=null){
        var self = this;

        self.margin = {left: 5, right: 5, top: 5, bottom: 5}
        self.data = data;
        self.colors = colors

        self.height = height - self.margin.top - self.margin.bottom;
        self.width = width - self.margin.right - self.margin.left

        //full svg
        self.svg = d3.select(`#${div_id}`).append("svg")
            .attr("width", width)
            .attr("height", height)

        //drawing area. Locations to be considdered with margin.
        self.viz = self.svg.append("g");

        self.xScale = d3.scaleLinear()
            .domain([-100, 100])
            .range([self.margin.left, self.width + self.margin.left])

        self.yScale = d3.scaleLinear()
            .domain([100, -100])
            .range([self.margin.top, self.height + self.margin.top])

        self.radius_scale = d3.scaleLinear()
            .range([10, 30])

        self.pie_locations = {
            "0-0": {x: 0, y: 80},

            "0-1": {x: -33, y: 70},
            "1-0": {x: 33, y: 70},

            "0-2": {x: -66, y: 25},
            "1-1": {x: 0, y: 25},
            "2-0": {x: 66, y: 25},

            "1-2": {x: -66, y: -25},
            "2-1": {x: 0, y: -25},
            "3-0": {x: 66, y: -25},

            "2-2": {x: -33, y: 70},
            "3-1": {x: 33, y: 70},

            "3-2": {x: 0, y: -80},
        }

    }

    set_data(data){
        var self = this;
        self.data = {};

        // Wrangle data
        for(const [key, value] of Object.entries(data.pitch_counts)){

            let temp = []
            for(const [k, v] of Object.entries(value)){
                if(!(["num", "ball_pct", "strike_pct"].includes(k))){
                    temp.push({label: k, value: v})
                }
            }

            self.data[key] = {
                pie: temp,
                num: value.num,
                ball_pct: value.ball_pct,
                strike_pct: value.strike_pct
            }
            
        }

        self.radius_scale.domain(d3.extent(Object.entries(self.data), (d) => d[1].num))

        self.draw()
    }

    draw(){
        var self = this;

        self.pie = d3.pie()
            .value(d => d.value)

        //Draw circles for each pitch count
        console.log(Object.entries(self.data))
        
        Object.entries(self.data).forEach(e => {
            let count = e[0]
            let data = e[1]

            var ready = self.pie(data.pie)
            self.viz.selectAll(`.count${count}`).remove();
            self.viz.selectAll(`.count${count}`)
                .data(ready)
                .enter()
                .append("path")
                    .attr("d", d3.arc().innerRadius(0).outerRadius(self.radius_scale(data.num)))
                    .attr("class", `count${count}`)
                    .attr("fill", d => self.colors[d.data.label])
                    .attr("stroke", "black")
                    .attr("stroke-width", "1px")
                    .attr("opacity", 0.5)
                    .attr("transform", `translate(${self.xScale(self.pie_locations[count].x)}, ${self.yScale(self.pie_locations[count].y)})`)
        });
    }
}