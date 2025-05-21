import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class PatientTest {
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

    @Test
    public void patient(){
        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement labReportBtn = driver.findElement(By.id("register-patient-button"));
        labReportBtn.click();

        try{
            Thread.sleep(2000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement firstName = driver.findElement(By.xpath("//input[@id='firstName']"));
        firstName.sendKeys("test 1");

        WebElement lastName = driver.findElement(By.xpath("//input[@id='lastName']"));
        lastName.sendKeys("test 2");

        WebElement dob = driver.findElement(By.xpath("//input[@id='dateOfBirth']"));
        dob.sendKeys("2000-05-10");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement gender = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@id='gender']")));
        gender.click();

        WebElement firstOption = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("(//li[@role='option'])[1]")
        ));
        firstOption.click();

        WebElement contactNumber = driver.findElement(By.xpath("//input[@id='contactNumber']"));
        contactNumber.sendKeys("0711234567");

        WebElement email = driver.findElement(By.xpath("//input[@id='email']"));
        email.sendKeys("test@gmail.com");

        WebElement street = driver.findElement(By.xpath("//input[@id='street']"));
        street.sendKeys("test street");

        WebElement city = driver.findElement(By.xpath("//input[@id='city']"));
        city.sendKeys("test city");

        WebElement state = driver.findElement(By.xpath("//input[@id='state']"));
        state.sendKeys("test state");

        WebElement zipCode = driver.findElement(By.xpath("//input[@id='zipCode']"));
        zipCode.sendKeys("21000");

        WebElement emName = driver.findElement(By.xpath("//input[@id='emergencyName']"));
        emName.sendKeys("test rel");

        WebElement emRel = driver.findElement(By.xpath("//input[@id='emergencyRelationship']"));
        emRel.sendKeys("test reletionship");

        WebElement emPhone = driver.findElement(By.xpath("//input[@id='emergencyPhone']"));
        emPhone.sendKeys("0711234567");

        WebElement insurance = driver.findElement(By.xpath("//input[@id='insuranceProvider']"));
        insurance.sendKeys("test provider");

        WebElement policy = driver.findElement(By.xpath("//input[@id='policyNumber']"));
        policy.sendKeys("12345");

        WebElement groupNo = driver.findElement(By.xpath("//input[@id='groupNumber']"));
        groupNo.sendKeys("12345");

        WebElement registerBtn = driver.findElement(By.xpath("//button[normalize-space()='Register Patient']"));
        registerBtn.click();

        WebElement patientList = driver.findElement(By.xpath("//a[normalize-space()='Patients']"));
        patientList.click();

        WebElement edit = driver.findElement(By.cssSelector("tbody tr:nth-child(1) td:nth-child(6) button:nth-child(2) svg"));
        edit.click();

        WebElement updatedField = driver.findElement(By.xpath("//input[@id=':r1v:']"));
        updatedField.clear();
        updatedField.sendKeys("0774526789");

        try{
            Thread.sleep(2000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement saveChanges = driver.findElement(By.xpath("//button[normalize-space()='Save Changes']"));
        saveChanges.click();

        try{
            Thread.sleep(2000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement patientBtn2 = driver.findElement(By.xpath("//a[normalize-space()='Patients']"));
        patientBtn2.click();

        try{
            Thread.sleep(2000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement delete = driver.findElement(By.cssSelector("tbody tr:nth-child(1) td:nth-child(6) button:nth-child(3) svg path"));
        delete.click();

        try{
            Thread.sleep(3000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        WebElement aceept = driver.findElement(By.xpath("//button[normalize-space()='Delete']"));
        aceept.click();
    }
}
