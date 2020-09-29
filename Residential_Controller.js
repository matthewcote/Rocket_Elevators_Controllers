////////////////////// - Request - Button - /////////////////////////////////

class Request_Button { // DEFINE Request_Button
    constructor(floor) { // USING floor
        this.floor = floor; // floor: floor,
    }
    // SEQUENCE request_button_pushed
    request_button_pushed(elevator) {
		elevator.call_elevator(this.floor);
    }
} // ENDDEFINE

///////////////////////////-  Door  -//////////////////////////////////////////

class Door { // DEFINE Door
    constructor(floor) { // USING floor
        this.floor = floor; // floor: floor,
        this.status = "IDLE"; // status: "IDLE"
    }
    open_door() { // SEQUENCE open_door
        this.status = "OPEN" // SET door_status TO "OPEN"
    } // ENDSEQUENCE
    
    close_door() { // SEQUENCE close_door 
        this.status = "CLOSED" // SET door_status TO "CLOSED"
    } // ENDSEQUENCE
    //TODO//
} // ENDDEFINE

////////////////////////////// -   Edoor    -///////////////////////////////////

class Edoor { // DEFINE Edoor
    constructor() {
        this.status = "CLOSED"; //  SET door_status TO "ClOSED"
    }
    open_door() { // SEQUENCE open_door
        this.status = "OPEN" // SET door_status TO "OPEN"
    } // ENDSEQUENCE
    
    close_door() { // SEQUENCE close_door 
        this.status = "CLOSED" // SET door_status TO "CLOSED"
    } // ENDSEQUENCE

        /*
        SEQUENCE elevator_door_alert
    
            CALL open_door
            CALL wait
        ENDSEQUENCE
        'TODO'
        */
}  // ENDDEFINE

///////////////////////////-  Floor Display  -//////////////////////////////////////////

class Floor_Display { // DEFINE Floor_Display
    constructor(display_number, display_direction) { //USING number
        this.display_number = display_number; // SET display_number TO floor
        this.display_direction = display_direction;
    }
    set_display(elevator_num, floor, direction) { // SEQUENCE set_display_number USING floor
        this.display_number = floor; // SET display_number TO floor
        this.display_direction = direction;
        console.log("Elevator " + elevator_num + ": Display Number: " + this.display_number + "  Direction: " + this.display_direction);
    } // ENDSEQUENCE
}  // ENDDEFINE

///////////////////////////-   Elavator    -/////////////////////////////////////

