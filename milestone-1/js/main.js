setup_profile_input();

function setup_profile_input(){
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

function get_pitchers(){

}

function get_data(){

}

function setup_visualization(){
    let plinko = new pitch_counts_plinko("plinko", 500, 500);
}