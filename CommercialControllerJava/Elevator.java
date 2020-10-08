import java.util.*;


public class Elevator extends FloorDisplay
{

	public String name;
	public FloorDisplay fd;
	private Door door;
	
	//Creating a List using ArrayList  
	private List<FloorDoor> floordoors = new ArrayList<FloorDoor>();
	private List<Integer> floors = new ArrayList<Integer>();
	
	public Elevator(String initname, int bottomfloor, int topfloor, int origin) { // Modern Elevator
		super(origin); // inherits floor and status from floordisplay
		name = initname;
        door = new Door();
        fd = new FloorDisplay(origin);
		
		if (origin != bottomfloor)
		{
		FloorDoor floordoor = new FloorDoor(origin);
        floordoors.add(floordoor);
		}
        for (int i = bottomfloor; i <= topfloor; i++)
        {
            FloorDoor flrdoor = new FloorDoor(i);
            floordoors.add(flrdoor);
        }
	}
	
	public void setStatus(int setfloor, Status setstatus) {
		setstatus(setfloor, setstatus);
	}
	
	public void PushFloor(int targetfloor) {
		floors.add(targetfloor);
		if (targetfloor == fd.floor) 
		{
			setStatus(floor, Status.Idle);
			stop();
		}
		else if (targetfloor > floor)
		{
			setStatus(floor, Status.Up);
			Display();
			move();
		}
		else 
		{
			setStatus(floor, Status.Down);
			Display();
			move();
		}
	} // End pushfloors
	
	private void move() {
		if (floors.contains(floor)){ 
				stop();
		}
		if (fd.status == Status.Up)
		{
			floor += 1;
			setStatus(floor, status);
			Display();
			if (floors.contains(floor))
				stop();
			else 
				move();
		}
		if (fd.status == Status.Down)
		{
			floor += 1;
			setStatus(floor, fd.status);
			Display();
			if (floors.contains(floor))
				stop();
			else 
				move();
		}
	} // End move
	
	private void stop() {
		floors.remove(floor);
		setDoors(true);
		if (floors.isEmpty())
			setStatus(floor, Status.Idle);
		else 
			move();
	} // End stop
	
	private void setDoors(boolean isopen) 
	{
		// TODO
	}
	
	public void Display() 
	{
		// TODO
	}

	private void sleep(int milliseconds) 
	{
		// TODO
	}
	
}