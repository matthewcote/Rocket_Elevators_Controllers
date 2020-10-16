package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"time"
)

type Door struct {
	isopen bool
}

func (x *Door) Open(setopen bool) {
	x.isopen = setopen
	if x.isopen {
		fmt.Println("Door is Opened")
	} else {
		fmt.Println("Door is Closed")
	}
}

type FloorDoor struct {
	isopen bool
	floor  int
}

func (x *FloorDoor) Open(setopen bool) {
	x.isopen = setopen
	if x.isopen {
		fmt.Println("Door is Opened")
	} else {
		fmt.Println("Door is Closed")
	}
}

type Button struct {
	status bool
	floor  int
}

func (x *Button) Activate(seton bool) {
	x.status = seton
	if x.status == true {
		fmt.Println("Button Activated")
	} else {
		fmt.Println("Button Deactivated")
	}
}

type CallButton struct { // floor, direction, status
	floor     int
	direction bool
	status    bool
}

func (x *CallButton) Activate(seton bool) {
	x.status = seton
	if x.status == true {
		fmt.Println("Button Activated")
	} else {
		fmt.Println("Button Deactivated")
	}
}

type FloorDisplay struct { // Status - 0 = IDLE, 1 = DOWN, 2 = UP
	floor  int
	status int
}

func (f *FloorDisplay) SetDisplay(setfloor, setstatus int) {
	f.floor = setfloor
	f.status = setstatus
	var stat string
	if f.status == 0 {
		stat = "IDLE"
	}
	if f.status == 1 {
		stat = "DOWN"
	}
	if f.status == 2 {
		stat = "UP"
	}
	fmt.Println("Floor:", f.floor, "Status:", stat)
}

type Elevator struct {
	name         string
	floordisplay *FloorDisplay
	door         *Door
	flrdrs       []FloorDoor
	buttons      []Button
	targetfloor  int
}

func (e *Elevator) ClassicElevator(bottomfloor int, topfloor int, origin int, name string) {
	e.floordisplay = &FloorDisplay{}     // works
	e.floordisplay.SetDisplay(origin, 0) // works
	e.door = &Door{}                     // works
	e.name = name                        // works
	e.door.Open(false)                   // works

	if origin != bottomfloor {
		ob := &Button{false, origin}
		e.buttons = append(e.buttons, *ob)
		fmt.Println("Added Button with floor", origin)
		ofd := &FloorDoor{false, origin}
		e.flrdrs = append(e.flrdrs, *ofd)
		fmt.Println("Added FloorDoor with floor", origin)
	}

	for i := bottomfloor; i <= topfloor; i++ {
		b := &Button{false, i}
		e.buttons = append(e.buttons, *b)
		fmt.Println("Added Button with floor", i)
		fd := &FloorDoor{false, i}
		e.flrdrs = append(e.flrdrs, *fd)
		fmt.Println("Added FloorDoor with floor", i)
	}
}

