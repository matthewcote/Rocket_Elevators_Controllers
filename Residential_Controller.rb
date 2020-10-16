class Floor_Display #Define floor_display
    attr_reader :display_number, :display_direction

    def initialize(display_number, display_direction) #USING display_number AND display_number
        @display_number = display_number
        @display_direction = display_number
    end
    
    def set_display(num, floor, direction) #SEQUENCE set_display USING floor and direction
        @display_number = floor
        @display_direction = direction
        if num == 0
            character = 'A'
        end
        if num == 1
            character = 'B'
        end 
        print("El: ", character, " Flr: ", floor, " Dir: ", direction, "-> ")
    end

end

class Door 

    attr_reader :status

    def initialize()
        @status = "ClOSED"
    end

    def open_door
        @status = "OPEN"
    end

    def close_door 
        @status = "CLOSED"
    end

    def door_alert 
        open_door
        wait
    end  

end


class FloorDoor 

    attr_reader :floor, :status

    def initialize(floor)
        @floor = floor
        @status = "IDLE"
    end

    def open_door
        @status = "OPEN"
    end

    def close_door 
        @status = "CLOSED"
    end

    def elevator_door_alert 
        open_door()
        wait()
    end

end

class button
    attr_reader :floor, :status

    def initialize(floor)
        @floor =  floor
        @status = "IDLE" 
    end
end

class Call_Button 

    attr_reader :direction, :floor, :status

    def initialize(floor, direction)
        @direction = direction
        @floor =  floor
        @status = false 
    end

    def SetOpen(open)
        @status = open
        if @status == true
            print("Call Button with floor ", @floor, "and direction " , @direction , " is Activeated")
        else
            print("Call Button with floor ", @floor, "and direction " , @direction , " is Deactiveated")
        end
    end
end

class Request_Button

    attr_reader :floor, :status

    def initialize(floor)
        @floor =  floor
        @status = false 
    end

    def SetOpen(open)
        @status = open
        if @status == true
            print("Call Button with floor ", @floor, " is Activeated")
        else
            print("Call Button with floor  ", @floor, " is Deactiveated")
        end
    end
end

class Elevator_
    attr_reader :num, :bottom_floor, :top_floor, :status, :current_floor, :floor_list, :floor_display
    def initialize(num, bottom_floor, top_floor)
        @num = num
        @status = "IDLE" 
        @current_floor = 1 
        @door_list = Array.new 
        @button_list = Array.new
        @floor_list = Array.new 
        @door = Door.new()
        @floor_display = Floor_Display.new(@current_floor, @status) 
        floor = bottom_floor 
        while floor <= top_floor
            floordoor = FloorDoor.new(floor) 
            @door_list.push(floordoor) 
            button = Request_Button.new(floor)
            @button_list.push(button)
            floor += 1 
        end
    end
    
    def push_floor_list(floor)
        @floor_list.push(floor) 
        @status = "ACTIVE"
        @button_list[floor-1].activate()
        move()
    end

    def move()
        for floor in @floor_list
            if floor == @current_floor then
                @floor_list.delete(floor) 
                stop()
            end
            if floor < @current_floor then
                @status = "DOWN"
                @floor_display.set_display(@num, @current_floor, @status)
                @current_floor -= 1 
                move
            end
            if floor > @current_floor then
                @status = "UP"
                @floor_display.set_display(@num, @current_floor, @status)
                @current_floor += 1
                move
            end
        end
    end

    def stop()
        if @num == 0
            character = 'A'
        end
        if @num == 1
            character = 'B'
        end
        open_doors(@current_floor) 
        print('ELEVATOR: ', character, ' ARRIVED AT: ', @current_floor, "\n")
        @button_list[@current_floor-1].deactivate()
        wait()

        close_doors(@current_floor) 
            
        if @floor_list.empty? then
            @status = "IDLE" 
            @floor_display.set_display(@num, @current_floor, @status)
        else
            move()
        end
    end

    def wait()
        @status = "IDLE" #'TODO - can add a wait variable to be set when initializing column or change to like 3 seconds'
    end

    def close_doors(floor)
        if @num == 0
            character = 'A'
        end
        if @num == 1
            character = 'B'
        end
        
        
        
        @door.close_door()
        print "Elevator ", character, " - Closing Door-->\n"
        for door in @door_list do
            if door.floor == floor
                @door.close_door()
                print "Elevator ", character, " - Closing Floor Door - ", @current_floor, "-->\n"
            end
        end
    end

    def open_doors(floor)
        if @num == 0
            character = 'A'
        end
        if @num == 1
            character = 'B'
        end
        @door.open_door() 
        print "Elevator ", character, " - Opening Door-->\n"
        for door in @door_list do
            if door.floor == floor
                @door.open_door()
                print "Elevator ", character, " - Opening Floor Door - ", @current_floor, "-->\n"
            end
        end
    end

    def set_status(status)
        @status = status
        @floor_display.set_display(@num, @current_floor, @status)
    end
