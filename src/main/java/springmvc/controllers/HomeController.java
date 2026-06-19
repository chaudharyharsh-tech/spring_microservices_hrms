package springmvc.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {	
	@RequestMapping("/home")
	public String home(Model model) {
		List<String> fruits = new ArrayList<String>();
		fruits.add("Apple");
		fruits.add("juice");
		model.addAttribute("fruits", fruits);
		return "index";
	}
}
