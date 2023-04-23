/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.SimpleUser;

/**
 *
 * @author KonZioutos
 */
public class EditDetails extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet EditDetails</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet EditDetails at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        if (session.getAttribute("loggedIn") != null) {
            String username = session.getAttribute("loggedIn").toString();
            String usertype = session.getAttribute("usertype").toString();
            try {
                if (usertype.equalsIgnoreCase("admin") || usertype.equalsIgnoreCase("simpleuser")) {
                    EditSimpleUserTable esut = new EditSimpleUserTable();
                    String json = esut.databaseUserToJSON(username);
                    response.getWriter().write(json);
                    response.setStatus(200);
                } else if (usertype.equalsIgnoreCase("doctor")) {
                    EditDoctorTable esut = new EditDoctorTable();
                    String json = esut.databaseToJSON(username);
                    response.getWriter().write(json);
                    response.setStatus(200);
                } else {
                    response.setStatus(403);
                }
            } catch (SQLException sqlexc) {

            } catch (ClassNotFoundException cnfe) {

            }

        } else {
            response.setStatus(403);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Request-Method", "POST");
        String usertype = null;
        HttpSession session = request.getSession();

        if (session.getAttribute("loggedIn") != null) {
            usertype = session.getAttribute("usertype").toString();
        } else {
            response.setStatus(403);
            response.getWriter().println("Session error");
            return;
        }

        JSON_Converter jc = new JSON_Converter();
        String jsonData = jc.getJSONFromAjax(request.getReader());
        Gson gson = new Gson();

        try {
            if (usertype.equalsIgnoreCase("doctor")) {
                Doctor doctor = gson.fromJson(jsonData, Doctor.class);
                EditDoctorTable edt = new EditDoctorTable();
                edt.updateDoctor(doctor);
            } else if (usertype.equalsIgnoreCase("simpleuser")) {
                SimpleUser u = gson.fromJson(jsonData, SimpleUser.class);
                EditSimpleUserTable esut = new EditSimpleUserTable();
                esut.updateSimpleUser(u);
            } else {
                response.setStatus(403);
                response.getWriter().println("Not allowed for admin error");
                return;
            }
        } catch (SQLException sqlexc) {
            response.getWriter().println("SQLException error");
            response.setStatus(403);
            return;
        } catch (ClassNotFoundException cnfe) {
            response.getWriter().println("ClassNotFoundException error");
            response.setStatus(403);
            return;
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