end

class Column

    attr_reader :num, :bottom_floor, :top_floor, :elevator_num, :elevator_list

    def initialize(num, bottom_floor, top_floor, elevator_num)
        @num = num
        @elevator_list = Array.new
        @call_button_list = Array.new 
        @bottom_floor = bottom_floor 
        @top_floor = top_floor 
        @elevator_num = elevator_num 
        self.fill_elevator_list() 
        self.fill_call_button_list() 
    end

    def fill_elevator_list()
        num = 0 

        while num < @elevator_num
            elevator = Elevator_.new(num, @bottom_floor, @top_floor) 
            @elevator_list.push(elevator) 
            num += 1 
        end

    end

    def fill_call_button_list() # Classic columns
        floor = @bottom_floor+1

        while floor < @top_floor
            call_button = Call_Button.new(floor, "UP") 
            @call_button_list.push(call_button)
            call_button = Call_Button.new(floor, "DOWN") 
            @call_button_list.push(call_button)
            floor += 1
        end

        @call_button_list.push(Call_Button.new(@top_floor, "DOWN")) 
        @call_button_list.push(Call_Button.new(@bottom_floor, "UP"))
    end

    def findIdle(floor)
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 

        for elevator in @elevator_list do

            if elevator.status == "IDLE" then
            
                if elevator.current_floor >= floor then
                    diff = elevator.current_floor - floor 

                    if diff < best_diff then
                        elevator_choice = elevator
                        best_diff = diff 
                    end

                end

                if elevator.current_floor <= floor then
                    diff = floor - elevator.current_floor

                    if diff < best_diff then
                        elevator_choice = elevator 
                        best_diff = diff 
                    end
                end
            end
        end

        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            print 'COLUMN CHOSE ELEVATOR ', character, "-->\n"
            elevator_choice.push_floor_list(floor)
            
            return 
        end

    end

    def findDown(floor)

        for call_button in @call_button_list do

            if call_button.floor == floor and call_button.direction == "DOWN" then
                call_button.activated() #For production delete ', direction' - not necessary for operation - just demonstation via console
            end

        end

        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 

        for elevator in @elevator_list do

            if elevator.current_floor < floor and elevator.status == "DOWN" then
                diff = abs(floor - elevator.current_floor) 

                if diff < best_diff then
                    elevator_choice = elevator 
                    best_diff = diff
                end

            end

        end

        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            printf('COLUMN CHOSE ELEVATOR ', character, "-->\n")
            elevator_choice.push_floor_list(floor)
            
            return 
            elevator_choice.push_floor_list(floor) 
            return
        else
            findIdle(floor)
        end

        for call_button in @call_button_list do

            if call_button.floor == floor and call_button.direction == "DOWN" then
                call_button.deactivated() #For production delete ', direction' - not necessary for operation - just demonstation via console
            end

        end

    end

    def findUp(floor)
        
        for call_button in @call_button_list do
            
            if call_button.floor == floor and call_button.direction == "UP" then
                call_button.activated() #For production delete ', direction' - not necessary for operation - just demonstation via console
            end

        end
        
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 

        for elevator in @elevator_list do

            if elevator.current_floor < floor and elevator.status == "UP" then
                diff = abs(floor - elevator.current_floor) 

                if diff < best_diff then
                    elevator_choice = elevator 
                    best_diff = diff
                end

            end

        end
        
        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            printf('COLUMN CHOSE ELEVATOR ', character, "-->\n")
            elevator_choice.push_floor_list(floor)
            
            return 
            elevator_choice.push_floor_list(floor) 
            return
        
        else
            self.findIdle(floor)
        
            for call_button in @call_button_list do

                if call_button.floor == floor and call_button.direction == "UP" then
                    call_button.deactivated() #For production delete ', direction' - not necessary for operation - just demonstation via console
                end

            end
        end

    end
    def requestElevator(requestedFloor, direction) #Call_Button pushed

        if direction == "UP" then
            self.findUp(requestedFloor)
        end

        if direction == "DOWN" then
            self.findDown(requestedFloor)
        end

        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        
        for elevator in @elevator_list do
            
            if elevator.current_floor < requestedFloor and elevator.status == "DOWN" then
                diff = abs(requestedFloor - elevator.current_floor) 
                
                if diff < best_diff then
                    elevator_choice = elevator 
                    best_diff = diff
                end

            end

        end

        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            printf('COLUMN CHOSE ELEVATOR ', character, "-->\n")
            elevator_choice.push_floor_list(floor)
            
            return 
            elevator_choice.push_floor_list(requestedFloor) 
            return
        else
            self.findIdle(requestedFloor)
        end

    end

    def requestFloor(elevator, requestedFloor) #Request_Button pushed   
        if elevator == 0
            character = 'A'
        end
        if elevator == 1
            character = 'B'
        end     
        print "PUSHED ELEVATOR ", character, "  Requested Floor - ", requestedFloor, "-->\n"
        @elevator_list[elevator].push_floor_list(requestedFloor)

    end
    
