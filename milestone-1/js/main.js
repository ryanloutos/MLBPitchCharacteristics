bounds_helper();
var plinko;
var movement;
var locations;

setup_profile_input();
setup_visualizations();

function setup_profile_input(){
    // Default readings
    update_bauer_units()
    update_movement_profile()

    $("#h-movement-slider").on("input", function(event){
        $("#h-movement-label").text(event.target.value)
        update_movement_profile()
    })

    $("#v-movement-slider").on("input", function(event){
        $("#v-movement-label").text(event.target.value)
        update_movement_profile()
    })

    $("#spin-rate-slider").on("input", function(event){
        $("#spin-rate-label").text(event.target.value)
        update_bauer_units()
    })

    $("#velo-slider").on("input", function(event){
        $("#velo-label").text(event.target.value)
        update_bauer_units()
    })

    $("#pitch-profile-submit").on("click", function(event){
        let h_move = +$("#h-movement-slider").val()
        let v_move = +$("#v-movement-slider").val()
        let rpm = +$("#spin-rate-slider").val()
        let velo = +$("#velo-slider").val()
        let b_units = rpm/velo;

        get_pitchers(h_move, v_move, rpm, velo, b_units);

    })

    /**Helper function to calculate bauer units
     */
    function update_bauer_units(){
        let rpm = +$("#spin-rate-slider").val();
        let velo = +$("#velo-slider").val();
        let b_units = rpm/velo;

        $("#bauer-units-label").text(b_units.toFixed(2))
    }

    /**Helper function to update the movement profile graphic
     */
    function update_movement_profile(){
        console.log("NEED TO IMPLEMENT")
    }
}

/**
 * @summary Fetch pitchers from data who have similarities
 * 
 * @param  {Number} h_move Horizontal movement in inches
 * @param  {Number} v_move Vertical movement in inches
 * @param  {Number} rpm Spin rate in RPM
 * @param  {Number} velo Velocity in MPH
 * @param  {Number} b_units Bauer Units
 * 
 * @description Populates the list of pitchers with pitchers who have a similarity in
 * the parameter metrics. The similarity threshold is dictated by the 
 * "threshold" variable. 
 */
function get_pitchers(h_move, v_move, rpm, velo, b_units){
    $.getJSON("/milestone-1/data/fastball_data.json", function(data){

        $("#pitchers-select-list").empty();
        var passed_pitchers = []

        data.forEach(pitcher => {
            // console.log(pitcher)
            let name = pitcher.name
            let fb = pitcher.data;

            // convert feet to inches
            fb.hor_movement = fb.hor_movement * 12
            fb.vert_movement = fb.vert_movement * 12

            // skip if no fastball data
            if(fb.velocity == 0){
                return
            }

            // base similarity metric
            // if percent difference in all categories is below a threshold add it
            // to the selectable list of pitchers
            let threshold = 0.1;

            let t1 = get_pct_threshold(h_move, fb.hor_movement)
            let t2 = get_pct_threshold(v_move, fb.vert_movement)
            let t3 = get_pct_threshold(b_units, fb.bauer_units)

            let avg = Math.abs((t1 + t2 + t3) / 3)

            if (avg < threshold){
                    // console.log(pitcher)
                    // console.log(`Average: ${avg}`)
                    let similarity = (1 - avg) * 100
                    passed_pitchers.push({name: name, sim: similarity})
            }

        });

        // console.log(passed_pitchers)
        passed_pitchers.sort((a, b) => (a.sim < b.sim) ? 1 : -1)
        passed_pitchers.forEach(function(p){
            let link = $(`<a class="list-group-item-action d-flex justify-content-between">${p.name}<span class="badge badge-light badge-pill">${p.sim.toFixed(0)} %</span></a>`)

            link.click(function(event){

                // Set selection to active
                $("#pitchers-select-list").children().removeClass("active");
                link.addClass("active");

                display_pitcher_graphics(p.name)
            });

            $("#pitchers-select-list").append(link);
        })
    })

    function get_pct_threshold(amatuer, mlb){
        return ((amatuer - mlb) / mlb)
    }
}

function display_pitcher_graphics(name){
    // console.log(`Selected Player: ${name}`)

    $.getJSON("/milestone-1/data/pitcher_data.json", function(data){

        for(let d in data){
            if(data[d].name == name){
                // console.log("player found")

                // convert feet to inches
                Object.values(data[d].pitches).forEach(function(d){
                    d.hor_movement = d.hor_movement * 12
                    d.vert_movement = d.vert_movement * 12
                })

                update_visualizations(data[d])
                break;
            }
        }
    })
}

function setup_visualizations(){
    let height = 500;

    movement = new pitcher_movement_profile("pitch-movement", $("#pitch-movement").width(), height / 2)
    locations = new pitcher_pitch_locations("pitch-locations", $("#pitch-locations").width(), height/2)
    plinko = new pitch_counts_plinko("plinko", 500, height)
}

function update_visualizations(data){
    plinko.set_data(data);
    movement.set_data(data);
    locations.set_data(data);
}


function bounds_helper(){
    $.getJSON("/milestone-1/data/pitcher_data.json", function(data){
        console.log(data)
        console.log("FF")
        console.log(d3.extent(data, d => d.pitches.FF.hor_movement))
        console.log(d3.extent(data, d => d.pitches.FF.vert_movement))

        console.log("SI")
        console.log(d3.extent(data, d => d.pitches.SI.hor_movement))
        console.log(d3.extent(data, d => d.pitches.SI.vert_movement))

        console.log("CH")
        console.log(d3.extent(data, d => d.pitches.CH.hor_movement))
        console.log(d3.extent(data, d => d.pitches.CH.vert_movement))

        console.log("CU")
        console.log(d3.extent(data, d => d.pitches.CU.hor_movement))
        console.log(d3.extent(data, d => d.pitches.CU.vert_movement))

        console.log("FC")
        console.log(d3.extent(data, d => d.pitches.FC.hor_movement))
        console.log(d3.extent(data, d => d.pitches.FC.vert_movement))

        console.log("FS")
        console.log(d3.extent(data, d => d.pitches.FS.hor_movement))
        console.log(d3.extent(data, d => d.pitches.FS.vert_movement))

        console.log("KC")
        console.log(d3.extent(data, d => d.pitches.KC.hor_movement))
        console.log(d3.extent(data, d => d.pitches.KC.vert_movement))

        console.log("SL")
        console.log(d3.extent(data, d => d.pitches.SL.hor_movement))
        console.log(d3.extent(data, d => d.pitches.SL.vert_movement))
    })
}