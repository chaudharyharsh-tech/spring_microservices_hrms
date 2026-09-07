package springmvc.dto;

import java.time.Month;
import java.util.Date;

public class SalaryStatementDTO {
    int employee_id;
    int salary;
    int basic_pay;
    int Da;
    int Ta;
    int allowances;
    int bonus;
    Date createdDate;
    Month salaryMonth;

    public int getEmployee_id() {
        return employee_id;
    }

    public void setEmployee_id(int employee_id) {
        this.employee_id = employee_id;
    }

    public int getSalary() {
        return salary;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }

    public int getBasic_pay() {
        return basic_pay;
    }

    public void setBasic_pay(int basic_pay) {
        this.basic_pay = basic_pay;
    }

    public int getDa() {
        return Da;
    }

    public void setDa(int da) {
        Da = da;
    }

    public int getTa() {
        return Ta;
    }

    public void setTa(int ta) {
        Ta = ta;
    }

    public int getAllowances() {
        return allowances;
    }

    public void setAllowances(int allowances) {
        this.allowances = allowances;
    }

    public int getBonus() {
        return bonus;
    }

    public void setBonus(int bonus) {
        this.bonus = bonus;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Month getSalaryMonth() {
        return salaryMonth;
    }

    public void setSalaryMonth(Month salaryMonth) {
        this.salaryMonth = salaryMonth;
    }
}