end

class ModColumn

    attr_reader :num, :bottom_floor, :top_floor, :elevator_num, :elevator_list

    def initialize(num, bottom_floor, top_floor, elevator_num)
        @num = num
        @elevator_list = Array.new
        @call_button_list = Array.new 
        @bottom_floor = bottom_floor 
        @top_floor = top_floor 
        @elevator_num = elevator_num 
        self.fill_elevator_list() 
        self.fill_call_button_list() 
    end

    def fill_elevator_list()
        num = 0 

        while num < @elevator_num
            elevator = Elevator_.new(num, @bottom_floor, @top_floor) 
            @elevator_list.push(elevator) 
            num += 1 
        end

    end

    def fill_call_button_list() # Classic columns
        floor = @bottom_floor+1

        while floor < @top_floor
            call_button = Call_Button.new(floor, "UP") 
            @call_button_list.push(call_button)
            call_button = Call_Button.new(floor, "DOWN") 
            @call_button_list.push(call_button)
            floor += 1
        end

        @call_button_list.push(Call_Button.new(@top_floor, "DOWN")) 
        @call_button_list.push(Call_Button.new(@bottom_floor, "UP"))
    end

    def findIdle(floor)
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 

        for elevator in @elevator_list do

            if elevator.status == "IDLE" then
            
                if elevator.current_floor >= floor then
                    diff = elevator.current_floor - floor 

                    if diff < best_diff then
                        elevator_choice = elevator
                        best_diff = diff 
                    end

                end

                if elevator.current_floor <= floor then
                    diff = floor - elevator.current_floor

                    if diff < best_diff then
                        elevator_choice = elevator 
                        best_diff = diff 
                    end
                end
            end
        end

        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            print 'COLUMN CHOSE ELEVATOR ', character, "-->\n"
            elevator_choice.push_floor_list(floor)
            
            return 
        end

    end

    def findDown(floor)

        for call_button in @call_button_list do

            if call_button.floor == floor and call_button.direction == "DOWN" then
                call_button.activated() #For production delete ', direction' - not necessary for operation - just demonstation via console
            end

        end

        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 

        for elevator in @elevator_list do

            if elevator.current_floor < floor and elevator.status == "DOWN" then
                diff = abs(floor - elevator.current_floor) 

                if diff < best_diff then
                    elevator_choice = elevator 
                    best_diff = diff
                end

            end

        end

        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            printf('COLUMN CHOSE ELEVATOR ', character, "-->\n")
            elevator_choice.push_floor_list(floor)
            
            return 
            elevator_choice.push_floor_list(floor) 
            return
        else
            findIdle(floor)
        end

        for call_button in @call_button_list do

            if call_button.floor == floor and call_button.direction == "DOWN" then
                call_button.deactivated() #For production delete ', direction' - not necessary for operation - just demonstation via console
            end

        end

    end

    def findUp(floor)
        
        for call_button in @call_button_list do
            
            if call_button.floor == floor and call_button.direction == "UP" then
                call_button.activated() #For production delete ', direction' - not necessary for operation - just demonstation via console
            end

        end
        
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 

        for elevator in @elevator_list do

            if elevator.current_floor < floor and elevator.status == "UP" then
                diff = abs(floor - elevator.current_floor) 

                if diff < best_diff then
                    elevator_choice = elevator 
                    best_diff = diff
                end

            end

        end
        
        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            printf('COLUMN CHOSE ELEVATOR ', character, "-->\n")
            elevator_choice.push_floor_list(floor)
            
            return 
            elevator_choice.push_floor_list(floor) 
            return
        
        else
            self.findIdle(floor)
        
            for call_button in @call_button_list do

                if call_button.floor == floor and call_button.direction == "UP" then
                    call_button.deactivated() #For production delete ', direction' - not necessary for operation - just demonstation via console
                end

            end
        end

    end
    def requestElevator(requestedFloor, direction) #Call_Button pushed

        if direction == "UP" then
            self.findUp(requestedFloor)
        end

        if direction == "DOWN" then
            self.findDown(requestedFloor)
        end

        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        
        for elevator in @elevator_list do
            
            if elevator.current_floor < requestedFloor and elevator.status == "DOWN" then
                diff = abs(requestedFloor - elevator.current_floor) 
                
                if diff < best_diff then
                    elevator_choice = elevator 
                    best_diff = diff
                end

            end

        end

        if elevator_choice != "NULL" then
            if elevator_choice.num == 0
                character = 'A'
            end
            if elevator_choice.num == 1
                character = 'B'
            end
            printf('COLUMN CHOSE ELEVATOR ', character, "-->\n")
            elevator_choice.push_floor_list(floor)
            
            return 
            elevator_choice.push_floor_list(requestedFloor) 
            return
        else
            self.findIdle(requestedFloor)
        end

    end

    def requestFloor(elevator, requestedFloor) #Request_Button pushed   
        if elevator == 0
            character = 'A'
        end
        if elevator == 1
            character = 'B'
        end     
        print "PUSHED ELEVATOR ", character, "  Requested Floor - ", requestedFloor, "-->\n"
        @elevator_list[elevator].push_floor_list(requestedFloor)

    end
    
