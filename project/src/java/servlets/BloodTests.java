/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditBloodTestTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.BloodTest;
import mainClasses.SimpleUser;

/**
 *
 * @author KonZioutos
 */
public class BloodTests extends HttpServlet {

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
        int doctorId = -1;
        if (session.getAttribute("doctorId") != null) {
            doctorId = (int) session.getAttribute("doctorId");
        } else {
            response.setStatus(403);
            response.getWriter().println("Session error");
            return;
        }

        String action = request.getParameter("action");

        try {
            if (action.equalsIgnoreCase("getTests")) {
                int userId = Integer.parseInt(request.getParameter("userId"));
                EditSimpleUserTable esut = new EditSimpleUserTable();
                SimpleUser su = esut.databaseToSimpleUser(userId);
                if (su == null) {
                    response.setStatus(403);
                    response.getWriter().println("You requested tests for uknown user.");
                    return;
                }
                EditBloodTestTable ebt = new EditBloodTestTable();
                ArrayList<BloodTest> bloodtests = ebt.databaseToBloodTest(su.getAmka());
                String json = new Gson().toJson(bloodtests);
                response.getWriter().write(json);
                response.setStatus(200);
            } else {
                response.setStatus(403);
                response.getWriter().println("Invalid request.");
            }
        } catch (NumberFormatException nfe) {
            response.setStatus(403);
            response.getWriter().println("Invalid user id given.");
        } catch (SQLException sqlexc) {
            response.setStatus(403);
            response.getWriter().println("Database error.");
        } catch (ClassNotFoundException cnfexc) {
            response.setStatus(403);
            response.getWriter().println("Uknown error occured.");
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
        ;
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
