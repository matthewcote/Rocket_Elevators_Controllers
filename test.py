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

class Elevator_Door: 
    def __init__(self): 
        self.status = "CLOSED" 

    def open_door(self):
        self.status = "OPEN"

    def close_door(self):
        self.status = "CLOSE"

    def alert(self):
        self.open_door()

class Door:
    def __init__(self, floor): 
        self.floor = floor 
        self.status = "IDLE" 
    def open_door(self): 
        self.door_status = "OPEN" 

    def close_door(self):
        self.door_status = "CLOSE" 

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

class Elevator: 

    def __init__(self, num, bottom_floor, top_floor):
        self.num = num
        self.status = "IDLE" 
        self.current_floor = 1 
        self.door_list = [] 
        self.floor_list = [] 
        self.elevator_door = Elevator_Door() 
        self.floor_display = Floor_Display(self.current_floor, self.status) 
        floor = bottom_floor 
        while floor <= top_floor: 
            door = Door(floor) 
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
                self.floor_display.set_display(self.current_floor, self.status) 
                self.current_floor -= 1 
                self.move() 

            if floor > self.current_floor: 
                self.status = "UP" 
                self.floor_display.set_display(self.current_floor, self.status)
                self.current_floor += 1
                self.move()

    def stop(self): 
        self.open_doors(self.current_floor) 
        print('Elevator ', self.num, ' stopped at ', self.current_floor)
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
        self.elevator_door.close_door()
        for door in self.door_list:
            if door.floor == floor:
                door.close_door() 

    def open_doors(self, floor): 
        self.elevator_door.open_door() 
        for door in self.door_list: 
            if door.floor == floor:
                door.open_door 

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
        while num <= self.elevator_num: 
            elevator = Elevator(num, self.bottom_floor, self.top_floor) 
            self.elevator_list.append(elevator) 
            num += 1 

    def fill_call_button_list(self): 
        floor = self.bottom_floor + 1
        while floor < self.top_floor: 
            call_button = Call_Button(floor, "UP") 
            self.call_button_list.append(call_button)
            call_button = Call_Button(floor, "Down") 
            self.call_button_list.append(call_button)
        self.call_button_list.append(Call_Button(self.top_floor, "DOWN")) 
        self.call_button_list.append(Call_Button(self.bottom_floor, "UP"))

    def findIdle(self, floor):
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
            print("success")
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

class Battery:
    def __init__(self, origin):
        self.origin = origin 
        self.column_list = []
        self.control_display = "DEFAULT"
        self.floor_display_list = [] 
    
    def add_column(self, name, bottom_floor, top_floor, elevator_num): 
        column = Column(name, bottom_floor, top_floor, elevator_num) 
        self.column_list.append(column) 


    def choose_column(self, floor): 
        for column in self.column_list:
            if column.bottom_floor <= floor <= column.top_floor: 
                print('Battery Chose column ', column.num)
                column.choose_elevator(floor) 
                return

    def choose_trip(self, floor, target):
        if floor == self.origin:   
            for column in self.column_list: 
                if column.bottom_floor <= target <= column.top_floor:
                    print('Battery Chose column ', column.num)
                    column.choose_trip(floor, target) 
                    return

        for column in self.column_list:
            if column.bottom_floor <= floor <= column.top_floor: 
                print('Battery Chose column ', column.num)
                column.choose_trip(floor, target) 
                return

if __name__ == '__main__':
    print('Test Scenario 1')
    ## Residential Scenario
    column = Column(1, 1, 10, 2)
    column.RequestFloor(1, 2)
    column.RequestFloor(2, 6)
    column.RequestElevator(3, "UP")


    ## commercial scenarios
    #scenario 1
    """
    bob = Battery(1)
    bob.add_column(0, -6, -1, 5)
    bob.add_column(1, 2, 20, 5)
    bob.add_column(2, 21, 40, 5)
    bob.add_column(3, 41, 60, 5)
    bob.column_list[1].elevator_list[0].current_floor = 20
    bob.column_list[1].elevator_list[0].status = 'DOWN'
    bob.column_list[1].elevator_list[1].current_floor = 3
    bob.column_list[1].elevator_list[1].status = 'UP'
    bob.column_list[1].elevator_list[2].current_floor = 13
    bob.column_list[1].elevator_list[2].status = 'DOWN'
    bob.column_list[1].elevator_list[3].current_floor = 15
    bob.column_list[1].elevator_list[3].status = 'DOWN'
    bob.column_list[1].elevator_list[4].current_floor = 6
    bob.column_list[1].elevator_list[4].status = 'DOWN'
    bob.choose_trip(1, 20)

    #scenario 2
    bob.column_list[2].elevator_list[0].current_floor = 1
    bob.column_list[2].elevator_list[0].status = 'IDLE'
    bob.column_list[2].elevator_list[1].current_floor = 23
    bob.column_list[2].elevator_list[1].status = 'UP'
    bob.column_list[2].elevator_list[2].current_floor = 33
    bob.column_list[2].elevator_list[2].status = 'DOWN'
    bob.column_list[2].elevator_list[3].current_floor = 40
    bob.column_list[2].elevator_list[3].status = 'DOWN'
    bob.column_list[2].elevator_list[4].current_floor = 39
    bob.column_list[2].elevator_list[4].status = 'DOWN'
    bob.choose_trip(1, 36)

    #scenario 3
    bob.column_list[3].elevator_list[0].current_floor = 58
    bob.column_list[3].elevator_list[0].status = 'DOWN'
    bob.column_list[3].elevator_list[1].current_floor = 50
    bob.column_list[3].elevator_list[1].status = 'UP'
    bob.column_list[3].elevator_list[2].current_floor = 46
    bob.column_list[3].elevator_list[2].status = 'UP'
    bob.column_list[3].elevator_list[3].current_floor = 1
    bob.column_list[3].elevator_list[3].status = 'UP'
    bob.column_list[3].elevator_list[4].current_floor = 60
    bob.column_list[3].elevator_list[4].status = 'DOWN'
    bob.choose_trip(54, 1)

    #scenario 4
    bob.column_list[0].elevator_list[0].current_floor = -4
    bob.column_list[0].elevator_list[0].status = 'IDLE'
    bob.column_list[0].elevator_list[1].current_floor = 1
    bob.column_list[0].elevator_list[1].status = 'IDLE'
    bob.column_list[0].elevator_list[2].current_floor = -3
    bob.column_list[0].elevator_list[2].status = 'DOWN'
    bob.column_list[0].elevator_list[3].current_floor = -6
    bob.column_list[0].elevator_list[3].status = 'UP'
    bob.column_list[0].elevator_list[4].current_floor = -1
    bob.column_list[0].elevator_list[4].status = 'DOWN'
    bob.choose_trip(-3, 1)


    """









