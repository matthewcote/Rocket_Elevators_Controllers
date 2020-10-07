package main

import (
	"strconv"
	"fmt"
)

type Door struct {
	isopen bool
}

func (x *Door) Close() {
	x.isopen = false
	fmt.Println("Door Closed")
}

func (x *Door) Open() {
	x.isopen = true
	fmt.Println("Door Opened")
}

type FloorDoor struct {
	isopen bool
	floor int
}

type Button struct {
	status bool
	floor int
}

func (x *Button) Activate() {
	x.status = true
	fmt.Println("Button Activated")
}

func (x *Button) Deactivate() {
	x.status = false
	fmt.Println("Button Activated")
}

type CallButton struct {
	button Button
	direction bool
}

func (x *CallButton) DisplayCallButton() {
 	// TODO
}

type FloorDisplay struct { // Status - 0 = IDLE, 1 = DOWN, 2 = UP
	floor int
	status int
}

func (f *FloorDisplay) SetDisplay(setfloor, setstatus int) {
	f.floor = setfloor
	f.status = setstatus
	var stat string
	if f.status == 0 {stat = "IDLE"}
	if f.status == 1 {stat = "DOWN"}
	if f.status == 2 {stat = "UP"}
	fmt.Println("Floor:", f.floor, "Status:", stat)
}

type Elevator struct {
	name string
	floordisplay *FloorDisplay
	door *Door
	floordoors []FloorDoor
	buttons []Button
	targetfloor int
}

func (e *Elevator) ClassicElevator(bottomfloor int, topfloor int,  origin int, name string) {
	e.floordisplay = &FloorDisplay{} // works
	e.floordisplay.SetDisplay(origin, 0) // works
	e.door = &Door{} // works
	e.name = name // works
	e.door.Close() // works

	if origin != bottomfloor{
		ob := &Button{false, origin}
		e.buttons = append(e.buttons, *ob)
		fmt.Println("Added Button with floor", origin)
		ofd := &FloorDoor{false, origin}
		e.floordoors = append(e.floordoors, *ofd)
		fmt.Println("Added FloorDoor with floor", origin)
	}

	for i := bottomfloor; i <= topfloor; i++ {
		b := &Button{false, i}
		e.buttons = append(e.buttons, *b)
		fmt.Println("Added Button with floor", i)
		fd := &FloorDoor{false, i}
		e.floordoors = append(e.floordoors, *fd)
		fmt.Println("Added FloorDoor with floor", i)
	}
}

func (e *Elevator) ModernElevator(bottomfloor int, topfloor int,  origin int, name string){ // No buttons inside, creepy elevator
	e.floordisplay = &FloorDisplay{} // works
	e.floordisplay.SetDisplay(origin, 0) // works
	e.door = &Door{} // works
	e.name = name
	e.door.Close()

	if origin != bottomfloor{
		ofd := &FloorDoor{false, origin}
		e.floordoors = append(e.floordoors, *ofd)
		fmt.Println("Added FloorDoor with floor", origin)
	}

	for i := bottomfloor; i <= topfloor; i++ {
		fd := &FloorDoor{false, i}
		e.floordoors = append(e.floordoors, *fd)
		fmt.Println("Added FloorDoor with floor", i)
	}
}

func (e *Elevator) PushFloor(target int) {
	// add target to x.floors
	e.targetfloor = target
	fmt.Println("Elevator", e.name, "called PushFloor with target floor", target)
	
	// if target == elevator floor
	if target == e.floordisplay.floor {
		// setstatus and stop
		e.Stop()
	}

	if target > e.floordisplay.floor {
		e.floordisplay.status = 2 //(e.floordisplay.floor, 2) // change status, calls move
		e.Display()
		e.Move()
	}
	if target < e.floordisplay.floor {
		e.floordisplay.status = 1  //SetDisplay( e.floordisplay.floor, 1)
		e.Display()
		e.Move()
	}

}

func (e *Elevator) Move() {
	
	if e.targetfloor != e.floordisplay.floor { 
		if e.floordisplay.status == 2 { // UP
			e.floordisplay.floor += 1
			e.Display()
			e.Move()
		}
		if e.floordisplay.status == 1 { // DOWN
			e.floordisplay.floor -= 1
			e.Display()
			e.Move()
		}
	}

	if e.targetfloor == e.floordisplay.floor {
		e.Stop() 
	}
}

func (e *Elevator) Stop() {
	e.targetfloor = 0
	fmt.Println("Elevator:", e.name, "stopped at ", e.floordisplay.floor)
	e.floordisplay.status = 0
	e.Display()
}

