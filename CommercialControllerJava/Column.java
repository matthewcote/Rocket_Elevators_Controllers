import java.util.*;
public class Column // Modern Column, had buttons and Elevators
{
	public String name;
	public int origin;
	public int bottomfloor;
	public int topfloor;
	int elevAmt;

	public ArrayList<Button> btns = new ArrayList<Button>(); // don't know yet whether they will hold buttons or call buttons! Iamnerd!
	public ArrayList<Elevator> els = new ArrayList<Elevator>(); // don't know yet whether they will hold Elevators or modern elevators! 
	
	public Column(int setorigin, int setbottomfloor, int settopfloor, int setelevAmt, String setname) // this is a modern column, notice the difference
	{
		name = setname;
		origin = setorigin;
		bottomfloor = setbottomfloor;
		topfloor = settopfloor;
		elevAmt = setelevAmt;

		// add classic elevators to my classic column
		for (int i = 0; i < elevAmt; i++ ) { // but with buttons
			int j = i+1;
			String s = name + Integer.toString(j);
			Elevator e = new Elevator(s, bottomfloor, topfloor, origin); // make up button

			System.out.println("Column " +  name + ": Added Elevator " + e.name);
			e.Display();
			els.add(e); // add to list 
		}
		for (int i = bottomfloor; i < topfloor; i++ ) { // but with buttons
			Button b = new Button(i); // make up button
			btns.add(b); // add to list 
		}
		if (bottomfloor != origin) { 
			Button b = new Button(origin); // make up button
			btns.add(b); // add to list 
		}
	}

	public void RequestElevator(int target) // Person is at the target, they want to be picked up and brought to origin, modern approach, modern callbuttons, no elevator buttons
	{
		int elchoice = -1;
		int diff = 0;
		int bestdiff = 999;

		if (target > origin) { // if target > origin - first priority is elevator above target moving down
			for (int i = 0; i < elevAmt; i++) // iterate
			{
				if (els.get(i).fd.floor == target && els.get(i).fd.status != FloorDisplay.Status.Up) { // already found the perfect elevator
					els.get(i).PushFloor(origin); // now lets stop, and go to origin
					return;
				}
				if (els.get(i).fd.floor > target && els.get(i).fd.status == FloorDisplay.Status.Down) { // first priority
					diff = els.get(i).fd.floor - target;
					if (diff < bestdiff)
					{
						elchoice = i;
						bestdiff = diff;
					}
				} 
			} // end iterate
			if (elchoice != -1)
			{
				els.get(elchoice).PushFloor(target);
				els.get(elchoice).PushFloor(origin);
			}
			else // no first priority elevator, find closest Idle elevator
			{
				for (int i = 0; i < elevAmt; i++) // iterate
				{
					if (els.get(i).fd.floor > target && els.get(i).fd.status == FloorDisplay.Status.Idle) {
						diff = els.get(i).fd.floor - target;
						if (diff < bestdiff)
						{
							elchoice = i;
							bestdiff = diff;
						}
					} 
					if (els.get(i).fd.floor < target && els.get(i).fd.status == FloorDisplay.Status.Idle) {
						diff =  target - els.get(i).fd.floor;
						if (diff < bestdiff)
						{
							elchoice = i;
							bestdiff = diff;
						}
					} 
				} // end iterate
				els.get(elchoice).PushFloor(target);
				els.get(elchoice).PushFloor(origin);
			}
		}

		if (target < origin) // first priority is elevator above target moving down
		{
			for (int i = 0; i < elevAmt; i++) // iterate
			{
				if (els.get(i).fd.floor == target && els.get(i).fd.status != FloorDisplay.Status.Down) { // already found the perfect elevator
					els.get(i).PushFloor(origin); // now lets stop, and go to origin
					return;
				}
				if (els.get(i).fd.floor < target && els.get(i).fd.status == FloorDisplay.Status.Up) { // first priority
					diff = target - els.get(i).fd.floor;
					if (diff < bestdiff)
					{
						elchoice = i;
						bestdiff = diff;
					}
				} 
			} // end iterate
		if (elchoice != -1)
			{
				els.get(elchoice).PushFloor(target);
				els.get(elchoice).PushFloor(origin);
			}
		else // no first priority elevator, find closest Idle elevator
		{
			for (int i = 0; i < elevAmt; i++) // iterate
			{
				if (els.get(i).fd.floor > target && els.get(i).fd.status == FloorDisplay.Status.Idle) {
					diff = els.get(i).fd.floor - target;
					if (diff < bestdiff)
					{
						elchoice = i;
						bestdiff = diff;
					}
				} 
				if (els.get(i).fd.floor < target && els.get(i).fd.status == FloorDisplay.Status.Idle) {
					diff =  target - els.get(i).fd.floor;
					if (diff < bestdiff)
					{
						elchoice = i;
						bestdiff = diff;
					}
				} 
			} // end iterate
			els.get(elchoice).PushFloor(target);
			els.get(elchoice).PushFloor(origin);                    
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
				if (els.get(i).fd.floor == origin) { // already found the perfect elevator
					els.get(i).PushFloor(target); // now lets stop, and go to origin
					return;
				}
				if (els.get(i).fd.floor > origin && els.get(i).fd.status == FloorDisplay.Status.Down) { // first priority
					diff = els.get(i).fd.floor - origin;
					if (diff < bestdiff)
					{
						elchoice = i;
						bestdiff = diff;
					}
				} 
			} // end iterate
			if (elchoice != -1) // a elevator was found moving towards origin, this is the closest one - this one gets the job
			{
				els.get(elchoice).PushFloor(origin);
				els.get(elchoice).PushFloor(target);
			}
			else // no first priority elevator, find closest Idle elevator
			{
				for (int i = 0; i < elevAmt; i++) // iterate
				{
					if (els.get(i).fd.floor > origin && els.get(i).fd.status == FloorDisplay.Status.Idle) {
						diff = els.get(i).fd.floor - origin;
						if (diff < bestdiff)
						{
							elchoice = i;
							bestdiff = diff;
						}
					} 
					if (els.get(i).fd.floor < origin && els.get(i).fd.status == FloorDisplay.Status.Idle) {
						diff =  origin - els.get(i).fd.floor;
						if (diff < bestdiff)
						{
							elchoice = i;
							bestdiff = diff;
						}
					} 
				} // end iterate
				els.get(elchoice).PushFloor(origin);
				els.get(elchoice).PushFloor(target);
			}
		}
	}
}