func (e *Elevator) ModernElevator(bottomfloor int, topfloor int, origin int, name string) { // No buttons inside, creepy elevator
	e.floordisplay = &FloorDisplay{}     // works
	e.floordisplay.SetDisplay(origin, 0) // works
	e.door = &Door{}                     // works
	e.name = name
	e.door.Open(false)

	if origin != bottomfloor {
		ofd := &FloorDoor{false, origin}
		e.flrdrs = append(e.flrdrs, *ofd)
		fmt.Println("Added FloorDoor with floor", origin)
	}

	for i := bottomfloor; i <= topfloor; i++ {
		fd := &FloorDoor{false, i}
		e.flrdrs = append(e.flrdrs, *fd)
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
		e.floordisplay.status = 1 //SetDisplay( e.floordisplay.floor, 1)
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
	if e.floordisplay.status == 0 {
		stat = "IDLE"
	}
	if e.floordisplay.status == 1 {
		stat = "DOWN"
	}
	if e.floordisplay.status == 2 {
		stat = "UP"
	}
	fmt.Println("Elevator:", e.name, "Floor:", e.floordisplay.floor, "Status:", stat)
}

type Column struct {
	name                                   string
	origin, bottomfloor, topfloor, elevAmt int
	buttons                                []Button
	elevators                              []Elevator
}

func (c *Column) ModernColumn(name string, origin, bottomfloor, topfloor, elevAmt int) {
	c.name = name
	c.origin = origin
	c.bottomfloor = bottomfloor
	c.topfloor = topfloor
	c.elevAmt = elevAmt

	// Modern Column gets Buttons without direction for each floor except origin
	// But conceptually, a modern column doesn't have a call button at the origin because a battery controller would handle that request
	// these buttons would represent a call to origin TODO - make sure the they go out when the elevator arrives, then open that elevator floordoor and deactivate the light, all fun stuff.
	if c.bottomfloor == c.origin {
		for i := bottomfloor + 1; i <= topfloor; i++ {
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
		s := strconv.Itoa(i + 1)
		e.ModernElevator(c.bottomfloor, c.topfloor, c.origin, c.name+s)
		c.elevators = append(c.elevators, *e)
		fmt.Println("Added Elevator with name ", c.name+s)
		e.Display()
	}
}

func (c *Column) RequestElevator(target int) { // Person is at target, they want to get picked up and go to origin
	// what to do, look through elevators
	elchoice := -1
	diff := 0
	bestdiff := 999

	if target > c.origin { // if target is more than origin the first priority is an elevator above the target going down.
		for i := 0; i < c.elevAmt; i++ {
			if c.elevators[i].floordisplay.floor == target && c.elevators[i].floordisplay.status != 2 { // if we find a elevator at the target - that was easy
				c.elevators[i].PushFloor(c.origin)
				return
			}
			if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 1 {
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
		if elchoice == -1 { // a elevator was not found moving towards the target - look for closest idle elevator
			for i := 0; i < c.elevAmt; i++ {
				if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 0 {
					diff = c.elevators[i].floordisplay.floor - target
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
				if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 0 {
					diff = target - c.elevators[i].floordisplay.floor
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
			if c.elevators[i].floordisplay.floor == target && c.elevators[i].floordisplay.status != 1 { // if we find a elevator at the target that is not moving away from origin...- that was easy
				c.elevators[i].PushFloor(c.origin)
				return
			}
			if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 2 {
				diff = target - c.elevators[i].floordisplay.floor
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
		if elchoice == -1 { // a elevator was not found moving towards the target - look for closest idle elevator
			for i := 0; i < c.elevAmt; i++ {
				if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 0 {
					diff = c.elevators[i].floordisplay.floor - target
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
				if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 0 {
					diff = target - c.elevators[i].floordisplay.floor
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
		if c.elevators[i].floordisplay.floor > c.origin && c.elevators[i].floordisplay.status == 1 {
			diff = c.elevators[i].floordisplay.floor - c.origin
			if diff < bestdiff {
				elchoice = i
				bestdiff = diff
			}
		}
		if c.elevators[i].floordisplay.floor < c.origin && c.elevators[i].floordisplay.status == 2 {
			diff = c.origin - c.elevators[i].floordisplay.floor
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
			if c.elevators[i].floordisplay.floor > c.origin && c.elevators[i].floordisplay.status == 0 {
				diff = c.elevators[i].floordisplay.floor - c.origin
				if diff < bestdiff {
					elchoice = i
					bestdiff = diff
				}
			}
			if c.elevators[i].floordisplay.floor < c.origin && c.elevators[i].floordisplay.status == 0 {
				diff = c.origin - c.elevators[i].floordisplay.floor
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
	columns []Column
}

func (b *Battery) RequestElevator(target int) {
	for i := 0; i < len(b.columns); i++ {
		if target >= b.columns[i].bottomfloor && target <= b.columns[i].topfloor {
			b.columns[i].RequestElevator(target)
		}
	}
}

func (b *Battery) AssignElevator(target int) {
	for i := 0; i < len(b.columns); i++ {
		if target >= b.columns[i].bottomfloor && target <= b.columns[i].topfloor {
			b.columns[i].AssignElevator(target)
		}
	}
}

func (bat *Battery) fillcolumns() {

	a := &Column{}
	a.ModernColumn("A", 1, -6, -1, 5)
	bat.columns = append(bat.columns, *a)
	b := &Column{}
	b.ModernColumn("B", 1, 1, 20, 5)
	bat.columns = append(bat.columns, *b)
	c := &Column{}
	c.ModernColumn("C", 1, 21, 40, 5)
	bat.columns = append(bat.columns, *c)
	d := &Column{}
	d.ModernColumn("D", 1, 41, 60, 5)
	bat.columns = append(bat.columns, *d)
}

// Modern Simulation Test Scenarios
func (b *Battery) ModScenario1() {

	b.columns[1].elevators[0].floordisplay.SetDisplay(20, 1) // number, status
	b.columns[1].elevators[1].floordisplay.SetDisplay(3, 2)  // number, status
	b.columns[1].elevators[2].floordisplay.SetDisplay(13, 1) // number, status
	b.columns[1].elevators[3].floordisplay.SetDisplay(15, 1) // number, status
	b.columns[1].elevators[4].floordisplay.SetDisplay(6, 1)  // number, status
	b.AssignElevator(20)
}

func (b *Battery) ModScenario2() {

	b.columns[2].elevators[0].floordisplay.SetDisplay(1, 0)  // number, status
	b.columns[2].elevators[1].floordisplay.SetDisplay(23, 2) // number, status
	b.columns[2].elevators[2].floordisplay.SetDisplay(33, 1) // number, status
	b.columns[2].elevators[3].floordisplay.SetDisplay(40, 1) // number, status
	b.columns[2].elevators[4].floordisplay.SetDisplay(39, 1) // number, status
	b.AssignElevator(36)
}

func (b *Battery) ModScenario3() {

	b.columns[3].elevators[0].floordisplay.SetDisplay(58, 1) // number, status
	b.columns[3].elevators[1].floordisplay.SetDisplay(50, 2) // number, status
	b.columns[3].elevators[2].floordisplay.SetDisplay(46, 2) // number, status
	b.columns[3].elevators[3].floordisplay.SetDisplay(1, 2)  // number, status
	b.columns[3].elevators[4].floordisplay.SetDisplay(60, 1) // number, status
	b.RequestElevator(54)
}

func (b *Battery) ModScenario4() {

	b.columns[0].elevators[0].floordisplay.SetDisplay(-4, 0) // number, status
	b.columns[0].elevators[1].floordisplay.SetDisplay(1, 0)  // number, status
	b.columns[0].elevators[2].floordisplay.SetDisplay(-3, 1) // number, status
	b.columns[0].elevators[3].floordisplay.SetDisplay(-6, 2) // number, status
	b.columns[0].elevators[4].floordisplay.SetDisplay(-1, 1) // number, status
	fmt.Println("I just requested an elevator --------------------------------------------------------------")
	b.RequestElevator(-3)
}

type ClassicColumn struct {
	name                                   string
	origin, bottomfloor, topfloor, elevAmt int
	buttons                                []CallButton
	elevators                              []Elevator
}

func (c *ClassicColumn) MakeClassicColumn(name string, origin, bottomfloor, topfloor, elevAmt int) {
	c.name = name
	c.origin = origin
	c.bottomfloor = bottomfloor
	c.topfloor = topfloor
	c.elevAmt = elevAmt

	// Classic Column gets CallButtons with direction for each floor except origin
	// these buttons would represent a call to origin - would be at origin.
	// TODO - make sure the they go out when the elevator arrives, then open that elevator floordoor and deactivate the light, all fun stuff.
	if c.bottomfloor == c.origin {
		for i := bottomfloor; i <= topfloor; i++ {
			if i != topfloor {
				b := &CallButton{i, true, false}
				c.buttons = append(c.buttons, *b)
			}
			if i != bottomfloor {
				b := &CallButton{i, false, false}
				c.buttons = append(c.buttons, *b)
			}
		}
	} // thats an easy classic elevator - but if the origin is not the bottom floor - uhg....
	if c.bottomfloor != c.origin {
		if c.bottomfloor < c.origin { // basement column add a button at the origin going down
			b := &CallButton{origin, false, false}
			c.buttons = append(c.buttons, *b)
			// and add a button at the top floor going up
			bup := &CallButton{origin, true, false}
			c.buttons = append(c.buttons, *bup)
		}
		if c.bottomfloor < c.origin { // more than zero column
			b := &CallButton{origin, true, false} // add a button at the origin going up
			c.buttons = append(c.buttons, *b)
			// and add a button at the top floor going down
			bup := &CallButton{c.bottomfloor, false, false}
			c.buttons = append(c.buttons, *bup)
		}
	}
	// and lets not forget the elevators
	for i := 0; i < c.elevAmt; i++ {
		e := &Elevator{}
		s := strconv.Itoa(i + 1)
		e.ClassicElevator(c.bottomfloor, c.topfloor, c.origin, c.name+s)
		c.elevators = append(c.elevators, *e)
		fmt.Println("Added Elevator with name ", c.name+s)
		e.Display()
	}
}

func (c *ClassicColumn) RequestElevator(target int, direction bool) { // person is at the target, and they want to go in direction
	// what to do, look through elevators
	elchoice := -1
	diff := 0
	bestdiff := 999

	if direction { // if person wants to go up
		fmt.Println(c.elevators[4].floordisplay.status)
		for i := 0; i < c.elevAmt; i++ { // first priority - elevator at target
			if c.elevators[i].floordisplay.floor == target && c.elevators[i].floordisplay.status != 1 { // if we find a elevator at the target - that was easy
				c.elevators[i].PushFloor(c.origin)
				return
			} // second priority, closest elevator under target going up
			if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 2 {
				diff = target - c.elevators[i].floordisplay.floor
				if diff < bestdiff {
					elchoice = i
					bestdiff = diff
				}
			}
		}
		if elchoice != -1 { // a elevator was found moving up towards target, this is the closest one.
			c.elevators[elchoice].PushFloor(target)
			c.elevators[elchoice].PushFloor(c.origin)
		}
		if elchoice == -1 { // a elevator was not found moving up towards the target - look for closest idle elevator
			for i := 0; i < c.elevAmt; i++ {
				if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 0 {
					diff = c.elevators[i].floordisplay.floor - target
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
				if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 0 {
					diff = target - c.elevators[i].floordisplay.floor
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
			}
			if elchoice == -1 {
				for i := 0; i < c.elevAmt; i++ {
					if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 1 {
						diff = c.elevators[i].floordisplay.floor - target
						if diff < bestdiff {
							elchoice = i
							bestdiff = diff
						}
					}
					if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 2 {
						diff = target - c.elevators[i].floordisplay.floor
						if diff < bestdiff {
							elchoice = i
							bestdiff = diff
						}
					}
				}
				c.elevators[elchoice].PushFloor(target)
				c.elevators[elchoice].PushFloor(c.origin)
			}
			c.elevators[elchoice].PushFloor(target)
			c.elevators[elchoice].PushFloor(c.origin)
		}

	}

	if !direction { // if person wants to go down
		for i := 0; i < c.elevAmt; i++ {
			if c.elevators[i].floordisplay.floor == target && c.elevators[i].floordisplay.status != 2 { // first priority - elevator at target
				c.elevators[i].PushFloor(c.origin)
				return
			} // second priority, closest elevator above target going down
			if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 1 {
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
			return
		}
		if elchoice == -1 { // a elevator was not found moving towards the target - look for closest idle elevator
			for i := 0; i < c.elevAmt; i++ {
				if c.elevators[i].floordisplay.floor > target && c.elevators[i].floordisplay.status == 0 {
					diff = c.elevators[i].floordisplay.floor - target
					if diff < bestdiff {
						elchoice = i
						bestdiff = diff
					}
				}
				if c.elevators[i].floordisplay.floor < target && c.elevators[i].floordisplay.status == 0 {
					diff = target - c.elevators[i].floordisplay.floor
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

func (c *ClassicColumn) AssignElevator(Elevator int, RequestedFloor int) {
	c.elevators[Elevator].PushFloor(RequestedFloor)
}

type ClassicBattery struct {
	columns []ClassicColumn
}

func (bat *ClassicBattery) fillclassiccolumns() {
	a := &ClassicColumn{}
	a.MakeClassicColumn("A", 1, -6, -1, 5)
	bat.columns = append(bat.columns, *a)
	b := &ClassicColumn{}
	b.MakeClassicColumn("B", 1, 1, 20, 5)
	bat.columns = append(bat.columns, *b)
	c := &ClassicColumn{}
	c.MakeClassicColumn("C", 1, 21, 40, 5)
	bat.columns = append(bat.columns, *c)
	d := &ClassicColumn{}
	d.MakeClassicColumn("D", 1, 41, 60, 5)
	bat.columns = append(bat.columns, *d)
}

func (b *ClassicBattery) RequestElevator(FloorNumber int, Direction bool) {
	// This will simply call a elevator to the target floornumber
	for i := 0; i < len(b.columns); i++ {
		if FloorNumber >= b.columns[i].bottomfloor && FloorNumber <= b.columns[i].topfloor {
			b.columns[i].RequestElevator(FloorNumber, Direction)
		}
	}
}

func (b *ClassicBattery) AssignElevator(Elevator int, RequestedFloor int) { // This will simply call this specific elevator to the target floornumber
	for i := 0; i < len(b.columns); i++ {
		if RequestedFloor >= b.columns[i].bottomfloor && RequestedFloor <= b.columns[i].topfloor {
			b.columns[i].AssignElevator(Elevator, RequestedFloor)
		}
	}
}

func (b *ClassicBattery) ClassicScenario1() {

	b.columns[1].elevators[0].floordisplay.SetDisplay(20, 1) // number, status
	b.columns[1].elevators[1].floordisplay.SetDisplay(3, 2)  // number, status
	b.columns[1].elevators[2].floordisplay.SetDisplay(13, 1) // number, status
	b.columns[1].elevators[3].floordisplay.SetDisplay(15, 1) // number, status
	b.columns[1].elevators[4].floordisplay.SetDisplay(6, 1)  // number, status
	b.RequestElevator(1, true)
	b.AssignElevator(4, 20)
}

func (b *ClassicBattery) ClassicScenario2() {

	b.columns[2].elevators[0].floordisplay.SetDisplay(1, 0)  // number, status
	b.columns[2].elevators[1].floordisplay.SetDisplay(23, 2) // number, status
	b.columns[2].elevators[2].floordisplay.SetDisplay(33, 1) // number, status
	b.columns[2].elevators[3].floordisplay.SetDisplay(40, 1) // number, status
	b.columns[2].elevators[4].floordisplay.SetDisplay(39, 1) // number, status
	b.columns[2].RequestElevator(1, true)
	b.columns[2].AssignElevator(0, 36)
}

func (b *ClassicBattery) ClassicScenario3() {

	b.columns[3].elevators[0].floordisplay.SetDisplay(58, 1) // number, status
	b.columns[3].elevators[1].floordisplay.SetDisplay(50, 2) // number, status
	b.columns[3].elevators[2].floordisplay.SetDisplay(46, 2) // number, status
	b.columns[3].elevators[3].floordisplay.SetDisplay(1, 2)  // number, status
	b.columns[3].elevators[4].floordisplay.SetDisplay(60, 1) // number, status
	b.RequestElevator(54, false)
}

func (b *ClassicBattery) ClassicScenario4() {

	b.columns[0].elevators[0].floordisplay.SetDisplay(-4, 0) // number, status
	b.columns[0].elevators[1].floordisplay.SetDisplay(1, 0)  // number, status
	b.columns[0].elevators[2].floordisplay.SetDisplay(-3, 1) // number, status
	b.columns[0].elevators[3].floordisplay.SetDisplay(-6, 2) // number, status
	b.columns[0].elevators[4].floordisplay.SetDisplay(-1, 1) // number, status
	b.RequestElevator(-3, true)

}

func main() {
	battery := ClassicBattery{}
	batt := Battery{}
	seconds := 2
	time.Sleep(time.Duration(seconds) * time.Second)

	fmt.Println("Rocket Elevator Simulation: First the classic approach.")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	battery.fillclassiccolumns()

	fmt.Print(" - Scenario 1....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	battery.ClassicScenario1()

	fmt.Print(" - Scenario 2....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	battery.ClassicScenario2()

	fmt.Print(" - Scenario 3....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	battery.ClassicScenario3()

	fmt.Print(" - Scenario 4....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	battery.ClassicScenario4()

	fmt.Print("Now - the Modern Approach\n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	batt.fillcolumns()

	fmt.Print(" - Scenario 1....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	batt.ModScenario1()

	fmt.Print(" - Scenario 2....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	batt.ModScenario2()

	fmt.Print(" - Scenario 3....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	batt.ModScenario3()

	fmt.Print(" - Scenario 4....... \n")
	fmt.Print("Press 'Enter' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
	time.Sleep(time.Duration(seconds) * time.Second)
	batt.ModScenario4()
}
