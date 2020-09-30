////////////////////// - Request - Button - /////////////////////////////////

class Request_Button { // DEFINE Request_Button
    constructor(floor, status) { // USING floor
        this.floor = floor; // floor: floor,
        this.status = status;
    }

    activate() {
        this.status = "ACTIVE"
        console.log("Request button with floor " + this.floor + " is now ACTIVE")
    }
    deactivate() {
        this.status = "IDLE"
        console.log("Request button with floor " + this.floor + " is now IDLE")
    }
} // ENDDEFINE

///////////////////////////-  Door  -//////////////////////////////////////////

class Door { // DEFINE Door
    constructor() { // USING floor
        this.status = "CLOSED"; // status: "IDLE"
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

class Floor_Door { // DEFINE Edoor
    constructor(floor) {
        this.status = "CLOSED"
        this.floor = floor;
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
        console.log("Elevator " + (elevator_num + 1) + ": Display Number: " + this.display_number + "  Direction: " + this.display_direction);
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
        this.door = new Door();
        // floor_dispaly: SET floor_display to INSTATIATE Floor_Display WITH current_floor
        this.floor_display = new Floor_Display(this.current_floor);
        this.floor_display.set_display(this.name, this.current_floor, this.status)
        
        for (var floor = 1; floor <= floor_num; floor++) { // SET floor TO 1; WHILE floor is less than or equal to column floor_num; INCREMENT floor
            var request_button = new Request_Button(floor); // SET request_button TO INSTANTIATE Request_Button WITH floor
            this.request_button_list.push(request_button); // PUSH request_button TO request_button_list
            var floor_door = new Floor_Door(floor); // SET door TO INSTANTIATE Door WITH floor
            this.door_list.push(floor_door) // PUSH door TO door_list 
		} // ENDWHILE
    }
	push_floor_list(floor) {
        // push floor TO floor_list 
        for (var i = 0; i < this.request_button_list.length; i++) {
            if (this.request_button_list[i].floor == floor){
                this.request_button_list[i].activate();
            }

        }
        console.log("column chose Elevator :" + (this.name + 1))
        console.log("")
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
                    this.sleep(100)
                    this.move(); // CALL elevator move 
                } // ENDIF
                // IF direction IS EQUAL TO "NULL" AND floor IS MORE THAN current_floor
                if (direction === "NULL" && this.floor_list[i] > this.current_floor) {
                    direction = "UP"; // SET direction TO "UP"
                    this.status = direction; // SET status TO direction
                    this.floor_display.set_display(this.name, this.current_floor, this.status)// 'TODO turn that into a function - maybe takes time'
                    this.current_floor += 1;
                    this.sleep(100)
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
                this.request_button_list[i].deactivate();
            } // ENDIF   
        } // ENDFOR
        this.sleep(100)
        this.status = "IDLE"
        this.floor_display.set_display(this.name, this.current_floor, this.status)
        console.log("")
        console.log("Elevator " + (this.name + 1) + " arrived at destination.")
        console.log("")
        this.open_doors()
        this.sleep(1000)
        this.close_doors()
        if (this.floor_list.length !== 0) {// IF floor_list IS EMPTY
            this.move();            
        } 
    };
    close_doors() {
        this.door.status = "CLOSED"
        console.log("Elevator " + (this.name + 1) + "  Door: Status: " + this.door.status)
        for (var i = this.door_list.length - 1; i >= 0; i--) { // FOR EACH request_button in request_button_list
            if (this.door_list[i].floor == this.current_floor) {
                this.door_list[i].status = "CLOSED";
                console.log("Elevator " + (this.name + 1) + " Floor " + this.door_list[i].floor + " Door: Status: " + this.door_list[i].status)
            } // ENDIF   
        } // ENDFOR
    }
    open_doors() {
        this.door.status = "OPENED"
        console.log("Elevator " + (this.name + 1) + "  Door: Status: " + this.door.status)
        for (var i = this.door_list.length - 1; i >= 0; i--) { // FOR EACH request_button in request_button_list
            if (this.door_list[i].floor === this.current_floor) {
                this.door_list[i].status = "OPENED";
                console.log("Elevator " + (this.name + 1) + " Floor " + this.door_list[i].floor + ": Status: " + this.door_list[i].status)
            } // ENDIF   
        } // ENDFOR
    }
        
    sleep(milliseconds) { // SOURCED VIA https://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing?noredirect=1&lq=1
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
    }
} //ENDDEFINE