end

column = Column.new(1, 1, 10, 2)
print "column created\n"
print " \n"
print "scenario 1\n"
print " \n"
column.requestFloor(0, 2)
print " \n"
column.requestFloor(1, 6)
print " \n"
column.requestElevator(3, "UP")
print " \n"
column.requestFloor(0, 7)
print " \n"
print "Test Scenario 1 - Complete\n"
print " \n"

print "scenario 2 -\n"
print " \n"

column.requestFloor(0, 10)
print " "

column.requestFloor(1, 3)
print " \n"
column.requestElevator(1, "UP")
print " \n"
column.requestFloor(1, 6)
print " \n"
column.requestElevator(3, "UP")
print " \n"
column.requestFloor(1, 5)
print " \n"
column.requestElevator(9, "DOWN")
print " \n"
column.requestFloor(0, 2)
print "Test Scenario 2 - Complete\n"
print "\n"
print "scenario 3 - \n"
print "\n"
column.requestFloor(0, 10)
print " \n"
column.requestFloor(1, 3)
column.elevator_list[1].set_status("UP") #is this acceptable solution ruby t scenario 3?
print " \n"
column.requestElevator(3, "DOWN")
print " \n"
column.requestFloor(0, 2)
print " \n"
column.requestFloor(1, 6)
print " \n"
column.requestElevator(10, "DOWN")
print " \n"
column.requestFloor(1, 3)
print " \n"
print "Simulation Completed \n"