class Elevator { // DEFINE Elevator
    constructor(num, floor_num) { // USING num AND floor_num
        // name: num,
        this.name = num;
        // status: "IDLE", 
        this.status = "IDLE";
        // current_floor: 1,
        this.current_floor = 1;
        // request_button_list: SET TO EMPTY List,
        this.request_button_list = [];
        // door_list: SET TO EMPTY List,
        this.door_list = [];
        // floor_list: SET TO EMPTY List,
        this.floor_list = [];
        // edoor: SET edoor TO INSTATIATE Edoor
        this.edoor = new Edoor();
        // floor_dispaly: SET floor_display to INSTATIATE Floor_Display WITH current_floor
        this.floor_display = new Floor_Display(this.current_floor);
        this.floor_display.set_display(this.name, this.current_floor, this.status)
        
        for (var floor = 1; floor <= floor_num; floor++) { // SET floor TO 1; WHILE floor is less than or equal to column floor_num; INCREMENT floor
            var request_button = new Request_Button(floor); // SET request_button TO INSTANTIATE Request_Button WITH floor
            this.request_button_list.push(request_button); // PUSH request_button TO request_button_list
            var door = new Door(floor); // SET door TO INSTANTIATE Door WITH floor
            this.door_list.push(door); // PUSH door TO door_list 
		} // ENDWHILE
    }
	push_floor_list(floor) {
        // push floor TO floor_list 
        console.log("column chose Elevator :" + this.name)
        this.floor_list.push(floor);
        // CALL move 
        this.move();
    }
    move() {
        var direction = "NULL"; // SET direction TO "NULL"
        for (var i = this.floor_list.length - 1; i >= 0; i--) { // FOR EACH floor IN floor_list  
            if (this.floor_list[i] === this.current_floor) { // IF floor IS EQUAL TO current_floor
                this.floor_list.splice(i, 1); // REMOVE floor FROM floor_list
                this.stop(); // CALL stop 
            }
            else { // ELSE 'determine direction'
                // IF direction IS EQUAL TO "NULL" AND floor IS LESS THAN current_floor
                if (direction === "NULL" && this.floor_list[i] < this.current_floor) {
                    direction = "DOWN"; // SET direction TO "DOWN"
                    this.status = direction; // SET status TO direction
                    // INCREMENT current_floor by negative 1 
                    this.floor_display.set_display(this.name, this.current_floor, this.status)// 'TODO turn that into a function - maybe takes time'
                    this.current_floor -= 1;
                    this.move(); // CALL elevator move 
                } // ENDIF
                // IF direction IS EQUAL TO "NULL" AND floor IS MORE THAN current_floor
                if (direction === "NULL" && this.floor_list[i] > this.current_floor) {
                    direction = "UP"; // SET direction TO "UP"
                    this.status = direction; // SET status TO direction
                    this.floor_display.set_display(this.name, this.current_floor, this.status)// 'TODO turn that into a function - maybe takes time'
                    this.current_floor += 1;
                    this.move(); // CALL elevator move 
                } // ENDIF
            } // ENDIF
        } // ENDFOR
        this.status = "IDLE"; // SET status to "IDLE"
    }
    stop() {
        //this.open_door(floor); // CALL open_door WITH floor

        for (var i = this.request_button_list.length - 1; i >= 0; i--) { // FOR EACH request_button in request_button_list
            if (this.request_button_list[i].floor === this.current_floor) {
                this.request_button_list[i].status = "IDLE"; // SET request_button status TO "IDLE"
            } // ENDIF   
        } // ENDFOR
        this.wait();
        this.status = "IDLE"
        this.floor_display.set_display(this.name, this.current_floor, this.status)
        if (this.floor_list.length !== 0) {// IF floor_list IS EMPTY
            this.move();            
        } 
    };
    wait() {
        /*
            'TODO - can add a wait variable
            WAIT x seconds
            CALL close_door
        */
    }
} //ENDDEFINE

//////////////////////////////-  Call_Button  -///////////////////////////////////

class Call_Button { // DEFINE Call_Button 
    constructor(floor, direction) { // USING floor AND direction 
        this.floor = floor; // floor:  floor,
        this.direction = direction; // direction: direction,
        this.status = "IDLE"; // status: "IDLE" 
	}