func (e *Elevator) Display() {
	var stat string
	if e.floordisplay.status == 0 {stat = "IDLE"}
	if e.floordisplay.status == 1 {stat = "DOWN"}
	if e.floordisplay.status == 2 {stat = "UP"}
	fmt.Println("Elevator:", e.name, "Floor:", e.floordisplay.floor, "Status:", stat)
}

type Column struct {
	name string
	origin, bottomfloor, topfloor, elevAmt int
	buttons []Button
	elevators []Elevator
}

func (c *Column) AddModernColumn(name string, origin, bottomfloor, topfloor, elevAmt int){
	c.name = name
	c.origin = origin
	c.bottomfloor = bottomfloor
	c.topfloor = topfloor
	c.elevAmt = elevAmt

	// Modern Column gets Buttons without direction for each floor except origin
	// But conceptually, a modern column doesn't have a call button at the origin because a battery controller would handle that request
	// these buttons would represent a call to origin TODO - make sure the they go out when the elevator arrives, then open that elevator floordoor and deactivate the light, all fun stuff.
	if c.bottomfloor == c.origin {
		for i := bottomfloor+1; i <= topfloor; i++ {
			b := &Button{true, i}
			c.buttons = append(c.buttons, *b)
			fmt.Println("Added Button with floor", i)
		}
	}
	if c.bottomfloor != c.origin {
		for i := bottomfloor; i <= topfloor; i++ {
			b := &Button{true, i}
			c.buttons = append(c.buttons, *b)
			fmt.Println("Added Button with floor", i)
		}
	}


	for i := 0; i < c.elevAmt; i++ {
		e := &Elevator{}
		s := strconv.Itoa(i+1)
		e.ModernElevator(c.bottomfloor, c.topfloor, c.origin, c.name+s)
		c.elevators = append(c.elevators, *e)
		fmt.Println("Added Elevator with name ", c.name+s)
		e.Display()
	}
}

func (c *Column) LookIdle(target int) {

}

func (c *Column) LookUp(target int) {

}

func (c *Column) LookDown(target int) {

}

