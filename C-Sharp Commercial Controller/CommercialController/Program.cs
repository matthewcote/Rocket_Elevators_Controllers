using System;
using System.Collections.Generic;

namespace CommercialController
{
    enum Status {Idle, Down, Up};
    class Button 
    {
        int floor;
        bool status;
        public Button(int setfloor)
        {
            floor = setfloor;
            status = false;
        }
        public void SetStatus(bool setstatus)
        {
            status = setstatus;
        }        
    }

    class CallButton : Button // for classic columns
    {
        bool direction;

        public CallButton(int setfloor, bool setdirection) // true is up, false is down
            : base(setfloor)
        {
            direction = setdirection;
        }
    }

    class Door // each elevator has a simple door
    {
        bool status;

        public Door(bool setstatus) // true is open, false is closed
        {
            status = setstatus;
        }

        public void SetStatus(bool setstatus)
        {
            status = setstatus;
        }
    }

    class FloorDoor : Door // each elevator has a floor door for every floor it can stop at
    {
        int floor;

        public FloorDoor(bool setstatus, int setfloor) // true is up, false is down
            : base(setstatus)
        {
            floor = setfloor;
        }

    }

    class FloorDisplay // a floor display holds and displays the elevator's current floor and status 
    {
        public Status status;
        public int floor;

        public FloorDisplay(int setfloor)
        {
            status = Status.Idle;
            floor = setfloor;
        }

        public void SetDisplay(Status setstatus, int setfloor)
        {
            status = setstatus;
            floor = setfloor;
        }
    }

    class Elevator // a modern elevator
    {
        public string name;
        public FloorDisplay fd;
        public Door door;
        public List<FloorDoor> floordoors = new List<FloorDoor>();
        public List<int> floors = new List<int>();

        public Elevator(string setname, int bottomfloor, int topfloor, int origin) // base constructor for any elevator
        {

            name = setname;
            fd = new FloorDisplay(origin);
            door = new Door(false);
            // Every elevator will need floordoors for bottomfloor through top floor 
            for (int i = bottomfloor; i < topfloor; i++ ) {
                FloorDoor f = new FloorDoor(false, i);
                floordoors.Add(f);
            }
            if (bottomfloor != origin) { // if bottomfloor != origin -> add one for origin too.
                FloorDoor f = new FloorDoor(false, origin);
                floordoors.Add(f);
            }
            // Elevator has a name, floordisplay, a door, floordoors - this is a modern elevator, a classic elevator just adds a list of buttons
        }

        public void PushFloor(int target) {
            floors.Add(target);

            if (fd.floor == target) 
            { // already arrived at target!
                Stop();
            }
            if (fd.floor > target) 
            { // Going Down
                fd.status = Status.Down;
                Display();
                Stop();
            }

            if (fd.floor < target) 
            { // Going Up
                fd.status = Status.Up;
                Display();
                Stop();
            }
        }

        public void Move() 
        {
            if (floors.Contains(fd.floor)) {
                Stop();
            }
            if (fd.status == Status.Up) {
                fd.floor += 1;
                Display();
                Move();
            }
            if (fd.status == Status.Down) {
                fd.floor -= 1;
                Display();
                Move();
            }
        }

        public void Stop()
        {
            floors.Remove(fd.floor);
            if (floors.Count == 0) {
                fd.status = Status.Idle;
                Display();               
            }
            else
            {
                Move();
            }
        }

