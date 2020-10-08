public class FloorDisplay 
{
	private int floor;
	public enum Status { Idle, Up, Down};
	private Status status;
	
	public FloorDisplay(int initfloor) 
	{
		floor = initfloor;
		status = Status.Idle;
		
	}
	
	public void setstatus(int setfloor, Status setstatus)
	{
		floor = setfloor;
		status = setstatus;
	}
	
}
