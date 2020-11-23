
class pitch_counts_plinko{

    constructor(div_id, width, height, data=null){
        var self = this;

        self.margin = {left: 0, right: 0, top: 0, bottom: 0}
        self.data = data;

        self.height = height - self.margin.top - self.margin.bottom;
        self.width = width - self.margin.right - self.margin.left

        //full svg
        self.svg = d3.select(`#${div_id}`).append("svg")
            .attr("width", width)
            .attr("height", height)

        //drawing area. Locations to be considdered with margin.
        self.viz = self.svg.append("g");

    }

    set_data(data){
        var self = this;
        self.data = data;
    }
}