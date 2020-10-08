public class Door 
{
	private boolean isopen;
	
	public Door() 
	{
		System.out.print("Door created - ");
		isopen = false;
		logstatus();
	}		
	
	public void setdoor(boolean open) 
	{
		isopen = open;
	}
	
	public void logstatus() 
	{
		if (isopen)
		{
			System.out.print(" Door status: Open");
		} 
		else
		{
			System.out.print(" Door status: Closed");
		}
    }
}