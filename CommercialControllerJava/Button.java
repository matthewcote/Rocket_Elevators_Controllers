public class Button 
{
	int floor;
	private boolean status;
	
	public Button(int initfloor) // Constructor
	{
		floor = initfloor;
		status = false; // false = inactive, true = active
		System.out.print("Button Created:> Floor: ");
		System.out.print(floor);
		System.out.print("  Status: ");
		System.out.print(status);
		
	} // End Constructor
	
	// Getters and Setters
	public boolean getstatus() {
		return status;
	}
	
	public int getfloor() {
		return floor;
	}
	
	public void setstatus(boolean isactive) {
		status = isactive;
	}
	
} // End Button Class
