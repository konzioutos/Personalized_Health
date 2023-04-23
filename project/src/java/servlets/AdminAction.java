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
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author KonZioutos
 */
public class AdminAction extends HttpServlet {

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
            out.println("<title>Servlet AdminAction</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet AdminAction at " + request.getParameter("action") + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    protected void sendDoctors(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException, ClassNotFoundException {
        response.setContentType("text/html;charset=UTF-8");
        EditDoctorTable edt = new EditDoctorTable();
        ArrayList<Doctor> doctors = edt.databaseToDoctors();
        String json = new Gson().toJson(doctors);
        response.getWriter().write(json);
    }

    protected void sendUsers(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException, ClassNotFoundException {
        response.setContentType("text/html;charset=UTF-8");
        EditSimpleUserTable esut = new EditSimpleUserTable();
        ArrayList<SimpleUser> users = esut.getUsers();
        String json = new Gson().toJson(users);
        response.getWriter().write(json);
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
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Request-Method", "GET");

        /*HttpSession session = request.getSession(true);

        if (session.getAttribute("loggedIn") != null) {
            response.setStatus(403);
            return;
        }*/

        String action = request.getParameter("action");

        try {
            if (action.equalsIgnoreCase("getusers")) {
                response.setStatus(200);
                sendUsers(request, response);
            } else if (action.equalsIgnoreCase("certifydoctors")) { //TODO: Could be better to rename to getdoctors
                response.setStatus(200);
                sendDoctors(request, response);
            } else if (action.equalsIgnoreCase("certifydoctor")) {
                int doctorId = Integer.parseInt(request.getParameter("doctorId"));
                EditDoctorTable edt = new EditDoctorTable();
                edt.certifyDoctor(doctorId);
                response.setStatus(200);
                sendDoctors(request, response);
            } else if (action.equalsIgnoreCase("deleteuser")) {
                int userId = Integer.parseInt(request.getParameter("userId"));
                EditSimpleUserTable esut = new EditSimpleUserTable();
                esut.deleteSimpleUser(userId);
                response.setStatus(200);
                sendUsers(request, response);
            } else {
                response.setStatus(403);
            }
        } catch (SQLException sqlexc) {
            response.setStatus(403);
        } catch (ClassNotFoundException ex) {
            response.setStatus(403);
            Logger.getLogger(AdminAction.class.getName()).log(Level.SEVERE, null, ex);
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
        processRequest(request, response);
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