        public void Display()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("CodeBoxx!");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("Elevator: ");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write(name);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" Floor: ");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write(fd.floor);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" Status: ");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write(fd.status);
            Console.ResetColor();
            Console.Write("\n");

        }
    }

    class ClassicElevator : Elevator // a classic elevator
    {
        List<Button> buttons = new List<Button>(); // a modern elevator with buttons
        public ClassicElevator(string name, int bottomfloor, int topfloor, int origin) // same constructor
            : base(name, bottomfloor, topfloor, origin) 
        {
            for (int i = bottomfloor; i < topfloor; i++ ) { // but with buttons
                Button b = new Button(i);
                buttons.Add(b);
            }
            if (bottomfloor != origin) { 
                Button b = new Button(origin);
                buttons.Add(b);
            }
        }
    }

    class Column // 
    {
        string name;
        int origin;
        int bottomfloor;
        int topfloor;
        int elevAmt;

        public List<object> btns = new List<object>(); // don't know yet whether they will hold buttons or call buttons! Iamnerd!
        public List<Elevator> els = new List<Elevator>(); // don't know yet whether they will hold Elevators or modern elevators! 

        public Column(string setname, int setorigin, int setbottomfloor, int settopfloor, int setelevAmt) { // this I just decided will hold a classic column
            name = setname;
            origin = setorigin;
            bottomfloor = setbottomfloor;
            topfloor = settopfloor;
            elevAmt = setelevAmt;

            // add classic elevators to my classic column
            for (int i = 0; i < elevAmt; i++ ) { // but with buttons
                ClassicElevator e = new ClassicElevator(name+i.ToString(), bottomfloor, topfloor, origin); // make up button
                els.Add(e); // add to list 
            }
            // add call buttons to my classic column
            for (int i = bottomfloor; i < topfloor; i++ ) { // but with buttons
                CallButton bup = new CallButton(i, true); // make up button
                btns.Add(bup); // add to list 
                CallButton bd = new CallButton(i, false); // down
                btns.Add(bd); // list
            }
            if (bottomfloor != origin) { 
                CallButton bup = new CallButton(origin, true); // make up button
                btns.Add(bup); // add to list 
                CallButton bd = new CallButton(origin, false); // down
                btns.Add(bd); // list
            }
        }

        public Column(int setorigin, int setbottomfloor, int settopfloor, int setelevAmt, string setname) // this is a modern column, notice the difference
        {
            // add classic elevators to my classic column
            for (int i = 0; i < elevAmt; i++ ) { // but with buttons
                Elevator e = new Elevator(name+i.ToString(), bottomfloor, topfloor, origin); // make up button
                els.Add(e); // add to list 
            }
            for (int i = bottomfloor; i < topfloor; i++ ) { // but with buttons
                Button b = new Button(i); // make up button
                btns.Add(b); // add to list 
            }
            if (bottomfloor != origin) { 
                Button b = new Button(origin); // make up button
                btns.Add(origin); // add to list 
            }
        } // ints before string is sooooooo modern

        public void RequestElevator(int target) // Person is at the target, they want to be picked up and brought to origin, modern approach, modern callbuttons, no elevator buttons
        {
            int elchoice = -1;
            int diff = 0;
            int bestdiff = 999;

            if (target > origin) { // if target > origin - first priority is elevator above target moving down
                for (int i = 0; i < elevAmt; i++) // iterate
                {
                    if (els[i].fd.floor == target && els[i].fd.status != Status.Up) { // already found the perfect elevator
                        els[i].PushFloor(origin); // now lets stop, and go to origin
                        return;
                    }
                    if (els[i].fd.floor > target && els[i].fd.status == Status.Down) { // first priority
                        diff = els[i].fd.floor - target;
                        if (diff < bestdiff)
                        {
                            elchoice = i;
                            bestdiff = diff;
                        }
                    } 
                } // end iterate
                if (elchoice != -1)
                {
                    els[elchoice].PushFloor(target);
                    els[elchoice].PushFloor(origin);
                }
                else // no first priority elevator, find closest Idle elevator
                {
                    for (int i = 0; i < elevAmt; i++) // iterate
                    {
                        if (els[i].fd.floor > target && els[i].fd.status == Status.Idle) {
                            diff = els[i].fd.floor - target;
                            if (diff < bestdiff)
                            {
                                elchoice = i;
                                bestdiff = diff;
                            }
                        } 
                        if (els[i].fd.floor < target && els[i].fd.status == Status.Idle) {
                            diff =  target - els[i].fd.floor;
                            if (diff < bestdiff)
                            {
                                elchoice = i;
                                bestdiff = diff;
                            }
                        } 
                    } // end iterate
                    els[elchoice].PushFloor(target);
                    els[elchoice].PushFloor(origin);
                }
            }

            if (target < origin) // first priority is elevator above target moving down
            {
            for (int i = 0; i < elevAmt; i++) // iterate
            {
                if (els[i].fd.floor == target && els[i].fd.status != Status.Down) { // already found the perfect elevator
                    els[i].PushFloor(origin); // now lets stop, and go to origin
                    return;
                }
                if (els[i].fd.floor < target && els[i].fd.status == Status.Up) { // first priority
                    diff = target - els[i].fd.floor;
                    if (diff < bestdiff)
                    {
                        elchoice = i;
                        bestdiff = diff;
                    }
                } 
            } // end iterate
            if (elchoice != -1)
            {
                els[elchoice].PushFloor(target);
                els[elchoice].PushFloor(origin);
            }
            else // no first priority elevator, find closest Idle elevator
            {
                for (int i = 0; i < elevAmt; i++) // iterate
                {
                    if (els[i].fd.floor > target && els[i].fd.status == Status.Idle) {
                        diff = els[i].fd.floor - target;
                        if (diff < bestdiff)
                        {
                            elchoice = i;
                            bestdiff = diff;
                        }
                    } 
                    if (els[i].fd.floor < target && els[i].fd.status == Status.Idle) {
                        diff =  target - els[i].fd.floor;
                        if (diff < bestdiff)
                        {
                            elchoice = i;
                            bestdiff = diff;
                        }
                    } 
                } // end iterate
                els[elchoice].PushFloor(target);
                els[elchoice].PushFloor(origin);                    
                }

            } // end first priority
        } // End Request Elevator

        public void AssignElevator(int target) // Person is at the origin, they want to be picked up and brought to target, modern approach, modern callbuttons, no elevator buttons
        {
            int elchoice = -1;
            int diff = 0;
            int bestdiff = 999;

            if (target > origin) { // if target > origin - first priority is elevator above target moving down
                for (int i = 0; i < elevAmt; i++) // iterate
                {
                    if (els[i].fd.floor == origin) { // already found the perfect elevator
                        els[i].PushFloor(target); // now lets stop, and go to origin
                        return;
                    }
                    if (els[i].fd.floor > origin && els[i].fd.status == Status.Down) { // first priority
                        diff = els[i].fd.floor - origin;
                        if (diff < bestdiff)
                        {
                            elchoice = i;
                            bestdiff = diff;
                        }
                    } 
                } // end iterate
                if (elchoice != -1) // a elevator was found moving towards origin, this is the closest one - this one gets the job
                {
                    els[elchoice].PushFloor(origin);
                    els[elchoice].PushFloor(target);
                }
                else // no first priority elevator, find closest Idle elevator
                {
                    for (int i = 0; i < elevAmt; i++) // iterate
                    {
                        if (els[i].fd.floor > origin && els[i].fd.status == Status.Idle) {
                            diff = els[i].fd.floor - origin;
                            if (diff < bestdiff)
                            {
                                elchoice = i;
                                bestdiff = diff;
                            }
                        } 
                        if (els[i].fd.floor < origin && els[i].fd.status == Status.Idle) {
                            diff =  origin - els[i].fd.floor;
                            if (diff < bestdiff)
                            {
                                elchoice = i;
                                bestdiff = diff;
                            }
                        } 
                    } // end iterate
                    els[elchoice].PushFloor(origin);
                    els[elchoice].PushFloor(target);
                }
            }
        }
    
    }

    class Battery
    {

    }

    

    class Program
    {



        static void Main(string[] args)
        {
            string datePatt = @"M/d/yyyy hh:mm:ss tt";
            void DisplayNow(string title, DateTime inputDt)
            {
                string dtString = inputDt.ToString(datePatt);
                Console.WriteLine("{0} {1}, Kind = {2}",
                title, dtString);
            }
            DateTime saveNow = DateTime.Now;
            DateTime myDt;
            myDt = DateTime.SpecifyKind(saveNow, DateTimeKind.Local);
            Console.ForegroundColor = ConsoleColor.Red;
            DisplayNow("Simulation started at .............", saveNow);

            Elevator e = new Elevator("CodeBoxx!", 1, 20, 1);
            e.Display();
            Console.ResetColor();
        }
    }
}
