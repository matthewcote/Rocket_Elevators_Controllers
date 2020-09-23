///////////////////////////-  Request_Button  -//////////////////////////////////////////

class Request_Button { // DEFINE Request_Button
    constructor(floor) { // USING floor
        this.floor = floor; // floor: floor,
        this.status = "IDLE"; // status: "IDLE"
    }
    // SEQUENCE request_button_pushed
    request_button_pushed(status) {
        this.status = "ACTIVE"; // SET request_button status TO "ACTIVE"
        if (status === "IDLE") { // IF elevator status is "IDLE"
            // CALL elevator push_floor_list WITH floor
            // TODO - logic broken here
            return; // RETURN 'OR ESCAPE SEQUENCE, BREAK SEQUENCE'
        } // ENDIF
        if (status === "UP") { // IF elevator status is "UP"
            if (1) { // IF request_button floor is more than elevator current_floor
                // CALL elevator push_floor_list WITH floor
                // TODO - logic broken here
                return; // RETURN 'OR ESCAPE SEQUENCE, BREAK SEQUENCE'
            } //ENDIF
        } // ENDIF 
        if (status === "DOWN") { // IF elevator status is "DOWN"
            if (1) { // IF request_button floor is more than elevator current_floor
                // CALL elevator push_floor_list WITH floor
                // TODO - logic broken here
                return; // RETURN 'OR ESCAPE SEQUENCE, BREAK SEQUENCE'
            } //ENDIF
        } // ENDIF 
        // 'TODO - now I think we got someone pushed a button they shouldn't have - stop             elevator, lock door, play music'
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
    constructor(display_number) { //USING number
        this.display_number = display_number; // SET display_number TO floor
    }
    set_display_number(floor) { // SEQUENCE set_display_number USING floor
        this.display_number = floor; // SET display_number TO floor

    } // ENDSEQUENCE
}  // ENDDEFINE

///////////////////////////-   Elavator    -/////////////////////////////////////

class Elevator { // DEFINE Elevator
    constructor(num, floor_num) { // USING num AND floor_num
        // name: num,
        this.name = num;
        // status: "IDLE", 'ELEVATOR can be IDLE, UP or DOWN'
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
        // floor_display: SET Floor_Display TO INSTATIATE Floor_Display
        this.Floor_Display = new Floor_Display(this.current_floor);

        for (var floor = 1; floor <= floor_num; floor++) { // SET floor TO 1; WHILE floor is less than or equal to column floor_num; INCREMENT floor
            /* TODO
                SET request_button TO INSTANTIATE Request_Button WITH floor
                PUSH request_button TO request_button_list
                SET door TO INSTANTIATE Door WITH floor
                PUSH door TO door_list
            */
        } // ENDWHILE
    }
    push_floor_list(floor) {
        // push floor TO floor_list 
        this.floor_list.push(floor);
        // CALL move 
        this.move();
    }
    move() {
        var direction = "NULL"; // SET direction TO "NULL"

        for (var i = this.floor_list.length - 1; i >= 0; i--) { // FOR EACH floor IN floor_list  
            if (this.floor_list[i] === this.current_floor) { // IF floor IS EQUAL TO current_floo
                this.floor_list.splice(i, 1); // REMOVE floor FROM floor_list
                this.stop(); // CALL stop 
            }
            else { // ELSE 'determine direction'
                // IF direction IS EQUAL TO "NULL" AND floor IS LESS THAN current_floor
                if (direction === "NULL" && this.floor_list[i] < this.current_floor) {
                    direction = "DOWN"; // SET direction TO "DOWN"
                    this.status = direction; // SET status TO direction
                    // INCREMENT current_floor by negative 1 
                    // 'TODO turn that into a function - maybe takes time'
                    this.current_floor -= 1;
                    this.move(); // CALL elevator move 
                } // ENDIF


                // IF direction IS EQUAL TO "NULL" AND floor IS MORE THAN current_floor
                if (direction === "NULL" && this.floor_list[i] > this.current_floor) {
                    direction = "UP"; // SET direction TO "UP"
                    this.status = direction; // SET status TO direction
                    // INCREMENT current_floor by 1 
                    // 'TODO turn that into a function - maybe takes time'
                    this.current_floor += 1;
                    this.move(); // CALL elevator move 
                } // ENDIF
            } // ENDIF
        } // ENDFOR
        this.status = "IDLE"; // SET status to "IDLE"
    }
    stop() {
        this.open_door(floor); // CALL open_door WITH floor
        
        for (var i = this.request_button_list.length - 1; i >= 0; i--) { // FOR EACH request_button in request_button_list
            if (this.request_button_list[i].floor === this.current_floor) {
                this.request_button_list[i].status === "IDLE"; // SET request_button status TO "IDLE"
            } // ENDIF   
        } // ENDFOR
        this.wait();
        
        if (this.floor_list.length === 0) {// IF floor_list IS EMPTY
        /*
                IF colum call_list is EMPTY
                    SET status TO "IDLE"
                    'TODO - ORIGIN LOGIC UPGRADE'
                ELSE
                    FOR EACH floor IN column call_list
                        PUSH floor TO elevator floor_list
                    ENDFOR
                    CALL move
                ENDIF
        */
        } else { // ELSE
            this.move();
        } //ENDIF
    }
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
        
