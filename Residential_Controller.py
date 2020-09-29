class Floor_Display: 
    def __init__(self, display_number, display_status):
        if display_number == 1:
            display_number = "RC" 
        
        self.display_number = display_number 
        self.display_status = display_status 
    
    def set_display(self, floor, status):
        if floor == 0:
            return   
        self.display_number = floor
        self.display_status = status 
        print('Floor display shows ', self.display_number, 'with ', self.display_status, ' status')

class Door: 
    def __init__(self): 
        self.status = "CLOSED" 

    def open_door(self):
        self.status = "OPEN"
        print("Elevator Door - ", self.status)

    def close_door(self):
        self.status = "CLOSED"
        print("Elevator Door - ", self.status)

    def alert(self):
        self.open_door()

class Floor_Door(Door):
    def __init__(self, floor): 
        Door.__init__(self)
        self.floor = floor 

    def open_door(self):
        self.status = "OPEN"
        print("Elevator Floor", self.floor, " Door - ", self.status)

    def close_door(self):
        self.status = "CLOSED"
        print("Elevator Floor", self.floor, " Door - ", self.status)

class Call_Button:
    def __init__(self, floor, direction): 
        self.floor = floor 
        self.direction = direction
        self.status = "IDLE" 
    def call_button_push(self, elevator_list): 
        self.status = "ACTIVE" 
        elevator_choice = "NULL"
        diff = 0
        best_diff = 9999
        for elevator in elevator_list:
            if elevator.current_floor > self.floor and elevator.status == "DOWN":
                diff = elevator.current_floor - self.floor
                if diff < best_diff:
                    elevator_choice = elevator
                    best_diff = diff

        if elevator_choice != "NULL":
            elevator.push_floor_list(self.floor)
            return

        for elevator in elevator_list: 
            if elevator.status == "IDLE": 
                if elevator.current_floor > self.floor: 
                    diff = elevator.current_floor - self.floor 
                    if diff < best_diff:
                        elevator_choice = elevator 
                        best_diff = diff
                diff = self.floor - elevator.current_floor 
                if diff < best_diff: 
                    elevator_choice = elevator
                    best_diff = diff

        if elevator_choice != "NULL":
            elevator.push_floor_list(self.floor)
            return 

class Elevator_: 

    def __init__(self, num, bottom_floor, top_floor):
        self.num = num
        self.status = "IDLE" 
        self.current_floor = 1 
        self.door_list = [] 
        self.floor_list = [] 
        self.door = Door()
        self.floor_display = Floor_Display(self.current_floor, self.status) 
        floor = bottom_floor 
        while floor <= top_floor: 
            door = Floor_Door(floor) 
            self.door_list.append(door) 
            floor += 1 

    def push_floor_list(self, floor): 
        self.floor_list.append(floor) 
        self.status = "ACTIVE"
        self.move() 

    def move(self): 
        for floor in self.floor_list:    
            if floor == self.current_floor: 
                self.floor_list.remove(floor) 
                self.stop()

            if floor < self.current_floor: 
                self.status = "DOWN" 
                print("Elevator ", self.num ,":")
                self.floor_display.set_display(self.current_floor, self.status) 
                self.current_floor -= 1 
                self.move() 

            if floor > self.current_floor: 
                self.status = "UP"
                print("Elevator ", self.num ,":")
                self.floor_display.set_display(self.current_floor, self.status)
                self.current_floor += 1
                self.move()

    def stop(self): 
        self.open_doors(self.current_floor) 
        print('Elevator ', self.num, ': stopped at :', self.current_floor)
        self.wait()

        self.close_doors(self.current_floor) 
            
        if not self.floor_list: 
            self.status = "IDLE" 
            self.floor_display.set_display(self.current_floor, self.status)
        else:    
            self.move()    

    def wait(self): 
        self.status = "IDLE" #'TODO - can add a wait variable to be set when initializing column or change to like 3 seconds'

    def close_doors(self, floor): 
        self.door.close_door()
        for door in self.door_list:
            if door.floor == floor:
                door.close_door() 

    def open_doors(self, floor): 
        self.door.open_door() 
        for door in self.door_list: 
            if door.floor == floor:
                door.open_door()

