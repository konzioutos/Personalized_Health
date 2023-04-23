/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;


import com.google.gson.Gson;
import database.tables.EditSimpleUserTable;
import database.tables.EditTreatmentTable;
import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.JSON_Converter;
import mainClasses.SimpleUser;
import mainClasses.Treatment;

/**
 *
 * @author KonZioutos
 */
public class Treatments extends HttpServlet {

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
            if (action.equalsIgnoreCase("getTreatment")) {
                int bloodtestId = Integer.parseInt(request.getParameter("bloodtestId"));
                EditTreatmentTable ett = new EditTreatmentTable();
                Treatment tr = ett.getBloodtestTreatment(bloodtestId);
                if (tr == null) {
                    response.setStatus(403);
                    response.getWriter().println("The requested treatment does not exist.");
                    return;
                }
                String json = new Gson().toJson(tr);
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
        HttpSession session = request.getSession();
        int doctorId = -1;
        if (session.getAttribute("doctorId") != null) {
            doctorId = (int) session.getAttribute("doctorId");
        } else {
            response.setStatus(403);
            response.getWriter().println("Session error");
            return;
        }

        try {
            EditTreatmentTable ett = new EditTreatmentTable();
            JSON_Converter jc = new JSON_Converter();
            String jsonData = jc.getJSONFromAjax(request.getReader());
            Gson gson = new Gson();
            Treatment tr = gson.fromJson(jsonData, Treatment.class);
            Treatment existsTreatment = ett.getBloodtestTreatment(tr.getBloodtest_id());
            if (existsTreatment != null) {
                response.setStatus(403);
                response.getWriter().println("There is already registered treatment for this blood test.");
                return;
            }
            tr.setDoctor_id(doctorId);
            EditSimpleUserTable esut = new EditSimpleUserTable();
            SimpleUser su = esut.getSimpleUserByAmka(tr.getAMKA());
            tr.setUser_id(su.getUser_id());

            ett.createNewTreatment(tr);
            response.setStatus((200));
        } catch (SQLException sqlexc) {
            response.setStatus(403);
            response.getWriter().println("Database error.");
        } catch (ClassNotFoundException cnfexc) {
            response.setStatus(403);
            response.getWriter().println("Uknown error occured.");
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