        this.status = "ACTIVE"; // SET call_button status TO "ACTIVE" 'light of button comes on and stays on until elevator arrives'
        var best_diff = -1; // SET best_diff TO -1
        var elevator_choice = "NULL"; // SET elevator_choice to "NULL"
        
        /*
        FOR elevator IN elevator_list
            'first priority'
            IF elevator status is equal TO "IDLE" AND elevator floor is equal to call_button floor
                SET elevator_choice TO elevator name 'not null - might need it later'
                SET call_button status TO "IDLE"
                CALL elevator stop
            ENDIF
            'second priority'
            IF elevator status is equal TO "UP" AND call_button direction is equal to "UP" AND elevator floor is less than call_button floor AND elevator_choice is equal TO "NULL"
                SET diff TO call_button floor MINUS elevator florr 'set diff to positive integer'
                IF best_diff is equal TO negative one OR best_diff is more than diff
                    SET best_diff TO diff
                    SET elevator_choice TO elevator name
                ENDIF
            ENDIF
    
            IF elevator status is equal TO "DOWN" AND call_button direction is equal to "DOWN" AND elevator floor is more than call_button floor AND elevator_choice is equal TO "NULL"
                SET diff TO elevator floor MINUS call_button floor'set diff to positive integer'
                IF best_diff is equal TO negative one OR best_diff is more than diff
                    SET best_diff TO diff
                    SET elevator_choice TO elevator name
                ENDIF
            ENDIF
        ENDFOR 'end iteration '
    
        IF elevator_choice is EQUAL TO "NULL" 'first two priorities failed - third priority is any idle elevator call - best_diff still equals -1'
            FOR elevator IN elevator_list  'iterate through elevators in elevator_list'
                IF elevator status is equal TO "IDLE" AND elevator floor is more than floor
                    SET diff TO elevator floor MINUS call_button floor'set diff to positive integer'
                    IF best_diff is equal TO negative one OR best_diff is more than diff
                        SET best_diff TO diff
                        SET elevator_choice TO elevator name
                    ENDIF
                ENDIF
                IF elevator status is equal TO "IDLE" AND elevator floor is less than floor
                    SET diff TO call_button floor MINUS elevator floor'set diff to positive integer'
                    IF best_diff is equal TO negative one OR best_diff is more than diff
                        SET best_diff TO diff
                        SET elevator_choice TO elevator name
                    ENDIF
                ENDIF
            ENDFOR
        ENDIF
    
        IF elevator_choice is EQUAL TO "NULL" 'first three priorities failed
            PUSH call_button floor TO column call_wait_list
        ELSE 'one of the first three priorities passed, a elevator was chosen'
            FOR EACH elevator IN elevator_list
                IF elevator name is EQUAL TO elevator_choice
                    CALL elevator push_floor_list WITH call_button floor
                ENDIF
            ENDFOR
        ENDIF
    */
    }
} // ENDDEFINE

/////////////////////////-   Column    -///////////////////////////////////////////

class Column { // DEFINE Column USING floor_num AND elevator_num 
    constructor(mode, floor_num, elevator_num) { // USING mode AND floor_num AND elevator_num 
        this.mode = mode; //column_operation_mode: column_operation_mode,
        this.floor_num = floor_num; //   floor_num: floor_num,
        this.elevator_num = elevator_num; //   floor_num: floor_num,
        this.elevator_list = []; //  elevator_list: SET TO EMPTY List,
        this.call_button_list = []; //  call_button_list: SET TO EMPTY List,
    }
    fill_elevator_list() { // SEQUENCE fill_elevator_list
        for (var num = 1; num <= this.elevator_num; num++) { // SET num TO 1 ;WHILE num is less than or equal TO elevator_num ;INCREMENT num 
            var elevator = new Elevator(num); // SET elevator TO INSTANTIATE Elevator WITH num
            this.elevator_list.push(elevator); // // PUSH elevator TO elevator_list 
        } // ENDWHILE
    }
    fill_call_button_list(floor_num) { // SEQUENCE fill_call_button_list USING floor_num
        for (var floor = 1; floor <= this.floor_num; floor++) { // SET floor TO 1; WHILE floor is less than or equal TO floor_num' INCREMENT floor
            // IF floor is not equal TO 1 
            if (floor !== 1) {
                // SET call_button direction to "DOWN"
                // SET call_button TO INSTANTIATE Call_Button USING floor AND direction
                // PUSH call_button TO call_button_list 
            } // ENDIF

            // IF floor is not equal TO floor_num
            // SET call_button direction TO "UP"
            // SET call_button TO INSTANTIATE Call_Button USING floor AND direction
            // PUSH call_button to call_button_list
            // ENDIF
        } // ENDWHILE
    }
} //ENDDEFINE

///////////////////////////////////////////////////////////////////////////////////////
