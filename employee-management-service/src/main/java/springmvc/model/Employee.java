package springmvc.model;

import jakarta.validation.constraints.NotNull;

import java.sql.Date;

public class Employee {
	@NotNull(message = "ID cannot be null")
	private int id;
	@NotNull
	private String name;
	@NotNull
	private String position;
	private Date dateOfBirth;
	private Date dateOfJoining;
	private String aadharNumber;
	private String ESINo;
	private int esiContribution;

	public Employee() {}

	public Employee(int id, String name, String position, Date dateOfBirth) {
		this.id = id;
		this.name = name;
		this.position = position;
		this.dateOfBirth = dateOfBirth;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public Date getDateOfJoining() {
		return dateOfJoining;
	}

	public void setDateOfJoining(Date dateOfJoining) {
		this.dateOfJoining = dateOfJoining;
	}

	public String getAadharNumber() {
		return aadharNumber;
	}

	public void setAadharNumber(String aadharNumber) {
		this.aadharNumber = aadharNumber;
	}

	public String getESINo() {
		return ESINo;
	}

	public void setESINo(String ESINo) {
		this.ESINo = ESINo;
	}

	public int getEsiContribution() {
		return esiContribution;
	}

	public void setEsiContribution(int esiContribution) {
		this.esiContribution = esiContribution;
	}
}
