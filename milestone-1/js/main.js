setup_profile_input();

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

    function update_bauer_units(){
        let rpm = +$("#spin-rate-slider").val();
        let velo = +$("#velo-slider").val();
        let b_units = rpm/velo;

        $("#bauer-units-label").text(b_units.toFixed(2))
    }

    function update_movement_profile(){
        console.log("NEED TO IMPLEMENT")
    }
}

function get_pitchers(h_move, v_move, rpm, velo, b_units){
    $.getJSON("/milestone-1/data/pitcher_data.json", function(data){

        $("#pitchers-select-list").empty();
        data.forEach(pitcher => {
            // console.log(pitcher)
            let name = pitcher.name
            let fb = null;
            // get primary fastball pitch
            if(pitcher.pitches.FF.velocity != 0){
                fb = pitcher.pitches.FF
            } else if(pitcher.pitches.SI.velocity != 0){
                fb = pitcher.pitches.SI
            } else if(pitcher.pitches.FC.velocity != 0){
                fb = pitcher.pitches.FC
            } else {
                // skips over the rest of loop for this pitcher
                return;
            }

            // base similarity metric
            // if percent difference in all categories is below a threshold add it
            // to the selectable list of pitchers
            let threshold = 0.1;

            if (get_pct_threshold(h_move, fb.hor_movement, threshold) &&
                get_pct_threshold(v_move, fb.vert_movement, threshold) &&
                get_pct_threshold(b_units, fb.bauer_units, threshold)){
                    console.log(pitcher)
                    $("#pitchers-select-list").append(`<li>${name}</li>`);
                }


        });
    })

    function get_pct_threshold(amatuer, mlb, threshold){
        return ((amatuer - mlb) / mlb) > threshold ? false : true ;
    }
}

function get_data(){

}

function setup_visualization(){
    let plinko = new pitch_counts_plinko("plinko", 500, 500);
}