    call_button_pushed(elevator_list) { // SEQUENCE call_button_pushed USING elevator_list
        this.status = "ACTIVE"; // SET call_button status TO "ACTIVE"
        var elevator_choice = "NULL";
		
		if (this.direction === "DOWN") { // IF call_button direction EQUALS "DOWN" 
			var diff = 0; // SET diff TO 0
            var best_diff = 999; // SET best_diff TO 9999
			for (var i = 0; i < elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
				if (elevator_list[i].floor > this.floor && elevator_list[i].status === "DOWN") {  // IF elevator floor is more than call_button floor and elevator status is equal to "DOWN" 
					diff = elevator_list[i].floor - this.floor; // SET diff to elevator floor minus call_button floor
					if (diff < best_diff) { // IF diff is less than best_diff'
						elevator_choice = elevator_list[i].name;  //  SET elevator_choice TO elevator
						best_diff = diff;// SET best_diff to diff
					} // ENDIF    
				} // ENDIF
            } // ENDFOR
            if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
				elevator_list[elevator_choice - 1].call_elevator(this.floor)// CAll elevator push_floor_list WITH call_button floor
            	return; // RETURN from SEQUENCE
			} else { // ELSE
				for (var i = 0; i < elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
					var diff = 0; // SET diff TO 0
					var best_diff = 9999; // SET best_diff TO 9999
						if (elevator_list[i].status === "IDLE") { // IF elevator status is equal to IDLE
							diff = Math.abs(elevator_list[i].current_floor - this.floor); // SET diff to elevator floor minus call_button floor
							if (diff < best_diff) { // IF diff is less than best_diff'
								elevator_choice = elevator_list[i].name;  //  SET elevator_choice TO elevator
								best_diff = diff;// SET best_diff to diff
							} // ENDIF    
						} // ENDIF
				} // ENDFOR
				if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
            	console.log("called push on elevator" + elevator_list[elevator_choice - 1].name + "with " + this.floor);
				elevator_list[elevator_choice - 1].call_elevator(this.floor) // CAll elevator push_floor_list WITH call_button floor
            	return; // RETURN from SEQUENCE
				} 
			} //ENDIF
        } else { // IF call_button direction EQUALS "UP" 

            for (var i = 0; i < elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 

                var diff = 0; // SET diff TO 0
                var best_diff = 9999; // SET best_diff TO 9999
                    if (elevator_list[i].floor < this.floor && elevator_list[i].status === "UP") {  // IF elevator floor is less than call_button floor and elevator status is equal to "DOWN" 
                        diff = this.floor - elevator_list[i].floor; // SET diff to elevator floor minus call_button floor
                        if (diff < best_diff) { // IF diff is less than best_diff'
                        	elevator_choice = elevator_list[i].name;  //  SET elevator_choice TO elevator
                           	best_diff = diff;// SET best_diff to diff
                        } // ENDIF    
                    } // ENDIF
            } // ENDFOR
            if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
            	elevator.push_floor_list(this.floor) // CAll elevator push_floor_list WITH call_button floor
				console.log("called push with " + this.floor)
            	return; // RETURN from SEQUENCE
			} else { // ELSE
				var diff = 0; // SET diff TO 0
				var best_diff = 9999; // SET best_diff TO 9999
				for (var i = 0; i < elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
						if (elevator_list[i].status === "IDLE") { // IF elevator status is equal to IDLE
							diff = Math.abs(elevator_list[i].current_floor - this.floor); // SET diff to elevator floor minus call_button floor
							if (diff < best_diff) { // IF diff is less than best_diff'
								elevator_choice = elevator_list[i].name;  //  SET elevator_choice TO elevator
								best_diff = diff;// SET best_diff to diff
							} // ENDIF    
						} // ENDIF
				} // ENDFOR
				if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
            	console.log("called push on elevator" + elevator_list[elevator_choice - 1].name + "with " + this.floor);
				elevator_list[elevator_choice - 1].call_elevator(this.floor) // CAll elevator push_floor_list WITH call_button floor
            	return; // RETURN from SEQUENCE
				} 
			} //ENDIF
        } // ENDELSE ' call button direction equals up'
	}; // ENDSEQUENCE		
	
} // ENDDEFINE

/////////////////////////-   Column    -///////////////////////////////////////////

