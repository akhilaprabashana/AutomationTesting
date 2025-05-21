import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class AppointmentTest {

    WebDriver driver = new FirefoxDriver();

    @BeforeMethod
    public void login(){
        driver.get("http://localhost:3000/login");
        driver.manage().window().maximize();
        WebElement email = driver.findElement( By.xpath("//input[@id='email']"));
        email.sendKeys("kasun@gmail.com");
        WebElement password = driver.findElement( By.xpath("//input[@id='password']"));
        password.sendKeys("12345678");
        WebElement button = driver.findElement(By.xpath("//button[normalize-space()='Login']"));
        button.click();
    }

    @AfterMethod
    public void close(){
        driver.quit();
    }

    @Test
    public void appointment(){

        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement appBtn = driver.findElement(By.xpath("//a[@id='schedule-appointment-button']"));
        appBtn.click();

        try{
            Thread.sleep(2000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement select_patient = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//input[@id='patient-select']")));
        select_patient.click();

        WebElement firstOption = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("(//li[@role='option'])[1]")
        ));
        firstOption.click();

        try{
            Thread.sleep(2000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement select_doctor = wait2.until(ExpectedConditions.elementToBeClickable(By.xpath("//input[@id='doctor-select']")));
        select_doctor.click();

        WebElement firstOption2 = wait2.until(ExpectedConditions.elementToBeClickable(
                By.xpath("(//li[@role='option'])[1]")
        ));
        firstOption2.click();

        WebElement dateInput = driver.findElement(By.xpath("//input[@id='appointment-date']"));
        dateInput.sendKeys("2025-05-10");

        WebElement timeInput = driver.findElement(By.xpath("//input[@id='appointment-time']"));
        timeInput.sendKeys("14:30");

        WebElement purpose = driver.findElement(By.xpath("//textarea[@id='purpose']"));
        purpose.sendKeys("Test purpose");

        WebDriverWait wait3 = new WebDriverWait(driver, Duration.ofSeconds(3));

        WebElement status = wait3.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@id='status']")));
        status.click();

        WebElement firstOption3 = wait3.until(ExpectedConditions.elementToBeClickable(
                By.xpath("(//li[@role='option'])[1]")
        ));
        firstOption3.click();

        WebElement notes = driver.findElement(By.xpath("//textarea[@id='notes']"));
        notes.sendKeys("Test note");

        WebElement submit = driver.findElement(By.xpath("//button[normalize-space()='Schedule Appointment']"));
        submit.click();

        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement edit = driver.findElement(By.cssSelector("tbody tr:nth-child(1) td:nth-child(7) button:nth-child(1) svg"));
        edit.click();

        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement editField = driver.findElement(By.name("purpose"));
        editField.clear();
        editField.sendKeys("updated purpose");

        WebElement saveChanges = driver.findElement(By.xpath("//button[normalize-space()='Save Changes']"));
        saveChanges.click();

        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement delete = driver.findElement(By.cssSelector("tbody tr:nth-child(1) td:nth-child(7) button:nth-child(2) svg path"));
        delete.click();

        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement aceept = driver.findElement(By.xpath("//button[normalize-space()='Yes, Cancel Appointment']"));
        aceept.click();

    }
}
