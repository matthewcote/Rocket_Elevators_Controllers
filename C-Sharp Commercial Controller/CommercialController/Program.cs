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
        // so about 15 mins ago, I deleted a complete modern commercial solution C#, by accident, on VS Studio Code, ironically I was trying to save my work on github, 
        // but I wasn't thinking and I cloned an empty repository onto my project, instead of the other way around - zero backup, permanent delete as far as i can tell
        // which is great news for me because tomorrow i can write it all again, right here, but first I will put this where it belongs, and back it up
        
    }

    class CallButton : Button
    {
        bool direction;

        public CallButton(int setfloor, bool setdirection) // true is up, false is down
            : base(setfloor)
        {
            direction = setdirection;
        }
    }

    class Door
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

    class FloorDoor : Door
    {
        int floor;

        public FloorDoor(bool setstatus, int setfloor) // true is up, false is down
            : base(setstatus)
        {
            floor = setfloor;
        }

    }

    class FloorDisplay
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

    class Elevator
    {
        string name;
        FloorDisplay fd;
        Door door;
        List<FloorDoor> floordoors = new List<FloorDoor>();
        List<int> floors = new List<int>();

        public Elevator(string setname, int bottomfloor, int topfloor, int origin) // A modern elevator
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

        }
    }

    class ClassicElevator : Elevator // a classic elevator
    {
        List<Button> buttons = new List<Button>();
        public ClassicElevator(string name, int bottomfloor, int topfloor, int origin)
            : base(name, bottomfloor, topfloor, origin)
        {
            for (int i = bottomfloor; i < topfloor; i++ ) {
                Button b = new Button(i);
                buttons.Add(b);
            }
            if (bottomfloor != origin) {
                Button b = new Button(origin);
                buttons.Add(b);
            }
        }
    }

    class Column 
    {

    }

    class Battery
    {

    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
