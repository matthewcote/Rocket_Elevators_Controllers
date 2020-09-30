

class Floor_Display #Define floor_display
    def initialize(display_number, display_number) #USING display_number AND display_number
        @display_number = display_number
        @display_direction = display_number
    end
    
    def set_display(floor, direction) #SEQUENCE set_display USING floor and direction
        @display_number = floor
        @dispaly_direction = direction
    end

class Elevator_Door 
    @door_status = "ClOSED"

    def open_door
        @door_status = "OPEN"
    end

    def close_door 
        @door_status = "CLOSED"
    end
    def elevator_door_alert 
        open_door
        wait
    end  


class Door 
    def initialize(floor)
        @floor = floor
        @status = "IDLE"
    end
    def open_door
        @door_status = "OPEN"
    end
    def close_door 
        @door_status = "CLOSED"
    end
    def elevator_door_alert 
        open_door()
        wait()
    end

class Call_Button 
    def initialize(floor)
        @floor =  floor
        @status = "IDLE" 
    end


class Elevator_
    def initialize(num, bottom_floor, top_floor):
        @num = num
        @status = "IDLE" 
        @current_floor = 1 
        @door_list = Array.new 
        @button_list = Array.new
        @floor_list = Array.new 
        @door = Door()
        @floor_display = Floor_Display(@current_floor, @status) 
        floor = bottom_floor 
        while floor <= top_floor: 
            door = Floor_Door(floor) 
            @door_list.push(door) 
            button = Button(floor)
            @button_list.push(button)
            floor += 1 

    def push_floor_list(self, floor): 
        @floor_list.push(floor) 
        @status = "ACTIVE"
        button_list[floor-1].activate()
        move() 

    def move(self): 
        for floor in @floor_list:    
            if floor == @current_floor then
                @floor_list.remove(floor) 
                @stop()
            end
            if floor < @current_floor then
                @status = "DOWN" 
                print("Elevator ", @num ,":")
                @floor_display.set_display(@current_floor, @status) 
                @current_floor -= 1 
                move
            end
            if floor > @current_floor then
                @status = "UP"
                print("Elevator ", @num ,":")
                @floor_display.set_display(@current_floor, @status)
                @current_floor += 1
                move
            end
        end
    end
    def stop()
        @open_doors(@current_floor) 
        print('Elevator ', @num, ': stopped at :', @current_floor)
        @button_list[@current_floor-1].deactivate()
        wait

        @close_doors(@current_floor) 
            
        if not @floor_list then
            @status = "IDLE" 
            @floor_display.set_display(@current_floor, @status)
        else
            move
        end
    end
    def wait(): 
        @status = "IDLE" #'TODO - can add a wait variable to be set when initializing column or change to like 3 seconds'
    end
    def close_doors(floor)
        @door.close_door()
        for door in @door_list:
            if door.floor == floor:
                door.close_door() 
            end
        end
    end

    def open_doors(floor): 
        @door.open_door() 
        for door in @door_list: 
            if door.floor == floor:
                door.open_door()
            if
        if
    if

