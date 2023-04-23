/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author KonZioutos
 */
public class LoginUser extends HttpServlet {

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
            response.setStatus(200);
            response.getWriter().write(session.getAttribute("usertype").toString());
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
        response.setHeader("Access-Control-Request-Method", "GET");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String usertype = request.getParameter("login-usertype");
        HttpSession session = request.getSession(true);

        try {
            if (usertype.equalsIgnoreCase("login-user") || usertype.equalsIgnoreCase("login-admin")) {
                if (usertype.equalsIgnoreCase("login-user") && username.equalsIgnoreCase("admin")) {
                    response.setStatus(403);
                    return;
                }
                EditSimpleUserTable esut = new EditSimpleUserTable();
                SimpleUser su = esut.databaseToSimpleUser(username, password);
                if (su == null) {
                    response.setStatus(403);
                } else {
                    if (usertype.equalsIgnoreCase("login-user")) {
                        session.setAttribute("usertype", "simpleuser");
                    } else if (usertype.equalsIgnoreCase("login-admin")) {
                        session.setAttribute("usertype", "admin");
                    }
                    response.setStatus(200);
                    session.setAttribute("loggedIn", username);
                    session.setAttribute("userId", su.getUser_id());
                    response.getWriter().write(session.getAttribute("usertype").toString());
                }
            } else if (usertype.equalsIgnoreCase("login-doctor")) {
                EditDoctorTable edt = new EditDoctorTable();
                Doctor doctor = edt.databaseToDoctor(username, password);
                if (doctor == null) {
                    response.setStatus(403);
                } else {
                    if (doctor.getCertified() == 0) {
                        response.setStatus(403);
                    } else {
                        session.setAttribute("loggedIn", username);
                        session.setAttribute("usertype", "doctor");
                        session.setAttribute("doctorId", doctor.getDoctor_id());
                        response.setStatus(200);
                        response.getWriter().write(session.getAttribute("usertype").toString());
                    }
                }
            } else {
                response.setStatus(403);
                return;
            }

        } catch (SQLException sqlexc) {
            response.setStatus(403);
        } catch (ClassNotFoundException cnfexc) {
            response.setStatus(403);
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
