package springmvc.dto;

import java.time.Month;
import java.util.Date;

public class SalaryStatementRequest {
    int employee_id;
    int salary;
    int basic_pay;
    int Da;
    int Ta;
    int allowances;
    int bonus;
    Date createdDate;
    Month salaryMonth;
}
