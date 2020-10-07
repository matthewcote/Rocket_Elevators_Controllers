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
        Status status;
        int floor;

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

        public Elevator(string setname, int setbottomfloor, int settopfloor, int setorigin) 
        {
            name = setname;
            fd = new FloorDisplay(setorigin);
            door = new Door(false);
            
        }
    }

    class ModernElevator : Elevator
    {
        public ModernElevator(string setname, int setbottomfloor, int settopfloor, int setorigin)
            : base(setname, setbottomfloor, settopfloor, setorigin)
        {

        }
    }

    class ClassicElevator : Elevator 
    {
        public ClassicElevator(string setname, int setbottomfloor, int settopfloor, int setorigin)
            : base(setname, setbottomfloor, settopfloor, setorigin)
        {

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