class Column:
    def initialize(num, bottom_floor, top_floor, elevator_num): 
        @num = num
        @elevator_list = Array.new
        @call_button_list = Array.new 
        @bottom_floor = bottom_floor 
        @top_floor = top_floor 
        @elevator_num = elevator_num 
        @fill_elevator_list() 
        @fill_call_button_list() 
    end
    def fill_elevator_list(self): 
        num = 0 
        while num < @elevator_num: 
            elevator = Elevator_(num, @bottom_floor, @top_floor) 
            @elevator_list.push(elevator) 
            num += 1 
        end
    end
    def fill_call_button_list(self): 
        floor = @bottom_floor+1
        while floor < @top_floor: 
            call_button = Call_Button(floor, "UP") 
            @call_button_list.push(call_button)
            call_button = Call_Button(floor, "DOWN") 
            @call_button_list.push(call_button)
            floor += 1
        end
        @call_button_list.push(Call_Button(@top_floor, "DOWN")) 
        @call_button_list.push(Call_Button(@bottom_floor, "UP"))
    end
    def findIdle(self, floor)

        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in @elevator_list
            if elevator.status == "IDLE"
                if elevator.current_floor >= floor
                    diff = elevator.current_floor - floor 
                    if diff < best_diff
                        elevator_choice = elevator
                        best_diff = diff 
                    end
                end

                if elevator.current_floor <= floor
                    diff = floor - elevator.current_floor
                    if diff < best_diff:
                        elevator_choice = elevator 
                        best_diff = diff 
                    end
                end
            end
        end
        if elevator_choice != "NULL"
            print('Column ', @num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor)
            return 
        end
    def findDown(self, floor)
        for call_button in @call_button_list
            if call_button.floor == floor and call_button.direction == "DOWN":
                print("this happens")
                call_button.activated() #For production remove ', direction' - not necessary for operation - just demonstation via console
            end
        end
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in @elevator_list
            if elevator.current_floor < floor and elevator.status == "DOWN":
                diff = abs(floor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff
                end
            end
        end
        if elevator_choice != "NULL": 
            print('Column ', @num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            return
        else
            @findIdle(floor)
        end
        for call_button in @call_button_list:
            if call_button.floor == floor and call_button.direction == "DOWN":
                call_button.deactivated() #For production remove ', direction' - not necessary for operation - just demonstation via console
            end
        end
    end
    def findUp(self, floor)
        for call_button in @call_button_list:
            if call_button.floor == floor and call_button.direction == "UP"
                call_button.activated() #For production remove ', direction' - not necessary for operation - just demonstation via console
            end
        end
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in @elevator_list
            if elevator.current_floor < floor and elevator.status == "UP"
                diff = abs(floor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff
                end
            end
        end
        if elevator_choice != "NULL"
            print('Column ', @num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            return
        else
            @findIdle(floor)
        for call_button in @call_button_list
            if call_button.floor == floor and call_button.direction == "UP"
                call_button.deactivated() #For production remove ', direction' - not necessary for operation - just demonstation via console
            end
        end
    def RequestElevator(self, RequestedFloor, Direction): #Call_Button pushed

        if Direction == "UP":
            @findUp(RequestedFloor)
        end
        if Direction == "DOWN":
            @findDown(RequestedFloor)
        end
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in @elevator_list
            if elevator.current_floor < RequestedFloor and elevator.status == "DOWN":
                diff = abs(RequestedFloor - elevator.current_floor) 
                if diff < best_diff
                    elevator_choice = elevator 
                    best_diff = diff
                end
            end
        end
        if elevator_choice != "NULL"
            print('Column ', @num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(RequestedFloor) 
            return
        else
            @findIdle(RequestedFloor)
        end
    end
    def RequestFloor(self, Elevator, RequestedFloor): #Request_Button pushed
            @elevator_list[Elevator].push_floor_list(RequestedFloor)
    
if __name__ == '__main__':
    print('Test Scenario 1 - press enter to execute')
    input()
    ## Residential Scenario
    column = Column(1, 1, 10, 2)
    print("column created")
    print(" ")
    print("scenario 1")
    print(" ")
    print("Elevator A is Idle at floor 2")
    column.RequestFloor(0, 2)
    print(" ")
    print("Elevator B is Idle at floor 6")
    column.RequestFloor(1, 6)
    print(" ")
    print("Someone is on floor 3 ")
    column.RequestElevator(3, "UP")
    print(" ")
    print("and wants to go to the 7th floor.")
    column.RequestFloor(0, 7)
    print(" ")
    print("Test Scenario 1 - Complete")
    print(" ")

    print("scenario 2 - press enter to execute")
    input()
    print(" ")
    print("Elevator A is Idle at floor 10")
    column.RequestFloor(0, 10)
    print(" ")
    print("Elevator B is Idle at floor 3")
    column.RequestFloor(1, 3)
    print(" ")
    print("Someone is on floor 3 ")
    column.RequestElevator(1, "UP")
    print(" ")
    print("and wants to go to the 6th floor.")
    column.RequestFloor(1, 6)
    print(" ")
    print(" ")
    print("2 minutes later, someone else is on the 3rd floor and requests the 5th floor.")
    column.RequestElevator(3, "UP")
    column.RequestFloor(1, 5)
    print(" ")
    print("Finally, a third person is at floor 9 and wants to go down to the 2nd floor.")
    column.RequestElevator(9, "DOWN")
    column.RequestFloor(0, 2)
    print("Test Scenario 2 - Complete")   
    print("")
    print("scenario 3- press enter to execute")
    input()
    
    print("Elevator A is Idle at floor 10")
    column.RequestFloor(0, 10)
    print("Elevator B is moving from floor 3 to floor 6")
    column.RequestFloor(1, 3)
    column.elevator_list[1].status = "UP" #is this acceptable solution for scenario 3?
    print("Someone is on floor 3")
    column.RequestElevator(3, "DOWN")
    print("and requests the second.")
    column.RequestFloor(0, 2)
    column.RequestFloor(1, 6)
    print(" ")
    print("5 minutes later, someone else is on the 10th floor ")
    column.RequestElevator(10, "DOWN")
    print("and wants to go to the 3rd.")
    column.RequestFloor(1, 3)
    print("")
    print("simulation complete - press enter to exit")
    input()

    

    
    