class Column { // DEFINE Column USING floor_num AND elevator_num 
    constructor(floor_num, elevator_num) { // USING mode AND floor_num AND elevator_num 

        this.floor_num = floor_num; //   floor_num: floor_num,
        this.elevator_num = elevator_num; //   floor_num: floor_num,
        this.elevator_list = []; //  elevator_list: SET TO EMPTY List,
        this.call_button_list = []; //  call_button_list: SET TO EMPTY List,
        this.fill_elevator_list(elevator_num); // CALL fill_elevator_list WITH elevator_num
        this.fill_call_button_list(floor_num); // CALL fill_call_button_list WITH elevator_num

    }
    fill_elevator_list(elevator_num) { // SEQUENCE fill_elevator_list USING elevator_num
        for (var num = 0; num < elevator_num; num++) { // SET num TO 1 ;WHILE num is less than or equal TO elevator_num ;INCREMENT num 
            var elevator = new Elevator(num, 1); // SET elevator TO INSTANTIATE Elevator WITH num AND floor_num
            this.elevator_list.push(elevator); // PUSH elevator TO elevator_list 
        } // ENDWHILE
    }
    fill_call_button_list(floor_num) { // SEQUENCE fill_call_button_list USING floor_num
        for (var floor = 1; floor <= floor_num; floor++) { // SET floor TO 1; WHILE floor is less than or equal TO floor_num' INCREMENT floor
            // IF floor is not equal TO 1 
            if (floor !== 1) {
                var call_button = new Call_Button(floor, "DOWN"); // SET call_button TO INSTANTIATE Call_Button USING floor AND "DOWN"
                this.call_button_list.push(call_button); // PUSH call_button TO call_button_list
            } // ENDIF

            if (floor !== floor_num){ // IF floor is not equal TO floor_num
                var call_button = new Call_Button(floor, "UP"); // SET call_button TO INSTANTIATE Call_Button USING floor AND "UP"
                this.call_button_list.push(call_button); // PUSH call_button TO call_button_list
            } // ENDIF
		} // ENDWHILE
    } // END SEQUENCE
    LookIdle(floor) {
        var elevator_choice = "NULL";
        var diff = 0; // SET diff TO 0
        var best_diff = 999; // SET best_diff TO 9999
        for (var i = 0; i < this.elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
            if (this.elevator_list[i].status === "IDLE") {  // IF elevator floor is more than call_button floor and elevator status is equal to "DOWN" 
                diff = Math.abs(this.elevator_list[i].current_floor - floor); // SET diff to elevator floor minus call_button floor
                if (diff < best_diff) { // IF diff is less than best_diff'
                    elevator_choice = i;  //  SET elevator_choice TO elevator
                    best_diff = diff;// SET best_diff to diff
                } // ENDIF    
            } // ENDIF
        }
        if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
				this.elevator_list[elevator_choice].push_floor_list(floor)// CAll elevator push_floor_list WITH call_button floor
                return; // RETURN from SEQUENCE
        }
    }
    LookUp(floor) {
        var elevator_choice = "NULL";
        var diff = 0; // SET diff TO 0
        var best_diff = 999; // SET best_diff TO 9999
        for (var i = 0; i < this.elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
            if (this.elevator_list[i].current_floor < floor && this.elevator_list[i].status === "UP") {  
                diff = Math.abs(this.elevator_list[i].floor - floor); // SET diff to elevator floor minus call_button floor
                if (diff < best_diff) { // IF diff is less than best_diff'
                    elevator_choice = i;  //  SET elevator_choice TO elevator
                    best_diff = diff;// SET best_diff to diff
                    console.log(elevator_choice)
                } // ENDIF    
            } // ENDIF           
        }
        if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
                console.log("column chose elevator: " + elevator_choice)
				this.elevator_list[elevator_choice].push_floor_list(floor)// CAll elevator push_floor_list WITH call_button floor
                return; // RETURN from SEQUENCE
        } else {
            this.LookIdle(floor)
        }

    }
    LookDown(floor) {
        var elevator_choice = "NULL";
        var diff = 0; // SET diff TO 0
        var best_diff = 999; // SET best_diff TO 9999
        for (var i = 0; i < this.elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
            if (this.elevator_list[i].current_floor > floor && this.elevator_list[i].status === "DOWN") {  
                diff = elevator_list[i].floor - this.floor; // SET diff to elevator floor minus call_button floor
                if (diff < best_diff) { // IF diff is less than best_diff'
                    elevator_choice = i;  //  SET elevator_choice TO elevator
                    best_diff = diff;// SET best_diff to diff
                } // ENDIF    
            } // ENDIF
        }
        if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
                console.log("column chose elevator: " + elevator_choice)
				this.elevator_list[elevator_choice].push_floor_list(floor)// CAll elevator push_floor_list WITH call_button floor
                return; // RETURN from SEQUENCE
        } else {
            this.LookIdle(floor)
        }

    }
    RequestElevator(RequestedFloor, Direction) {
        if (Direction == "DOWN") {
            this.LookDown(RequestedFloor)
        }
        if (Direction == "UP") {
            this.LookUp(RequestedFloor)
        }
    }
    RequestFloor(Elevator, RequestedFloor) {
        this.elevator_list[Elevator].push_floor_list(RequestedFloor)
    }

} //ENDDEFINE

///////////////////////////////////////////////////////////////////////////////////////
console.log("created column")		
var column = new Column(10, 2);

column.RequestFloor(0,2) //Elevator A is Idle at floor 2 
column.RequestFloor(1,6) //Elevator B is Idle at floor 6
// Someone is on floor 3 and wants to go to the 7th floor. 
column.RequestElevator(3, "UP")
column.RequestFloor(0,7)

console.log("scenario 2")

column.RequestFloor(0, 10) 
column.RequestFloor(1, 3) 

column.RequestElevator(1, "UP")
column.RequestFloor(1, 6)

column.RequestElevator(3, "UP")
column.RequestFloor(1, 5)

column.RequestElevator(9, "DOWN")
column.RequestFloor(0, 2)

console.log("scenario 3")

column.RequestFloor(0, 10) 
column.RequestFloor(1, 3)
column.elevator_list[1].status = "UP"


column.RequestElevator(3, "DOWN")
column.RequestFloor(1, 6)
column.RequestFloor(0, 2)

column.RequestElevator(10, "DOWN")
column.RequestFloor(1, 3)
