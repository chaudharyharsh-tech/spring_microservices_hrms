package springmvc.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import springmvc.dto.DailyAttendanceDTO;
import springmvc.model.Employee;
import springmvc.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
	
	private final EmployeeService employeeService;
	
	@Autowired
	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@GetMapping(produces = "application/json")
	public ResponseEntity<List<Employee>> getAllEmployees() {
		List<Employee> employees = employeeService.getAllEmployees();
		return new ResponseEntity<>(employees, HttpStatus.OK);
	}
	
	@GetMapping(value = "/{id}", produces = "application/json")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") int id) {
		Employee emp = employeeService.getEmployeeById(id);
		if (emp != null) {
			return new ResponseEntity<>(emp, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@PostMapping(produces = "application/json")
	public ResponseEntity<Void> createEmployee(@RequestBody Employee employee) {
		boolean isCreated = employeeService.saveEmployee(employee);

		if(isCreated) {
			return ResponseEntity.status(HttpStatus.CREATED).build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping(value = "/{id}", produces = "application/json")
	public ResponseEntity<Void> deleteEmployeeById(@PathVariable("id") int id) {
		boolean isDeleted = employeeService.deleteEmployee(id);
		if(isDeleted) {
			return ResponseEntity.status(HttpStatus.OK).build();
		}else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping(value = "/updateattendance", produces = "application/json")
	public ResponseEntity<Void> markAttendance(@RequestBody Map<String, Object> payload) {
		boolean isAttendanceUpdated = employeeService.markAttendance(payload);
		if(isAttendanceUpdated) {
			return ResponseEntity.status(HttpStatus.OK).build();
		} else{
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping(value = "/attendancebydate", produces="application/json")
	public ResponseEntity<List<DailyAttendanceDTO>> getAttendanceByDate(
			@RequestBody Map<String, Object> payload) {
		LocalDate date = LocalDate.parse((String)payload.get("date"));
		List<DailyAttendanceDTO> dailyAttendanceDTOS = employeeService.getAttendanceByDate(date);
		if(dailyAttendanceDTOS != null && !dailyAttendanceDTOS.isEmpty()) {
			return ResponseEntity.status(HttpStatus.OK).body(dailyAttendanceDTOS);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@GetMapping(value="attendancebyid/{id}", produces="application/json")
	public ResponseEntity<List<DailyAttendanceDTO>> getAttendanceByID(@PathVariable("id") int id) {
		List<DailyAttendanceDTO> dailyAttendanceDTOS = employeeService.getAttendanceByID(id);
		if(dailyAttendanceDTOS != null && !dailyAttendanceDTOS.isEmpty()) {
			return ResponseEntity.status(HttpStatus.OK).body(dailyAttendanceDTOS);
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

	}
}