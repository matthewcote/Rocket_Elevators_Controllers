import java.util.*;
public class Elevator extends FloorDisplay
{
	private int name;
	private int bottomfloor;
	private int topfloor;
	private int origin;
	private int floor;
	private Status status;
	
	private FloorDisplay floordisplay;
	private Door door;
	
	//Creating a List using ArrayList  
	private List<Button> buttons = new ArrayList<Button>();  
	private List<FloorDoor> floordoors = new ArrayList<FloorDoor>();
	private List<Integer> floors = new ArrayList<Integer>();
	
	public Elevator(int initname, int botfloor, int tpflr, int initorigin) { // call this constructor if origin is not bottom floor
		super(initorigin); // inherits floor and status from floordisplay
		name = initname;
        bottomfloor = botfloor;
        topfloor = tpflr;
        origin = initorigin;
        door = new Door();
        floordisplay = new FloorDisplay(origin);
        Button button = new Button(origin);
        buttons.add(button);
        FloorDoor floordoor = new FloorDoor(origin);
        floordoors.add(floordoor);
        
        for (int i = bottomfloor; i <= topfloor; i++)
        {
        	Button btn = new Button(i);
            buttons.add(btn);
            FloorDoor flrdoor = new FloorDoor(i);
            floordoors.add(flrdoor);
        }
	}
	
	public Elevator(int initname, int botfloor, int tpflr) { // call this constructor if origin is bottom floor
		super(botfloor);
		name = initname;
		bottomfloor = botfloor;
		topfloor = tpflr;
		origin = bottomfloor;
		
		door = new Door();
		floordisplay = new FloorDisplay(origin);
		
		for (int i = bottomfloor; i <= topfloor; i++)
        {
        	Button btn = new Button(i);
            buttons.add(btn);
            FloorDoor flrdoor = new FloorDoor(i);
            floordoors.add(flrdoor);
        }
		
		
		
		
	}
	
	public void setStatus(int setfloor, Status setstatus) {
		floor = setfloor;
		status = setstatus;
		floordisplay.setstatus(setfloor, setstatus);
	}
	
	public void pushfloors(int targetfloor) {
		floors.add(targetfloor);
		if (targetfloor == floor) 
		{
			setStatus(floor, Status.Idle);
			stop();
		}
		else if (targetfloor > floor)
		{
			setStatus(floor, Status.Up);
			move();
		}
		else 
		{
			setStatus(floor, Status.Down);
			move();
		}
	} // End pushfloors
	
	public void move() {
		if (status == Status.Up)
		{
			floor += 1;
			setStatus(floor, status);
			if (floors.contains(floor))
				stop();
			else 
				move();
		}
	} // End move
	
	public void stop() {
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
	
	private void sleep(int milliseconds) 
	{
		// TODO
	}
	
}