func (c *Column) RequestElevator(target int) { // Person is at target, they want to get picked up and go to origin
	// what to do, look through elevators
	elchoice := -1
	diff := 0
	bestdiff := 999

	if target > c.origin { // if target is more than origin the first priority is an elevator above the target going down.
		for i := 0; i < c.elevAmt; i++ {
			if c.elevators[i].floordisplay.floor == target &&  c.elevators[i].floordisplay.status != 2 { // if we find a elevator at the target - that was easy
				c.elevators[i].PushFloor(c.origin)
				return
			}
			if (c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 1) {
				diff = c.elevators[i].floordisplay.floor - target
				if diff < bestdiff {
					elchoice = i
					bestdiff = diff
				}
			}	
		}
		if elchoice != -1 { // a elevator was found moving towards target, this is the closest one.
			c.elevators[elchoice].PushFloor(target)
			c.elevators[elchoice].PushFloor(c.origin)
		}
		if (elchoice == -1) { // a elevator was not found moving towards the target - look for closest idle elevator
			for i := 0; i < c.elevAmt; i++ {
				if (c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 0) {
					diff = c.elevators[i].floordisplay.floor - target
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
				if (c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 0) {
					diff =  target - c.elevators[i].floordisplay.floor
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
			}	
			c.elevators[elchoice].PushFloor(target)
			c.elevators[elchoice].PushFloor(c.origin)	
		}
	}

	if target < c.origin { // if target is less than origin the first priority is an elevator below the target going up.
		for i := 0; i < c.elevAmt; i++ {
			if c.elevators[i].floordisplay.floor == target &&  c.elevators[i].floordisplay.status != 1 { // if we find a elevator at the target that is not moving away from origin...- that was easy
				c.elevators[i].PushFloor(c.origin)
				return
			}
			if (c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 2) {
				diff =  target - c.elevators[i].floordisplay.floor
				if diff < bestdiff {
					elchoice = i
					bestdiff = diff
				}
			}	
		}
		if elchoice != -1 { // a elevator was found moving towards target, this is the closest one.
			c.elevators[elchoice].PushFloor(target)
			c.elevators[elchoice].PushFloor(c.origin)
			return
		}
		if (elchoice == -1) { // a elevator was not found moving towards the target - look for closest idle elevator
			for i := 0; i < c.elevAmt; i++ {
				if (c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 0) {
					diff = c.elevators[i].floordisplay.floor - target
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
				if (c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 0) {
					diff =  target - c.elevators[i].floordisplay.floor
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
			}	
			c.elevators[elchoice].PushFloor(target)
			c.elevators[elchoice].PushFloor(c.origin)	
		}
	}
}

func (c *Column) AssignElevator(target int) { // Person is at origin, they want to get picked up and go to target
	elchoice := -1
	diff := 0
	bestdiff := 999
	
	for i := 0; i < c.elevAmt; i++ {
		if c.elevators[i].floordisplay.floor == c.origin {
			c.elevators[i].PushFloor(target)
			return
		}
		if (c.elevators[i].floordisplay.floor > c.origin && c.elevators[i].floordisplay.status == 1) {
			diff = c.elevators[i].floordisplay.floor - c.origin
			if diff < bestdiff {
				elchoice = i
				bestdiff = diff
			}
		}
		if (c.elevators[i].floordisplay.floor < c.origin && c.elevators[i].floordisplay.status == 2) {
			diff =  c.origin - c.elevators[i].floordisplay.floor
			if diff < bestdiff {
				elchoice = i
				bestdiff = diff
			}
		}
	}
	if elchoice != -1 { // a elevator was found moving towards origin, this is the closest one.
		c.elevators[elchoice].PushFloor(c.origin)
		c.elevators[elchoice].PushFloor(target)
	}
	if elchoice == -1 {
		for i := 0; i < c.elevAmt; i++ {
			if (c.elevators[i].floordisplay.floor > c.origin && c.elevators[i].floordisplay.status == 0) {
				diff = c.elevators[i].floordisplay.floor - c.origin
				if diff < bestdiff {
					elchoice = i
					bestdiff = diff
				}
			}
			if (c.elevators[i].floordisplay.floor < c.origin && c.elevators[i].floordisplay.status == 0) {
				diff =  c.origin - c.elevators[i].floordisplay.floor
				if diff < bestdiff {
					elchoice = i
					bestdiff = diff
				}
			}
		}	
		c.elevators[elchoice].PushFloor(c.origin)
		c.elevators[elchoice].PushFloor(target)	
	}
}

type Battery struct {
	origin int
	columns []Column
}

func scenario1() {
		c := &Column{}
		c.AddModernColumn("B", 1, 1, 20, 5)
		c.elevators[0].floordisplay.SetDisplay(20, 1) // number, status
		c.elevators[1].floordisplay.SetDisplay(3, 2) // number, status
		c.elevators[2].floordisplay.SetDisplay(13, 1) // number, status
		c.elevators[3].floordisplay.SetDisplay(15, 1) // number, status
		c.elevators[4].floordisplay.SetDisplay(6, 1) // number, status
		c.AssignElevator(20)
}

func scenario2() {
	c := &Column{}
	c.AddModernColumn("C", 1, 21, 40, 5)
	c.elevators[0].floordisplay.SetDisplay(1, 0) // number, status
	c.elevators[1].floordisplay.SetDisplay(23, 2) // number, status
	c.elevators[2].floordisplay.SetDisplay(33, 1) // number, status
	c.elevators[3].floordisplay.SetDisplay(40, 1) // number, status
	c.elevators[4].floordisplay.SetDisplay(39, 1) // number, status
	c.AssignElevator(36)
}

func scenario3() {
	c := &Column{}
	c.AddModernColumn("D", 1, 41, 60, 5)
	c.elevators[0].floordisplay.SetDisplay(58, 1) // number, status
	c.elevators[1].floordisplay.SetDisplay(50, 2) // number, status
	c.elevators[2].floordisplay.SetDisplay(46, 2) // number, status
	c.elevators[3].floordisplay.SetDisplay(1, 2) // number, status
	c.elevators[4].floordisplay.SetDisplay(60, 1) // number, status
	c.RequestElevator(54)
}

func scenario4() {
	c := &Column{}
	c.AddModernColumn("A", 1, -6, -1, 5)
	c.elevators[0].floordisplay.SetDisplay(-4, 0) // number, status
	c.elevators[1].floordisplay.SetDisplay(1, 0) // number, status
	c.elevators[2].floordisplay.SetDisplay(-3, 1) // number, status
	c.elevators[3].floordisplay.SetDisplay(-6, 2) // number, status
	c.elevators[4].floordisplay.SetDisplay(-1, 1) // number, status
	fmt.Println("I just requested an elevator --------------------------------------------------------------")
	c.RequestElevator(-3)
}

func main() {

	scenario1()
	scenario2()
	scenario3()
	scenario4()
}