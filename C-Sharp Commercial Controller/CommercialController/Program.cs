using System;
using System.Collections.Generic;
using System.Media;

namespace CommercialController
{
    enum Status: int {Idle, Down, Up, Left, Right, A, B};

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

        public void konami (string name, Status setstatus, int setfloor)
        {
            ConsoleColor[] colors = {ConsoleColor.Red, ConsoleColor.Cyan, ConsoleColor.Yellow, ConsoleColor.Magenta, ConsoleColor.Blue};
            int color = (int) setstatus;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("Elevator: ");
            Console.Write(name);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" Floor: ");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write(setfloor);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" Status: ");
            Console.ForegroundColor = colors[color % 4];
            Console.Write(setstatus);
            Console.ResetColor();
            Console.Write("\n");
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
                Display(fd.floor % 4);
                Stop();
            }

            if (fd.floor < target) 
            { // Going Up
                fd.status = Status.Up;
                Display(fd.floor % 4);
                Stop();
            }
        }

        public void Move() 
        {
            if (fd.floor == 42) {
                konami();
            }
            
            if (floors.Contains(fd.floor)) {
                Stop();
            }
            if (fd.status == Status.Up) {
                fd.floor += 1;
                Display(fd.floor % 4);
                Move();
            }
            if (fd.status == Status.Down) {
                fd.floor -= 1;
                Display(fd.floor % 4);
                Move();
            }
        }

        public void Stop()
        {
            floors.Remove(fd.floor);
            if (floors.Count == 0) {
                Console.WriteLine("Elevator "+name+" stopped at Floor: "+fd.floor.ToString());
                fd.status = Status.Idle;
                Display(fd.floor % 4);               
            }
            else
            {
                Move();
            }
        }

        private void konami() {
            Console.ForegroundColor = ConsoleColor.Magenta;
            Console.Write("Elevator: ");
            Console.Write(name);
            Console.Write(" does the Konami!");
            Console.WriteLine();
            fd.konami(name, Status.Up, 42);
            fd.konami(name, Status.Up, 42);
            fd.konami(name, Status.Down, 42);
            fd.konami(name, Status.Down, 42);
            fd.konami(name, Status.Left, 42);
            fd.konami(name, Status.Right, 42);
            fd.konami(name, Status.Left, 42);
            fd.konami(name, Status.Right, 42);
            fd.konami(name, Status.A, 42);
            fd.konami(name, Status.B, 42);
        }
        
        public void Display()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("Elevator: ");
            Console.Write("Elevator: ");
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

        public void Display(int i)
        {
            ConsoleColor[] colors = {ConsoleColor.Red, ConsoleColor.Cyan, ConsoleColor.Yellow, ConsoleColor.Magenta, ConsoleColor.Blue};
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("Elevator: ");
            Console.ForegroundColor = colors[Math.Abs(i)];
            Console.Write(name);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" Floor: ");
            Console.ForegroundColor = colors[Math.Abs(i)];
            Console.Write(fd.floor);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" Status: ");
            int color = (int) fd.status;
            Console.ForegroundColor = colors[color];
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

    class Column // Modern Column
    {
        public string name;
        public int origin;
        public int bottomfloor;
        public int topfloor;
        int elevAmt;

        public List<Button> btns = new List<Button>(); // Button
        public List<Elevator> els = new List<Elevator>(); // don't know yet whether they will hold Elevators or modern elevators! 

        public Column(int setorigin, int setbottomfloor, int settopfloor, int setelevAmt, string setname) // this is a modern column, notice the difference
        {
            name = setname;
            origin = setorigin;
            bottomfloor = setbottomfloor;
            topfloor = settopfloor;
            elevAmt = setelevAmt;
            ConsoleColor[] colors = {ConsoleColor.Red, ConsoleColor.Cyan, ConsoleColor.Yellow, ConsoleColor.Magenta, ConsoleColor.Blue};
            // add classic elevators to my classic column
            for (int i = 0; i < elevAmt; i++ ) { // but with buttons
                int j = i+1;
                string s = name + j.ToString();
                Elevator e = new Elevator(s, bottomfloor, topfloor, origin); // make up button
                Console.ForegroundColor = colors[4]; //just having a little fun change this to colors[i]
                Console.WriteLine("Column " +  name + ": Added Elevator " + e.name);
                e.Display();
                els.Add(e); // add to list 
            }
            for (int i = bottomfloor; i < topfloor; i++ ) { // but with buttons
                Button b = new Button(i); // make up button
                btns.Add(b); // add to list 
            }
            if (bottomfloor != origin) { 
                Button b = new Button(origin); // make up button
                btns.Add(b); // add to list 
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

    class ClassicColumn
    {
        string name;
        public int origin;
        public int bottomfloor;
        public int topfloor;
        int elevAmt;

        public List<CallButton> btns = new List<CallButton>(); // don't know yet whether they will hold buttons or call buttons! Iamnerd!
        public List<ClassicElevator> els = new List<ClassicElevator>(); // don't know yet whether they will hold Elevators or modern elevators! 

        public ClassicColumn(string setname, int setorigin, int setbottomfloor, int settopfloor, int setelevAmt) { // this I just decided will hold a classic column
            name = setname;
            origin = setorigin;
            bottomfloor = setbottomfloor;
            topfloor = settopfloor;
            elevAmt = setelevAmt;

            // add classic elevators to my classic column
            for (int i = 0; i < elevAmt; i++ ) { // but with buttons
                int j = i+1;
                string s = name + j.ToString();
                ClassicElevator e = new ClassicElevator(s, bottomfloor, topfloor, origin); // make up button
                Console.ForegroundColor = ConsoleColor.Magenta;
                Console.WriteLine("Column " +  name + ": Added Elevator " + e.name);
                e.Display();
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
    }

    class Battery
    {
        public List<Column> clmns = new List<Column>();
        public Battery() {

        }

        public void RequestElevator(int target) // Person is at the target, they want to be picked up and brought to origin, modern approach, modern callbuttons, no elevator buttons
        {
            foreach (Column clmn in clmns) {
                if (target >= clmn.bottomfloor && target <= clmn.topfloor) {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Request for elevator to Floor: " + target.ToString());
                    Console.WriteLine("Battery had chosen " + clmn.name + " and sent it to " + target.ToString());
                    clmn.RequestElevator(target);
                }
            }
        }

        public void AssignElevator(int target) 
        {
            foreach (Column clmn in clmns) {
                if (target >= clmn.bottomfloor && target <= clmn.topfloor) {
                    clmn.AssignElevator(target); // Person is at the origin, they want to be picked up and brought to target, modern approach, modern callbuttons, no elevator buttons 
                }
            }
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.BackgroundColor = ConsoleColor.Red;
            string datePatt = @"M/d/yyyy hh:mm:ss tt";
            
            void DisplayNow(string title, DateTime inputDt)
            {
                string dtString = inputDt.ToString(datePatt);
                Console.WriteLine("{0} {1}",
                title, dtString);
            }

            void Scenario1() {
                DateTime saveNow = DateTime.Now;
                DateTime myDt;
                myDt = DateTime.SpecifyKind(saveNow, DateTimeKind.Local);
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ATTENTION - SIMULATION BEGINNING");
                DisplayNow("Simulation 1: Beginning computation now .............", saveNow);

                Battery bat = new Battery();
                Column A = new Column(1, -6, -1, 5, "A");
                Column B = new Column(1, 1, 20, 5, "B");            
                Column C = new Column(1, 21, 40, 5, "C");
                Column D = new Column(1, 41, 60, 5, "D");
                bat.clmns.Add(A);
                bat.clmns.Add(B);
                bat.clmns.Add(C);
                bat.clmns.Add(D);
                
                bat.clmns[1].els[0].fd.SetDisplay(Status.Down,20);
                bat.clmns[1].els[0].Display(0);
                bat.clmns[1].els[1].fd.SetDisplay(Status.Up,3);
                bat.clmns[1].els[1].Display(1);
                bat.clmns[1].els[2].fd.SetDisplay(Status.Down,13);
                bat.clmns[1].els[2].Display(2);
                bat.clmns[1].els[3].fd.SetDisplay(Status.Down,15);
                bat.clmns[1].els[3].Display(3);
                bat.clmns[1].els[4].fd.SetDisplay(Status.Down,6);
                bat.clmns[1].els[4].Display(4);

                bat.AssignElevator(20);
    
                Console.ResetColor();
            }

            void Scenario2() 
            {
                DateTime saveNow = DateTime.Now;
                DateTime myDt;
                myDt = DateTime.SpecifyKind(saveNow, DateTimeKind.Local);
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ATTENTION - SIMULATION BEGINNING");
                DisplayNow("Simulation - 2 started at .............", saveNow);

                Battery bat = new Battery();
                Column A = new Column(1, -6, -1, 5, "A");
                Column B = new Column(1, 1, 20, 5, "B");            
                Column C = new Column(1, 21, 40, 5, "C");
                Column D = new Column(1, 41, 60, 5, "D");
                bat.clmns.Add(A);
                bat.clmns.Add(B);
                bat.clmns.Add(C);
                bat.clmns.Add(D);
                
                bat.clmns[2].els[0].fd.SetDisplay(Status.Idle,1);
                bat.clmns[2].els[0].Display(0);
                bat.clmns[2].els[1].fd.SetDisplay(Status.Up,23);
                bat.clmns[2].els[1].Display(1);
                bat.clmns[2].els[2].fd.SetDisplay(Status.Down,33);
                bat.clmns[2].els[2].Display(2);
                bat.clmns[2].els[3].fd.SetDisplay(Status.Down,40);
                bat.clmns[2].els[3].Display(3);
                bat.clmns[2].els[4].fd.SetDisplay(Status.Down,39);
                bat.clmns[2].els[4].Display(4);

                bat.AssignElevator(36);
    
                Console.ResetColor();
            }

            void Scenario3() {
                DateTime saveNow = DateTime.Now;
                DateTime myDt;
                myDt = DateTime.SpecifyKind(saveNow, DateTimeKind.Local);
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ATTENTION - SIMULATION BEGINNING");
                DisplayNow("Simulation - 3 started at .............", saveNow);

                Battery bat = new Battery();
                Column A = new Column(1, -6, -1, 5, "A");
                Column B = new Column(1, 1, 20, 5, "B");            
                Column C = new Column(1, 21, 40, 5, "C");
                Column D = new Column(1, 41, 60, 5, "D");
                bat.clmns.Add(A);
                bat.clmns.Add(B);
                bat.clmns.Add(C);
                bat.clmns.Add(D);
                
                bat.clmns[3].els[0].fd.SetDisplay(Status.Down,58);
                bat.clmns[3].els[0].Display(0);
                bat.clmns[3].els[1].fd.SetDisplay(Status.Up,50);
                bat.clmns[3].els[1].Display(1);
                bat.clmns[3].els[2].fd.SetDisplay(Status.Up,46);
                bat.clmns[3].els[2].Display(2);
                bat.clmns[3].els[3].fd.SetDisplay(Status.Up,1);
                bat.clmns[3].els[3].Display(3);
                bat.clmns[3].els[4].fd.SetDisplay(Status.Down,60);
                bat.clmns[3].els[4].Display(4);

                bat.RequestElevator(54);
    
                Console.ResetColor();
                Console.Beep();
            }



            void Scenario4() {
                DateTime saveNow = DateTime.Now;
                DateTime myDt;
                myDt = DateTime.SpecifyKind(saveNow, DateTimeKind.Local);
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("ATTENTION - SIMULATION BEGINNING");
                DisplayNow("Simulation - 4 started at .............", saveNow);

                Battery bat = new Battery();
                Column A = new Column(1, -6, -1, 5, "A");
                Column B = new Column(1, 1, 20, 5, "B");            
                Column C = new Column(1, 21, 40, 5, "C");
                Column D = new Column(1, 41, 60, 5, "D");
                bat.clmns.Add(A);
                bat.clmns.Add(B);
                bat.clmns.Add(C);
                bat.clmns.Add(D);
                
                bat.clmns[0].els[0].fd.SetDisplay(Status.Idle, -4);
                bat.clmns[0].els[0].Display(0);
                bat.clmns[0].els[1].fd.SetDisplay(Status.Idle,1);
                bat.clmns[0].els[1].Display(1);
                bat.clmns[0].els[2].fd.SetDisplay(Status.Down,-3);
                bat.clmns[0].els[2].Display(2);
                bat.clmns[0].els[3].fd.SetDisplay(Status.Up,-6);
                bat.clmns[0].els[3].Display(3);
                bat.clmns[0].els[4].fd.SetDisplay(Status.Down,-1);
                bat.clmns[0].els[4].Display(4);

                bat.RequestElevator(-3);
    
                Console.ResetColor();
            }

            DateTime saveNow = DateTime.Now;
            DateTime myDt;
            myDt = DateTime.SpecifyKind(saveNow, DateTimeKind.Local);
            Console.ForegroundColor = ConsoleColor.Red;
            DisplayNow("Simulation started at .............", saveNow);

            Scenario1();

            Scenario2();

            Scenario3();

            Scenario4();
  
            Console.ResetColor();
        }
    }
}