//////////////////////////////-  Call_Button  -///////////////////////////////////

class Call_Button { // DEFINE Call_Button 
    constructor(floor, direction) { // USING floor AND direction 
        this.floor = floor;
        this.direction = direction; // direction: direction,
        this.status = "IDLE"
	}
    
    activated() {
        this.status = "ACTIVE"
        console.log("Call Button on floor " + this.floor + " with " + this.direction + "  direction  is  --- " + this.status)
    };

    deactivated() {
        this.status == "IDLE"
        console.log("Call Button on floor " + this.floor + " with " + this.direction + "  direction  is  --- " + this.status)
    };
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
            var elevator = new Elevator(num, this.floor_num); // SET elevator TO INSTANTIATE Elevator WITH num AND floor_num
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
        for (var i = 0; i < this.call_button_list.length; i++){
            if (this.call_button_list[i].direction === "UP" && this.call_button_list[i].floor === floor) {
                this.call_button_list[i].activated() 
            }
        }
        for (var i = 0; i < this.elevator_list.length; i++){ // FOR EACH elevator IN elevator_list 
            if (this.elevator_list[i].current_floor < floor && this.elevator_list[i].status === "UP") {  
                diff = Math.abs(this.elevator_list[i].floor - floor); // SET diff to elevator floor minus call_button floor
                if (diff < best_diff) { // IF diff is less than best_diff'
                    elevator_choice = i;  //  SET elevator_choice TO elevator
                    best_diff = diff;// SET best_diff to diff
                } // ENDIF    
            } // ENDIF           
        }
        if (elevator_choice !== "NULL") { // IF elevator choice does not equal null'
                console.log("column chose elevator: " + (elevator_choice + 1))
				this.elevator_list[elevator_choice].push_floor_list(floor)// CAll elevator push_floor_list WITH call_button floor
                return; // RETURN from SEQUENCE
        } else {
            this.LookIdle(floor)
        }
        for (var i = 0; i < this.call_button_list.length; i++){
            if (this.call_button_list[i].direction == "UP" && this.call_button_list[i].floor == floor) {
                this.call_button_list[i].deactivated() 
            }
        }
    
    }
    LookDown(floor) {
        var elevator_choice = "NULL";
        var diff = 0; // SET diff TO 0
        var best_diff = 999; // SET best_diff TO 9999
        for (var i = 0; i < this.call_button_list.length; i++){
            if (this.call_button_list[i].direction == "DOWN" && this.call_button_list[i].floor == floor) {
                this.call_button_list[i].activated() 
            }
        }
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
                console.log("column chose elevator: " + (elevator_choice + 1))
				this.elevator_list[elevator_choice].push_floor_list(floor)// CAll elevator push_floor_list WITH call_button floor
                return; // RETURN from SEQUENCE
        } else {
            this.LookIdle(floor)
        }
        for (var i = 0; i < this.call_button_list.length; i++){
            if (this.call_button_list[i].direction == "DOWN" && this.call_button_list[i].floor == floor) {
                this.call_button_list[i].deactivated() 
            }
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
        this.elevator_list[Elevator].push_floor_list(RequestedFloor);
    }

} //ENDDEFINE

///////////////////////////////////////////////////////////////////////////////////////
console.log("created column")		
var column = new Column(10, 2);
console.log("scenario 1")
console.log("")
column.RequestFloor(0,2) //Elevator A is Idle at floor 2 
column.RequestFloor(1,6) //Elevator B is Idle at floor 6
// Someone is on floor 3 and wants to go to the 7th floor. 
column.RequestElevator(3, "UP")
column.RequestFloor(0,7)
console.log("")
console.log("scenario 2")
console.log("")
column.RequestFloor(0, 10) 
column.RequestFloor(1, 3) 

column.RequestElevator(1, "UP")
column.RequestFloor(1, 6)

column.RequestElevator(3, "UP")
column.RequestFloor(1, 5)

column.RequestElevator(9, "DOWN")
column.RequestFloor(0, 2)
console.log("")
console.log("scenario 3")
console.log("")
column.RequestFloor(0, 10) 
column.RequestFloor(1, 3)
column.elevator_list[1].status = "UP"


column.RequestElevator(3, "DOWN")
column.RequestFloor(1, 6)
column.RequestFloor(0, 2)

column.RequestElevator(10, "DOWN")
column.RequestFloor(1, 3)
