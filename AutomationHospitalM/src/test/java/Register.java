import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.annotations.BeforeMethod;

public class Register {
    WebDriver driver = new ChromeDriver();

    @BeforeMethod
    public void login() {
        driver.get("http://localhost:3000/login");
        driver.manage().window().maximize();
        WebElement email = driver.findElement(By.xpath("//input[@id='email']"));
        email.sendKeys("kasun@gmail.com");
        WebElement password = driver.findElement(By.xpath("//input[@id='password']"));
        password.sendKeys("12345678");
        WebElement button = driver.findElement(By.xpath("//button[normalize-space()='Login']"));
        button.click();
    }


}
