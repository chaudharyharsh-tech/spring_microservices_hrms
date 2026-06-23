package springmvc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import springmvc.dto.DailyAttendanceDTO;
import springmvc.dao.EmployeeDao;
import springmvc.exceptions.UserNotDeletedException;
import springmvc.model.Employee;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// @Service tells Spring this class contains business logic
@Service
public class EmployeeService {

    private final EmployeeDao employeeDao;

    @Autowired
    public EmployeeService(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    public boolean saveEmployee(Employee employee) {
        employeeDao.save(employee);
		return true;
    }

    public List<Employee> getAllEmployees() {
        return employeeDao.getAll();
    }

    public Employee getEmployeeById(int id) {
        return employeeDao.getByID(id);
    }

    public boolean deleteEmployee(int id){
        if(employeeDao.delete(id)){
            return true;
        }else {
            throw new UserNotDeletedException("User with id: "+id +
                    " was not deleted due to some errors");
        }
    }

    public boolean markAttendance(Map<String, Object> payload) {
        int id = (int) payload.get("id");
        int status_id = (int) payload.get("status_id");
        String date = (String) payload.get("date");
        LocalDate parsedDate = LocalDate.parse(date);
        employeeDao.markAttendance(id, status_id, parsedDate);
        return true;
    }

    public List<DailyAttendanceDTO> getAttendanceByDate(LocalDate date) {
        return employeeDao.getAttendanceStatuses(date);
    }

    public List<DailyAttendanceDTO> getAttendanceByID(int id) {
        return employeeDao.getAttendanceByUser(id);
    }

}