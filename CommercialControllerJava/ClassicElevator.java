import java.util.*;
public class ClassicElevator extends Elevator // a classic elevator
{
    public List<Button> buttons = new ArrayList<Button>(); // a modern elevator with buttons
    public ClassicElevator(String name, int bottomfloor, int topfloor, int origin) // same constructor
    {
        super(name, bottomfloor, topfloor, origin);
        for (int i = bottomfloor; i < topfloor; i++ ) { // but with buttons
            Button b = new Button(i);
            buttons.add(b);
        }
        if (bottomfloor != origin) { 
            Button b = new Button(origin);
            buttons.add(b);
        }
    }
}