class Column:
    def __init__(self, num, bottom_floor, top_floor, elevator_num): 
        self.num = num
        self.elevator_list = []
        self.call_button_list = [] 
        self.bottom_floor = bottom_floor 
        self.top_floor = top_floor 
        self. elevator_num = elevator_num 
        self.fill_elevator_list() 
        self.fill_call_button_list() 

    def fill_elevator_list(self): 
        num = 0 
        while num < self.elevator_num: 
            elevator = Elevator_(num, self.bottom_floor, self.top_floor) 
            self.elevator_list.append(elevator) 
            num += 1 

    def fill_call_button_list(self): 
        floor = self.bottom_floor + 1
        while floor < self.top_floor: 
            call_button = Call_Button(floor, "UP") 
            self.call_button_list.append(call_button)
            call_button = Call_Button(floor, "Down") 
            self.call_button_list.append(call_button)
            floor += 1
        self.call_button_list.append(Call_Button(self.top_floor, "DOWN")) 
        self.call_button_list.append(Call_Button(self.bottom_floor, "UP"))

    def findIdle(self, floor):
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in self.elevator_list: 
            if elevator.status == "IDLE": 
                if elevator.current_floor >= floor: 
                    diff = elevator.current_floor - floor 
                    if diff < best_diff:
                        elevator_choice = elevator
                        best_diff = diff 

                if elevator.current_floor <= floor: 
                    diff = floor - elevator.current_floor
                    if diff < best_diff:
                        elevator_choice = elevator 
                        best_diff = diff 

        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor)
            return 

    def findDown(self, floor):
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in self.elevator_list:
            if elevator.current_floor < floor and elevator.status == "DOWN":
                diff = abs(floor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff
        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            return
        else:
            self.findIdle(floor)

    def findUp(self, floor):
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in self.elevator_list:
            if elevator.current_floor < floor and elevator.status == "UP":
                diff = abs(floor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff
        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            return
        else:
            self.findIdle(floor)

    def RequestElevator(self, RequestedFloor, Direction):

        if Direction == "UP":
            self.findUp(RequestedFloor)
        if Direction == "DOWN":
            self.findDown(RequestedFloor)

        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        for elevator in self.elevator_list:
            if elevator.current_floor < RequestedFloor and elevator.status == "DOWN":
                diff = abs(RequestedFloor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff
        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(RequestedFloor) 
            return
        else:
            self.findIdle(RequestedFloor)

    def RequestFloor(self, Elevator, RequestedFloor):
            self.elevator_list[Elevator].push_floor_list(RequestedFloor)

    def choose_elevator(self, floor):
        elevator_choice = "NULL" 
        diff = 0 
        best_diff = 9999 
        print('choose_elevator called with ', floor)
        for elevator in self.elevator_list:
            if elevator.current_floor < floor and elevator.status == "UP":
                diff = abs(floor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff 

        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            return

        for elevator in self.elevator_list: 
            if elevator.current_floor >= floor and elevator.status == "DOWN": 
                diff = elevator.current_floor - floor
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff 

        if elevator_choice != "NULL":
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            return

        for elevator in self.elevator_list: 
            if elevator.status == "IDLE": 
                if elevator.current_floor >= floor: 
                    diff = elevator.current_floor - floor 
                    if diff < best_diff:
                        elevator_choice = elevator
                        best_diff = diff 

                if elevator.current_floor <= floor: 
                    diff = floor - elevator.current_floor
                    if diff < best_diff:
                        elevator_choice = elevator 
                        best_diff = diff 

        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor)
            return 

    def choose_trip(self, floor, target):
        elevator_choice = "NULL"
        diff = 0 
        best_diff = 9999 

        for elevator in self.elevator_list: 
            if elevator.current_floor < floor and elevator.status == "UP":
                diff = abs(floor - elevator.current_floor) 
                if diff < best_diff: 
                    elevator_choice = elevator 
                    best_diff = diff 
           
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(target)
            return #RETURN elevator

        for elevator in self.elevator_list: 
            if elevator.current_floor == floor:
                elevator_choice = elevator
                print('Column ', self.num, 'chose elevator ', elevator_choice.num)
                elevator_choice.push_floor_list(floor) 
                print('Column ', self.num, 'chose elevator ', elevator_choice.num)
                elevator_choice.push_floor_list(target)
                return 
            
            if elevator.current_floor >= floor and elevator.status == "DOWN":
                diff = elevator.current_floor - floor 
                if diff < best_diff:
                    elevator_choice = elevator 
                    best_diff = diff 

        if elevator_choice != "NULL": 
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor) 
            elevator_choice.push_floor_list(target)
            return 

        for elevator in self.elevator_list: 
            if elevator.status == "IDLE":
                if elevator.current_floor >= floor:
                    diff = elevator.current_floor - floor 
                    if diff < best_diff:
                        elevator_choice = elevator 
                        best_diff = diff 

                if elevator.current_floor <= floor:
                    diff = floor - elevator.current_floor 
                    if diff < best_diff: 
                        elevator_choice = elevator 
                        best_diff = diff 

        if elevator_choice != "NULL":
            print('Column ', self.num, 'chose elevator ', elevator_choice.num)
            elevator_choice.push_floor_list(floor)
            elevator_choice.push_floor_list(target)
            return 

    def push_call_button(self, floor):
        for call_button in self.call_button_list:
            if call_button.floor == floor:
                call_button.call_button_pushed(self.elevator_list)

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
    print("Elevator B is Idle at floor 6")
    column.RequestFloor(1, 6)
    print("Someone is on floor 3 ")
    column.RequestElevator(3, "UP")
    print("and wants to go to the 7th floor.")
    column.RequestFloor(0, 7)
    print("Test Scenario 1 - Complete")
    print(" ")

    print("scenario 2 - press enter to execute")
    input()
    print(" ")
    print("Elevator A is Idle at floor 10")
    column.RequestFloor(0, 10)
    print("Elevator B is Idle at floor 3")
    column.RequestFloor(1, 3)
    print("Someone is on floor 3 ")
    column.RequestElevator(1, "UP")
    print("and wants to go to the 6th floor.")
    column.RequestFloor(1, 6)
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

    

    
    






    