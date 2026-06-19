<%@ page import="java.util.List" %>
<html>
<body>
<h2>Hello!</h2>

<% 


List<String> fruits = (List<String>) request.getAttribute("fruits");

for(String f: fruits){

%>
<h1><%= f  %> </h1>
<% } %>
<h1>${fruits}</h1>

</body>
</html>
