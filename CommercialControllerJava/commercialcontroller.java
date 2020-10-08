
import java.util.*;

class CommercialController {
   
    
    
    public static void main(String[] args) {
        System.out.println("Hello, World.");
        Scanner input = new Scanner(System.in);
        int a = input.nextInt();
        while (a != 42){      
            if (a == 1) {
                System.out.println("Hello, World.");
                System.out.println("Hello, World.");
                System.out.println("He4lo, World.");
                System.out.println("Hello, World.");
                System.out.println("Hello, World.");
                System.out.println("Hello, World.");
            }
            if (a == 2) {
                System.out.println("why 2, that is not enough");
            }
            if (a == 3) {
                System.out.println("Classic Approach");
            }
        a = input.nextInt();
        }
        if (a == 1) {
            System.out.println("Hello, World.");
            System.out.println("Hello, World.");
            System.out.println("Hello, World.");
            System.out.println("Hello, World.");
            System.out.println("Hello, World.");
            System.out.println("Hello, World.");
        }
        if (a == 2) {
            System.out.println("why 42, that is not enough");
        }
        if (a == 3) {
            System.out.println("Classic Approach");
        }

    }
}